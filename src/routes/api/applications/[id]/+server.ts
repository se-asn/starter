// LaufplanerPro - Individual Application Management API
// Handle specific application operations (update status, add notes, etc.)

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { emailService } from '$lib/email-service';
import type { RequestHandler } from './$types';

// Update application status and add admin notes
export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const applicationId = params.id;
		const { status, adminNotes, adminId } = await request.json();

		// Validate inputs
		if (!applicationId) {
			return json({ error: 'Application ID required' }, { status: 400 });
		}

		const validStatuses = ['pending', 'reviewing', 'approved', 'rejected', 'on_hold'];
		if (status && !validStatuses.includes(status)) {
			return json({ error: 'Invalid status' }, { status: 400 });
		}

		// Check admin authentication
		const authHeader = request.headers.get('Authorization');
		if (!authHeader) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const token = authHeader.replace('Bearer ', '');
		const { data: { user }, error: authError } = await supabase.auth.getUser(token);

		if (authError || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check if user is admin
		const { data: adminUser } = await supabase
			.from('admin_users')
			.select('*')
			.eq('user_id', user.id)
			.single();

		if (!adminUser) {
			return json({ error: 'Forbidden - Admin access required' }, { status: 403 });
		}

		// Get current application
		const { data: currentApp, error: fetchError } = await supabase
			.from('athlete_applications')
			.select('*')
			.eq('id', applicationId)
			.single();

		if (fetchError || !currentApp) {
			return json({ error: 'Application not found' }, { status: 404 });
		}

		// Prepare update data
		const updateData: any = {
			updated_at: new Date().toISOString()
		};

		if (status) {
			updateData.status = status;
			updateData.reviewed_by = user.id;
			updateData.reviewed_at = new Date().toISOString();
		}

		if (adminNotes) {
			updateData.admin_notes = adminNotes;
		}

		// Update application
		const { data: updatedApp, error: updateError } = await supabase
			.from('athlete_applications')
			.update(updateData)
			.eq('id', applicationId)
			.select()
			.single();

		if (updateError) {
			console.error('Update error:', updateError);
			return json({ error: 'Failed to update application' }, { status: 500 });
		}

		// Add admin note if provided
		if (adminNotes) {
			await supabase.from('application_notes').insert({
				application_id: applicationId,
				admin_id: user.id,
				note: adminNotes
			});
		}

		// Send status change notification email
		if (status && status !== currentApp.status) {
			try {
				await emailService.sendStatusNotification({
					firstName: updatedApp.first_name,
					lastName: updatedApp.last_name,
					email: updatedApp.email,
					status: status,
					applicationId: updatedApp.id,
					reviewDate: new Date().toISOString(),
					adminNotes: adminNotes
				});
			} catch (emailError) {
				console.error('Email notification error:', emailError);
			}
		}

		return json({
			success: true,
			application: updatedApp,
			message: 'Application updated successfully'
		});

	} catch (error) {
		console.error('Application update error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// Get specific application details
export const GET: RequestHandler = async ({ params, request }) => {
	try {
		const applicationId = params.id;

		if (!applicationId) {
			return json({ error: 'Application ID required' }, { status: 400 });
		}

		// Check admin authentication
		const authHeader = request.headers.get('Authorization');
		if (!authHeader) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const token = authHeader.replace('Bearer ', '');
		const { data: { user }, error: authError } = await supabase.auth.getUser(token);

		if (authError || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check if user is admin
		const { data: adminUser } = await supabase
			.from('admin_users')
			.select('*')
			.eq('user_id', user.id)
			.single();

		if (!adminUser) {
			return json({ error: 'Forbidden - Admin access required' }, { status: 403 });
		}

		// Get application with related data
		const { data: application, error } = await supabase
			.from('athlete_applications')
			.select(`
				*,
				application_notes(
					id,
					note,
					created_at,
					admin_id
				)
			`)
			.eq('id', applicationId)
			.single();

		if (error || !application) {
			return json({ error: 'Application not found' }, { status: 404 });
		}

		return json({
			success: true,
			application
		});

	} catch (error) {
		console.error('Get application error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// Delete application (admin only, use with caution)
export const DELETE: RequestHandler = async ({ params, request }) => {
	try {
		const applicationId = params.id;

		if (!applicationId) {
			return json({ error: 'Application ID required' }, { status: 400 });
		}

		// Check admin authentication
		const authHeader = request.headers.get('Authorization');
		if (!authHeader) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const token = authHeader.replace('Bearer ', '');
		const { data: { user }, error: authError } = await supabase.auth.getUser(token);

		if (authError || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check if user is super admin (only super admins can delete)
		const { data: adminUser } = await supabase
			.from('admin_users')
			.select('*')
			.eq('user_id', user.id)
			.eq('role', 'super_admin')
			.single();

		if (!adminUser) {
			return json({ error: 'Forbidden - Super admin access required' }, { status: 403 });
		}

		// Delete application (cascades to related records)
		const { error: deleteError } = await supabase
			.from('athlete_applications')
			.delete()
			.eq('id', applicationId);

		if (deleteError) {
			console.error('Delete error:', deleteError);
			return json({ error: 'Failed to delete application' }, { status: 500 });
		}

		return json({
			success: true,
			message: 'Application deleted successfully'
		});

	} catch (error) {
		console.error('Delete application error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// Send status change notification email
async function sendStatusChangeEmail(application: any, oldStatus: string, newStatus: string) {
	const emailTemplates = {
		approved: {
			subject: '🎉 Bewerbung bei LaufplanerPro angenommen!',
			body: `Hallo ${application.first_name},

wir freuen uns, Ihnen mitteilen zu können, dass Ihre Bewerbung bei LaufplanerPro angenommen wurde!

Sie können sich nun mit Ihren Zugangsdaten anmelden:
E-Mail: ${application.email}

Ihr LaufplanerPro Team`
		},
		rejected: {
			subject: 'Bewerbung bei LaufplanerPro',
			body: `Hallo ${application.first_name},

vielen Dank für Ihre Bewerbung bei LaufplanerPro.

Nach sorgfältiger Prüfung müssen wir Ihnen leider mitteilen, dass wir Ihre Bewerbung derzeit nicht berücksichtigen können.

Wir wünschen Ihnen weiterhin viel Erfolg bei Ihrem Training!

Ihr LaufplanerPro Team`
		},
		on_hold: {
			subject: 'Bewerbung bei LaufplanerPro - Status Update',
			body: `Hallo ${application.first_name},

Ihre Bewerbung bei LaufplanerPro befindet sich derzeit in der erweiterten Prüfung.

Wir werden uns in Kürze bei Ihnen melden.

Ihr LaufplanerPro Team`
		}
	};

	const template = emailTemplates[newStatus as keyof typeof emailTemplates];
	if (!template) return;

	// Log email notification
	await supabase.from('email_notifications').insert({
		application_id: application.id,
		email_type: `status_change_${newStatus}`,
		recipient_email: application.email,
		subject: template.subject,
		body: template.body,
		status: 'sent'
	});

	console.log(`Status change email sent to ${application.email}: ${oldStatus} -> ${newStatus}`);
}

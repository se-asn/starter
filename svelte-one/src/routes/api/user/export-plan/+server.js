// API endpoint to export training plans
import { json } from '@sveltejs/kit';
import { checkRateLimit, getSecurityHeaders } from '$lib/server/security';
import { generateICS, generateCSV, generatePDFData } from '$lib/export';

// Import data from server module
import { userTrainingPlans, availableTrainingPlans } from '$lib/server/training-plans-data.js';

// GET: Export a user's training plan to different formats
export async function GET({ url, locals, getClientAddress }) {
	try {
		// Check authentication
		if (!locals.user) {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		const userId = locals.user.id;

		// Apply rate limiting
		const clientIp = getClientAddress();
		if (!checkRateLimit(`export_plan_${clientIp}`, 10, 60000)) {
			return json(
				{
					error: 'Zu viele Anfragen. Bitte versuche es später erneut.'
				},
				{
					status: 429,
					headers: {
						'Retry-After': '60'
					}
				}
			);
		}

		// Get parameters
		const planId = url.searchParams.get('planId');
		const format = url.searchParams.get('format') || 'ics';

		if (!planId) {
			return json({ error: 'Plan-ID ist erforderlich' }, { status: 400 });
		}

		// Find the user's plan
		const userPlan = userTrainingPlans.find((p) => p.userId === userId && p.planId === planId);

		if (!userPlan) {
			return json({ error: 'Trainingsplan nicht gefunden' }, { status: 404 });
		}

		// Find the plan details
		const planDetails = availableTrainingPlans.find((p) => p.id === planId);

		if (!planDetails) {
			return json({ error: 'Plandetails nicht gefunden' }, { status: 404 });
		}

		// Generate the export in the requested format
		let exportData;
		let filename;
		let contentType;

		switch (format.toLowerCase()) {
			case 'ics':
				exportData = generateICS(planDetails, userPlan);
				filename = `trainingsplan-${planId}.ics`;
				contentType = 'text/calendar';
				break;

			case 'csv':
				exportData = generateCSV(planDetails, userPlan);
				filename = `trainingsplan-${planId}.csv`;
				contentType = 'text/csv';
				break;

			case 'pdf':
				// In a real app, this would return actual PDF data
				// For this prototype, we just return metadata
				return json(
					{
						pdfMetadata: generatePDFData(planDetails, userPlan),
						message: 'PDF-Export in einer echten App würde hier die PDF-Datei zurückgeben'
					},
					{ headers: getSecurityHeaders() }
				);

			default:
				return json({ error: 'Ungültiges Exportformat' }, { status: 400 });
		}

		// Return the export data with appropriate headers
		return new Response(exportData, {
			headers: {
				'Content-Type': contentType,
				'Content-Disposition': `attachment; filename="${filename}"`,
				...getSecurityHeaders()
			}
		});
	} catch (error) {
		console.error('Error exporting training plan:', error);
		return json({ error: 'Serverfehler beim Exportieren des Trainingsplans' }, { status: 500 });
	}
}

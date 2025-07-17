// LaufplanerPro - Admin Authentication API
// Handle admin user creation and verification

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { RequestHandler } from './$types';

// Create admin user
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password, role = 'admin' } = await request.json();

		if (!email || !password) {
			return json({ 
				success: false, 
				error: 'Email and password are required' 
			}, { status: 400 });
		}

		// Create user in Supabase Auth
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name: 'Admin User',
					role: 'admin'
				}
			}
		});

		if (authError) {
			return json({ 
				success: false, 
				error: authError.message 
			}, { status: 400 });
		}

		if (!authData.user) {
			return json({ 
				success: false, 
				error: 'Failed to create user' 
			}, { status: 500 });
		}

		// Add user to admin_users table
		const { error: adminError } = await supabase
			.from('admin_users')
			.insert({
				user_id: authData.user.id,
				role: role,
				permissions: JSON.stringify([
					'review_applications',
					'approve_applications',
					role === 'super_admin' ? 'manage_admins' : null,
					role === 'super_admin' ? 'view_analytics' : null
				].filter(Boolean))
			});

		if (adminError) {
			console.error('Admin user creation error:', adminError);
			return json({ 
				success: false, 
				error: 'Failed to create admin user' 
			}, { status: 500 });
		}

		return json({
			success: true,
			message: 'Admin user created successfully',
			user: {
				id: authData.user.id,
				email: authData.user.email,
				role: role
			}
		});

	} catch (error) {
		console.error('Admin creation error:', error);
		return json({ 
			success: false, 
			error: 'Internal server error' 
		}, { status: 500 });
	}
};

// Check admin status
export const GET: RequestHandler = async ({ request }) => {
	try {
		const authHeader = request.headers.get('Authorization');
		if (!authHeader) {
			return json({ 
				success: false, 
				error: 'Unauthorized' 
			}, { status: 401 });
		}

		const token = authHeader.replace('Bearer ', '');
		const { data: { user }, error: authError } = await supabase.auth.getUser(token);

		if (authError || !user) {
			return json({ 
				success: false, 
				error: 'Unauthorized' 
			}, { status: 401 });
		}

		// Check if user is admin
		const { data: adminUser, error: adminError } = await supabase
			.from('admin_users')
			.select('*')
			.eq('user_id', user.id)
			.single();

		if (adminError || !adminUser) {
			return json({ 
				success: false, 
				error: 'Not an admin user',
				isAdmin: false 
			}, { status: 403 });
		}

		return json({
			success: true,
			isAdmin: true,
			admin: {
				id: adminUser.id,
				role: adminUser.role,
				permissions: adminUser.permissions,
				user: {
					id: user.id,
					email: user.email
				}
			}
		});

	} catch (error) {
		console.error('Admin check error:', error);
		return json({ 
			success: false, 
			error: 'Internal server error' 
		}, { status: 500 });
	}
};

// Admin reporting API
import { json } from '@sveltejs/kit';
import { checkRateLimit, getSecurityHeaders } from '$lib/server/security';
import {
	getActiveUsersStats,
	getTrainingPlanStats,
	getMonthlyActivityData,
	getCompletionByDayOfWeek
} from '$lib/server/reporting.js';

// GET: Get reporting data for the admin dashboard
export async function GET({ locals, getClientAddress }) {
	try {
		// Check authentication and admin role
		if (!locals.user || locals.user.role !== 'admin') {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		// Apply rate limiting
		const clientIp = getClientAddress();
		if (!checkRateLimit(`admin_reporting_${clientIp}`, 20, 60000)) {
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

		// Get all reporting data
		const userStats = getActiveUsersStats();
		const planStats = getTrainingPlanStats();
		const monthlyActivity = getMonthlyActivityData();
		const dayOfWeekCompletion = getCompletionByDayOfWeek();

		return json(
			{
				userStats,
				planStats,
				monthlyActivity,
				dayOfWeekCompletion
			},
			{
				headers: getSecurityHeaders()
			}
		);
	} catch (error) {
		console.error('Error getting reporting data:', error);
		return json({ error: 'Serverfehler beim Abrufen der Reporting-Daten' }, { status: 500 });
	}
}

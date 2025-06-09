// API endpoint to handle training session notifications
import { json } from '@sveltejs/kit';
import { checkRateLimit, getSecurityHeaders } from '$lib/server/security';
import {
	checkAndSendTrainingNotifications,
	getNotificationPreferences,
	setNotificationPreferences
} from '$lib/server/notifications';

// GET: Get notification preferences
export async function GET({ locals, getClientAddress }) {
	try {
		// Check authentication
		if (!locals.user) {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		const userId = locals.user.id;

		// Apply rate limiting
		const clientIp = getClientAddress();
		if (!checkRateLimit(`get_notification_prefs_${clientIp}`, 20, 60000)) {
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

		// Get user's notification preferences
		const preferences = getNotificationPreferences(userId);

		return json(
			{ preferences },
			{
				headers: getSecurityHeaders()
			}
		);
	} catch (error) {
		console.error('Error fetching notification preferences:', error);
		return json(
			{ error: 'Serverfehler beim Abrufen der Benachrichtigungseinstellungen' },
			{ status: 500 }
		);
	}
}

// PUT: Update notification preferences
export async function PUT({ request, locals, getClientAddress }) {
	try {
		// Check authentication
		if (!locals.user) {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		const userId = locals.user.id;

		// Apply rate limiting
		const clientIp = getClientAddress();
		if (!checkRateLimit(`update_notification_prefs_${clientIp}`, 10, 60000)) {
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

		const preferences = await request.json();

		// Validate preferences
		if (typeof preferences !== 'object') {
			return json({ error: 'Ungültige Einstellungen' }, { status: 400 });
		}

		// Update the preferences
		const updatedPreferences = setNotificationPreferences(userId, preferences);

		return json(
			{
				success: true,
				preferences: updatedPreferences
			},
			{
				headers: getSecurityHeaders()
			}
		);
	} catch (error) {
		console.error('Error updating notification preferences:', error);
		return json(
			{ error: 'Serverfehler beim Aktualisieren der Benachrichtigungseinstellungen' },
			{ status: 500 }
		);
	}
}

// Admin API endpoint to get all users
import { json } from '@sveltejs/kit';
import { checkRateLimit, getSecurityHeaders } from '$lib/server/security';

// In einer echten Anwendung würden diese Daten aus einer Datenbank kommen
const users = [
	{
		id: 'user1',
		name: 'Max Mustermann',
		email: 'max@example.com',
		role: 'user',
		createdAt: '2023-01-15T10:30:00Z'
	},
	{
		id: 'user2',
		name: 'Anna Schmidt',
		email: 'anna@example.com',
		role: 'user',
		createdAt: '2023-02-25T14:45:00Z'
	},
	{
		id: 'user3',
		name: 'Thomas Müller',
		email: 'thomas@example.com',
		role: 'user',
		createdAt: '2023-03-10T09:15:00Z'
	},
	{
		id: 'user4',
		name: 'Julia Weber',
		email: 'julia@example.com',
		role: 'user',
		createdAt: '2023-04-05T16:20:00Z'
	},
	{
		id: 'admin1',
		name: 'Admin User',
		email: 'admin@example.com',
		role: 'admin',
		createdAt: '2023-01-01T08:00:00Z'
	}
];

export async function GET({ locals, getClientAddress }) {
	try {
		// Authentifizierung überprüfen
		if (!locals.user || locals.user.role !== 'admin') {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		// Rate-Limiting anwenden
		const clientIp = getClientAddress();
		if (!checkRateLimit(`admin_get_users_${clientIp}`, 20, 60000)) {
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

		// Filtere sensible Daten heraus (in einem echten System)
		const safeUsers = users.map((user) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt
		}));

		return json(
			{ users: safeUsers },
			{
				headers: getSecurityHeaders()
			}
		);
	} catch (error) {
		console.error('Error fetching users:', error);
		return json({ error: 'Serverfehler beim Abrufen der Benutzer' }, { status: 500 });
	}
}

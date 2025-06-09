import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { dev } from '$app/environment';

// Demo-Benutzer-Array (in Produktion: Datenbank verwenden)
const DEV_USERS = [
	{
		id: '1',
		email: 'demo@example.com',
		name: 'Demo Nutzer',
		// bcrypt Hash von 'demo123'
		passwordHash: '$2a$10$uQFgKLRgDQGgYFk.LtOcgeVX9vZtUDZvMjVpQXdwXv1zgTzV6OEu.',
		createdAt: new Date().toISOString()
	}
];

export async function PUT({ request, locals }) {
	try {
		// Benutzer muss angemeldet sein
		if (!locals.user) {
			return json(
				{
					success: false,
					message: 'Nicht authentifiziert'
				},
				{ status: 401 }
			);
		}

		const userId = locals.user.id;
		const updateData = await request.json();
		const { name, email, currentPassword, newPassword } = updateData;

		// Benutzer in der "Datenbank" finden
		const userIndex = DEV_USERS.findIndex((u) => u.id === userId);
		if (userIndex === -1) {
			return json(
				{
					success: false,
					message: 'Benutzer nicht gefunden'
				},
				{ status: 404 }
			);
		}

		// Aktuelle Benutzerdaten
		const user = DEV_USERS[userIndex];

		// E-Mail-Validierung (falls sich die E-Mail ändert)
		if (email !== user.email) {
			// Prüfen, ob E-Mail bereits verwendet wird
			if (DEV_USERS.some((u) => u.id !== userId && u.email === email)) {
				return json(
					{
						success: false,
						message: 'Diese E-Mail-Adresse wird bereits verwendet'
					},
					{ status: 400 }
				);
			}
		}

		// Passwortänderung
		if (currentPassword && newPassword) {
			// Aktuelles Passwort überprüfen
			const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
			if (!isPasswordValid) {
				return json(
					{
						success: false,
						message: 'Das aktuelle Passwort ist falsch'
					},
					{ status: 400 }
				);
			}

			// Neues Passwort hashen
			const saltRounds = 10;
			user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
		}

		// Profilinformationen aktualisieren
		user.name = name;
		user.email = email;

		// Aktualisierte Benutzerdaten zurückgeben (ohne sensible Informationen)
		return json({
			success: true,
			user: {
				id: user.id,
				name: user.name,
				email: user.email
			}
		});
	} catch (error) {
		console.error('Profile update error:', error);
		return json(
			{
				success: false,
				message: 'Serverfehler'
			},
			{ status: 500 }
		);
	}
}

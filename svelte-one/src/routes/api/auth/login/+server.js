import { json } from '@sveltejs/kit';
import { authenticateUser, createJWT } from '$lib/server/auth';
import { randomUUID } from 'crypto';

export async function POST({ request, cookies }) {
	try {
		// Direkt Variablen mit anderen Namen verwenden
		const data = await request.json();
		const { email: userEmail, password: userPassword, rememberMe } = data;

		const user = await authenticateUser(userEmail, userPassword);

		if (!user) {
			return json({ success: false, message: 'Ungültige Anmeldedaten' }, { status: 401 });
		}

		// JWT Token erstellen
		const jwt = await createJWT(user.id, rememberMe ? '30d' : '7d');

		// Session-ID erstellen
		const sessionId = randomUUID();

		// Session setzen
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
		});

		return json({
			success: true,
			user: user
		});
	} catch (error) {
		console.error('Login error:', error);
		return json({ success: false, message: 'Serverfehler' }, { status: 500 });
	}
}

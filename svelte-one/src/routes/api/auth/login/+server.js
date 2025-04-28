import { json } from '@sveltejs/kit';
import { authenticateUser } from '$lib/server/auth';

export async function POST({ request, cookies }) {
	try {
		// Direkt Variablen mit anderen Namen verwenden
		const data = await request.json();
		const { email: userEmail, password: userPassword, rememberMe } = data;

		const user = await authenticateUser(userEmail, userPassword);

		if (!user) {
			return json({ success: false, message: 'Ungültige Anmeldedaten' }, { status: 401 });
		}

		// Session setzen
		cookies.set('session', 'test-session-123', {
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

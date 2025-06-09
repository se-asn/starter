import { json } from '@sveltejs/kit';
import { registerUser } from '$lib/server/auth';

export async function POST({ request, cookies }) {
	try {
		const data = await request.json();
		const { name, email, password } = data;

		// Grundlegende Validierung
		if (!name || !email || !password) {
			return json(
				{ success: false, message: 'Bitte alle erforderlichen Felder ausfüllen' },
				{ status: 400 }
			);
		}

		// Email-Validierung (einfache Überprüfung)
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ success: false, message: 'Ungültige E-Mail-Adresse' }, { status: 400 });
		}

		// Passwortvalidierung
		if (password.length < 8) {
			return json(
				{ success: false, message: 'Das Passwort muss mindestens 8 Zeichen lang sein' },
				{ status: 400 }
			);
		}

		// Registrierung durchführen
		const result = await registerUser({ name, email, password });

		if (!result.success) {
			return json({ success: false, message: result.message }, { status: 400 });
		}

		// Session setzen
		cookies.set('session', result.sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 1 Woche
		});

		return json({
			success: true,
			user: result.user
		});
	} catch (error) {
		console.error('Registration error:', error);
		return json({ success: false, message: 'Serverfehler' }, { status: 500 });
	}
}

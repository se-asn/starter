export async function handle({ event, resolve }) {
	// Testuser direkt hier deklariert - keine externe Abhängigkeit nötig
	const authUser = {
		id: '1',
		email: 'demo@example.com',
		name: 'Demo Nutzer'
	};

	// Login-Route abfangen
	if (event.url.pathname === '/api/auth/login' && event.request.method === 'POST') {
		const data = await event.request.json();

		// Einfache Validierung
		if (data.email === 'demo@example.com' && data.password === 'demo123') {
			event.cookies.set('session', 'demo-session', {
				path: '/',
				httpOnly: true
			});

			return new Response(
				JSON.stringify({
					success: true,
					user: authUser
				}),
				{
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		return new Response(
			JSON.stringify({
				success: false,
				message: 'Ungültige Anmeldedaten'
			}),
			{
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	// Logout-Route abfangen
	if (event.url.pathname === '/api/auth/logout' && event.request.method === 'POST') {
		event.cookies.delete('session', { path: '/' });
		return new Response(JSON.stringify({ success: true }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Me-Endpunkt abfangen
	if (event.url.pathname === '/api/auth/me') {
		const hasSession = event.cookies.get('session') === 'demo-session';

		if (hasSession) {
			return new Response(
				JSON.stringify({
					success: true,
					user: authUser
				}),
				{
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		return new Response(
			JSON.stringify({
				success: false,
				message: 'Nicht angemeldet'
			}),
			{
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	// Normale Requests - Benutzerdaten in locals setzen wenn angemeldet
	if (event.cookies.get('session') === 'demo-session') {
		event.locals.user = authUser;
	}

	return resolve(event);
}

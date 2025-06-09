import { getUserFromSession } from '$lib/server/auth';

export async function handle({ event, resolve }) {
	// Session aus Cookie abrufen
	const sessionId = event.cookies.get('session');

	// Wenn eine Session vorhanden ist, Benutzer abrufen und in locals speichern
	if (sessionId) {
		const user = await getUserFromSession(sessionId);
		if (user) {
			event.locals.user = user;
		}
	}

	// CSRF-Schutz hinzufügen
	if (event.request.method !== 'GET' && event.request.method !== 'HEAD') {
		const requestOrigin = event.request.headers.get('origin');
		const host = event.request.headers.get('host');

		if (requestOrigin && !requestOrigin.includes(host)) {
			return new Response('CSRF-Schutz: Ungültiger Origin-Header', { status: 403 });
		}
	}

	// Request an die Route handler weitergeben
	return resolve(event);
}

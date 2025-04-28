// Komplett neu implementierte Version ohne doppelte Variablennamen
import { dev } from '$app/environment';

// Demo-Benutzer für Entwicklung
const DEV_USERS = [
	{
		id: '1',
		email: 'demo@example.com',
		name: 'Demo Nutzer',
		passwordHash: 'demo123', // In Produktion: bcrypt Hash
		createdAt: new Date().toISOString()
	}
];

export async function authenticateUser(userEmail, userPassword) {
	// In Entwicklungsumgebung: Einfache In-Memory-Prüfung
	const user = DEV_USERS.find((u) => u.email === userEmail);
	if (!user) return null;

	// Einfacher Passwortvergleich (in Produktion mit bcryptjs ersetzen)
	if (user.passwordHash !== userPassword) return null;

	// Sicherheitskritische Informationen nicht zurückgeben
	return {
		id: user.id,
		email: user.email,
		name: user.name
	};
}

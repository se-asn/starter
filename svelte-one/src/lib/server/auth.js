import { dev } from '$app/environment';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { randomUUID } from 'crypto';

// Secret Key für JWT (In Produktion in .env-Datei oder sicherer Speicherort!)
const JWT_SECRET = new TextEncoder().encode(
	dev ? 'dev_jwt_secret_key_change_in_production' : process.env.JWT_SECRET
);

// In-Memory Benutzerdatenbank für Entwicklung
// In Produktion durch echte Datenbank ersetzen!
const DEV_USERS = [
	{
		id: '1',
		email: 'demo@example.com',
		name: 'Demo Nutzer',
		// bcrypt Hash von 'demo123'
		passwordHash: '$2a$10$uQFgKLRgDQGgYFk.LtOcgeVX9vZtUDZvMjVpQXdwXv1zgTzV6OEu.',
		createdAt: new Date().toISOString(),
		role: 'user'
	},
	{
		id: '2',
		email: 'admin@example.com',
		name: 'Admin Nutzer',
		// bcrypt Hash von 'admin123'
		passwordHash: '$2a$10$L1aTVb6z6XO3dqb49HUK9OYAxZQXwb6.YvaD12Nl6QwpjNtkpqleG',
		createdAt: new Date().toISOString(),
		role: 'admin'
	}
];

// Aktive Sessions für Entwicklung
const ACTIVE_SESSIONS = new Map();

// Benutzer authentifizieren
export async function authenticateUser(userEmail, userPassword) {
	// Benutzer finden
	const user = DEV_USERS.find((u) => u.email === userEmail);
	if (!user) return null;

	// Passwort mit bcrypt vergleichen
	const passwordMatches = await bcrypt.compare(userPassword, user.passwordHash);
	if (!passwordMatches) return null;
	// Sicherheitskritische Informationen nicht zurückgeben
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role || 'user'
	};
}

// Neuen Benutzer registrieren
export async function registerUser({ name, email, password }) {
	// Prüfen, ob E-Mail bereits existiert
	if (DEV_USERS.some((u) => u.email === email)) {
		return { success: false, message: 'Diese E-Mail-Adresse wird bereits verwendet' };
	}

	// Passwort hashen
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);
	// Neuen Benutzer erstellen
	const newUser = {
		id: randomUUID(),
		name,
		email,
		passwordHash,
		createdAt: new Date().toISOString(),
		role: 'user' // Standardrolle für neue Benutzer
	};

	// Benutzer zur "Datenbank" hinzufügen
	DEV_USERS.push(newUser);

	// Session-ID generieren
	const sessionId = randomUUID();

	// JWT erstellen
	const jwt = await createJWT(newUser.id);

	// Session speichern
	ACTIVE_SESSIONS.set(sessionId, {
		userId: newUser.id,
		jwt,
		createdAt: new Date().toISOString()
	});

	// Rückgabe ohne sicherheitskritische Informationen
	return {
		success: true,
		user: {
			id: newUser.id,
			name: newUser.name,
			email: newUser.email
		},
		sessionId
	};
}

// JWT Token erstellen
export async function createJWT(userId, expiresIn = '7d') {
	const jwt = await new jose.SignJWT({ sub: userId })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(expiresIn)
		.sign(JWT_SECRET);

	return jwt;
}

// JWT Token validieren
export async function verifyJWT(token) {
	try {
		const { payload } = await jose.jwtVerify(token, JWT_SECRET);
		return { valid: true, userId: payload.sub };
	} catch (error) {
		console.error('JWT validation error:', error);
		return { valid: false, error: error.message };
	}
}

// Session validieren und Benutzer abrufen
export async function getUserFromSession(sessionId) {
	const session = ACTIVE_SESSIONS.get(sessionId);
	if (!session) return null;

	try {
		// JWT validieren
		const { valid, userId } = await verifyJWT(session.jwt);
		if (!valid) return null;

		// Benutzer finden
		const user = DEV_USERS.find((u) => u.id === userId);
		if (!user) return null;

		// Benutzer ohne sicherheitskritische Informationen zurückgeben
		return {
			id: user.id,
			name: user.name,
			email: user.email
		};
	} catch (error) {
		console.error('Session validation error:', error);
		return null;
	}
}

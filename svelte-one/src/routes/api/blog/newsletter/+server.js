// filepath: src/routes/api/blog/newsletter/+server.js
import { json } from '@sveltejs/kit';

// Mock storage for newsletter subscribers
let subscribers = [];

export async function POST({ request }) {
	try {
		const { email, name } = await request.json();

		if (!email) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		// Check if email already exists
		if (subscribers.some((sub) => sub.email === email)) {
			return json({
				message: 'Diese E-Mail-Adresse ist bereits für den Newsletter angemeldet.'
			});
		}

		// Add to subscribers
		subscribers.push({
			email,
			name: name || '',
			timestamp: new Date().toISOString()
		});

		// In a real application, you would:
		// 1. Validate the email
		// 2. Store in a database
		// 3. Send a confirmation email
		// 4. Potentially integrate with a newsletter service like Mailchimp

		return json({
			success: true,
			message: 'Vielen Dank für deine Anmeldung! Wir haben dir eine Bestätigungsmail geschickt.'
		});
	} catch (error) {
		console.error('Error subscribing to newsletter:', error);
		return json({ error: 'Failed to subscribe to newsletter' }, { status: 500 });
	}
}

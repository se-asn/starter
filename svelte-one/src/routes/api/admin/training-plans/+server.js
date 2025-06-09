// Admin API endpoint to get all training plans
import { json } from '@sveltejs/kit';
import { checkRateLimit, getSecurityHeaders } from '$lib/server/security';

// In einer echten Anwendung würden diese Daten aus einer Datenbank kommen
// Dies ist die vereinfachte Liste aller verfügbaren Trainingspläne
const availableTrainingPlans = [
	{
		id: 'b5k',
		title: 'Vom Sofa zur 5K-Ziellinie',
		distance: '5K',
		level: 'Anfänger',
		duration: '8 Wochen',
		description:
			'Der perfekte Einstieg für Laufneulinge – unser Konzept baut deine Ausdauer behutsam auf.',
		thumbnailUrl: '/images/5km-anfaenger-laufen-einstieg.webp',
		price: '29.99'
	},
	{
		id: 'b10k',
		title: 'Systematisch zur 10K-Distanz',
		distance: '10K',
		level: 'Anfänger',
		duration: '10 Wochen',
		description:
			'Verdopple deine Ausdauer mit unserem Trainingsaufbau – die perfekte Balance aus Tempo und Erholung.',
		thumbnailUrl: '/images/laufplaner_pro.webp',
		price: '34.99'
	},
	{
		id: 'bhm',
		title: 'Dein erster Halbmarathon',
		distance: 'Halbmarathon',
		level: 'Anfänger',
		duration: '12 Wochen',
		description:
			'Mit Struktur zur 21K-Distanz – so wirst du Schritt für Schritt zum Halbmarathon-Finisher.',
		thumbnailUrl: '/images/laufplaner_pro.webp',
		price: '39.99'
	},
	{
		id: 'bm',
		title: 'Marathon-Finisher-Programm',
		distance: 'Marathon',
		level: 'Anfänger',
		duration: '16 Wochen',
		description:
			'Der Traum vom Marathon wird Realität – mit unserem Plan meisterst du die Königsdistanz mit Freude.',
		thumbnailUrl: '/images/laufplaner_pro.webp',
		price: '49.99'
	},
	{
		id: 'a5k',
		title: 'Deine neue 5K-Bestzeit',
		distance: '5K',
		level: 'Fortgeschritten',
		duration: '8 Wochen',
		description: 'Sprenge deine Tempogrenzen mit unserem Leistungsplan – jede Sekunde zählt.',
		thumbnailUrl: '/images/laufplaner_pro.webp',
		price: '34.99'
	},
	{
		id: 'a10k',
		title: 'Die 10K-Zeitenjagd',
		distance: '10K',
		level: 'Fortgeschritten',
		duration: '10 Wochen',
		description:
			'Optimiere deine Laufeffizienz und knacke deine persönliche 10K-Bestzeit mit unserem Intensivprogramm.',
		thumbnailUrl: '/images/laufplaner_pro.webp',
		price: '39.99'
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
		if (!checkRateLimit(`admin_get_plans_${clientIp}`, 20, 60000)) {
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

		return json(
			{ plans: availableTrainingPlans },
			{
				headers: getSecurityHeaders()
			}
		);
	} catch (error) {
		console.error('Error fetching training plans:', error);
		return json({ error: 'Serverfehler beim Abrufen der Trainingspläne' }, { status: 500 });
	}
}

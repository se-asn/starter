// Notifications for upcoming training sessions
import { sendEmail } from './email.js';

// This would typically be a more complex data store with persistence
let userNotificationSettings = {};

// Set notification preferences for a user
export function setNotificationPreferences(userId, preferences) {
	userNotificationSettings[userId] = {
		...(userNotificationSettings[userId] || {}),
		...preferences
	};
	return userNotificationSettings[userId];
}

// Get notification preferences for a user
export function getNotificationPreferences(userId) {
	return (
		userNotificationSettings[userId] || {
			email: true,
			browser: true,
			daysBefore: 1
		}
	);
}

// Check for upcoming training sessions and send notifications
export async function checkAndSendTrainingNotifications(userTrainingPlans, availablePlans) {
	const today = new Date();
	const notifiedSessions = [];

	for (const userPlan of userTrainingPlans) {
		const userId = userPlan.userId;
		const preferences = getNotificationPreferences(userId);

		if (!preferences.email && !preferences.browser) {
			continue; // User has disabled notifications
		}

		// Find the plan template
		const planTemplate = availablePlans.find((p) => p.id === userPlan.planId);
		if (!planTemplate) continue;

		// Get the current week's sessions
		const currentWeekIndex = userPlan.currentWeek - 1;
		if (currentWeekIndex < 0 || currentWeekIndex >= planTemplate.weeks.length) continue;

		const currentWeek = planTemplate.weeks[currentWeekIndex];

		// Calculate date for each session based on start date
		const startDate = new Date(userPlan.startDate);

		for (let i = 0; i < currentWeek.sessions.length; i++) {
			const session = currentWeek.sessions[i];

			// Skip completed sessions or rest days
			if (session.completed || session.type === 'Ruhetag') continue;

			// Calculate session date based on day of week
			const dayOffset = getDayOffset(session.day);
			const sessionDate = new Date(startDate);
			sessionDate.setDate(sessionDate.getDate() + currentWeekIndex * 7 + dayOffset);

			// Check if session is coming up based on user's preference
			const daysDiff = Math.ceil((sessionDate - today) / (1000 * 60 * 60 * 24));

			if (daysDiff <= preferences.daysBefore && daysDiff >= 0) {
				// This session is coming up within the notification window

				// Send browser notification if enabled
				if (preferences.browser) {
					notifiedSessions.push({
						userId,
						sessionDate,
						session,
						type: 'browser'
					});
				}

				// Send email notification if enabled
				if (preferences.email) {
					try {
						await sendEmail({
							to: userPlan.userEmail || 'user@example.com', // In a real app, we'd have the user's email
							subject: `Bevorstehende Trainingseinheit: ${session.type}`,
							body: `
                                <h2>Erinnerung an deine bevorstehende Trainingseinheit</h2>
                                <p>Hallo ${userPlan.userName || 'Läufer'},</p>
                                <p>Du hast am ${sessionDate.toLocaleDateString('de-DE')} eine Trainingseinheit:</p>
                                <ul>
                                    <li><strong>Typ:</strong> ${session.type}</li>
                                    <li><strong>Beschreibung:</strong> ${session.description}</li>
                                    ${session.duration ? `<li><strong>Dauer:</strong> ${session.duration} Minuten</li>` : ''}
                                    ${session.distance ? `<li><strong>Distanz:</strong> ${session.distance} km</li>` : ''}
                                </ul>
                                <p>Viel Erfolg bei deinem Training!</p>
                            `
						});

						notifiedSessions.push({
							userId,
							sessionDate,
							session,
							type: 'email'
						});
					} catch (error) {
						console.error(`Failed to send email notification to user ${userId}:`, error);
					}
				}
			}
		}
	}

	return notifiedSessions;
}

// Helper function to get day offset from day name
function getDayOffset(dayName) {
	const days = {
		Montag: 0,
		Dienstag: 1,
		Mittwoch: 2,
		Donnerstag: 3,
		Freitag: 4,
		Samstag: 5,
		Sonntag: 6
	};

	return days[dayName] || 0;
}

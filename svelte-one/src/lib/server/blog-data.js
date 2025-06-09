// filepath: src/lib/server/blog-data.js
// Zentraler Store für Blog-Daten (In Produktion durch echte Datenbank ersetzen)

// In-Memory Storage für Kommentare
export const commentsData = {};

// In-Memory Storage für Newsletter-Abonnenten
export const newsletterSubscribers = [];

// Hilfsfunktionen für Kommentare
export function getComments(slug) {
	return commentsData[slug] || [];
}

export function addComment(slug, comment) {
	if (!commentsData[slug]) {
		commentsData[slug] = [];
	}
	commentsData[slug].push(comment);
	return comment;
}

export function deleteComment(slug, commentId) {
	if (!commentsData[slug]) return false;
	
	const index = commentsData[slug].findIndex(comment => comment.id === commentId);
	if (index === -1) return false;
	
	commentsData[slug].splice(index, 1);
	return true;
}

export function updateComment(slug, commentId, updates) {
	if (!commentsData[slug]) return null;
	
	const index = commentsData[slug].findIndex(comment => comment.id === commentId);
	if (index === -1) return null;
	
	commentsData[slug][index] = { ...commentsData[slug][index], ...updates };
	return commentsData[slug][index];
}

export function likeComment(slug, commentId) {
	if (!commentsData[slug]) return null;
	
	const index = commentsData[slug].findIndex(comment => comment.id === commentId);
	if (index === -1) return null;
	
	commentsData[slug][index].likes = (commentsData[slug][index].likes || 0) + 1;
	return commentsData[slug][index];
}

// Hilfsfunktionen für Newsletter
export function addNewsletterSubscriber(email) {
	if (!newsletterSubscribers.includes(email)) {
		newsletterSubscribers.push(email);
		return true;
	}
	return false;
}

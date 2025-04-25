/**
 * Blog-Hilfsfunktionen für LaufPlaner Pro
 */

/**
 * Schätzt die Lesezeit eines Textes
 * @param {string} content - Der Text/HTML-Inhalt
 * @param {number} wordsPerMinute - Lesegeschwindigkeit (Standardwert: 200 WPM)
 * @returns {string} - Formatierte Lesezeit
 */
export function estimateReadingTime(content, wordsPerMinute = 200) {
	if (!content) return '1 min Lesezeit';

	// HTML-Tags entfernen, wenn content HTML ist
	const plainText = content.replace(/<[^>]*>/g, '');

	// Wörter zählen
	const words = plainText.split(/\s+/).filter((word) => word.length > 0).length;
	const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

	return `${minutes} min Lesezeit`;
}

/**
 * Generiert ein Inhaltsverzeichnis aus HTML
 * @param {string} html - Der HTML-Inhalt
 * @returns {Array} - Array mit Überschriften und IDs
 */
export function generateTableOfContents(html) {
	if (!html) return [];

	// Da wir im serverseitigen Kontext sind, müssen wir das DOM anders parsen
	const headingRegex = /<h([2|3])\s+id=['"](.*?)['"][^>]*>(.*?)<\/h\1>/g;
	const toc = [];
	let match;

	while ((match = headingRegex.exec(html)) !== null) {
		const level = parseInt(match[1]);
		const id = match[2];

		// HTML-Tags aus dem Überschriftentext entfernen
		const textWithTags = match[3];
		const text = textWithTags.replace(/<[^>]*>/g, '');

		toc.push({ level, id, text });
	}

	// Fallback: Wenn keine IDs in den Überschriften sind, erstelle sie selbst
	if (toc.length === 0) {
		const simpleHeadingRegex = /<h([2|3])[^>]*>(.*?)<\/h\1>/g;

		while ((match = simpleHeadingRegex.exec(html)) !== null) {
			const level = parseInt(match[1]);
			const textWithTags = match[2];
			const text = textWithTags.replace(/<[^>]*>/g, '');

			// ID aus dem Text generieren (slug-ähnlich)
			const id = text
				.toLowerCase()
				.replace(/[^\w\s-]/g, '') // Nicht-alphanumerische Zeichen entfernen
				.replace(/[\s_-]+/g, '-') // Leerzeichen durch Bindestriche ersetzen
				.replace(/^-+|-+$/g, ''); // Überschüssige Bindestriche entfernen

			toc.push({ level, id, text });
		}
	}

	return toc;
}

/**
 * Formatiert das Datum für die Anzeige
 * @param {string} dateString - ISO-Datumsformat
 * @param {string} locale - Locale für die Formatierung (Standard: de-DE)
 * @returns {string} - Formatiertes Datum
 */
export function formatDate(dateString, locale = 'de-DE') {
	if (!dateString) return '';

	const date = new Date(dateString);
	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Extrahiert eine kurze Zusammenfassung aus HTML-Inhalt
 * @param {string} html - Der HTML-Inhalt
 * @param {number} maxLength - Maximale Länge (Standard: 160 Zeichen)
 * @returns {string} - Extrahierte Zusammenfassung
 */
export function extractExcerpt(html, maxLength = 160) {
	if (!html) return '';

	// HTML-Tags entfernen
	const plainText = html.replace(/<[^>]*>/g, '');

	// Text kürzen und mit Ellipsis beenden
	if (plainText.length <= maxLength) {
		return plainText;
	}

	return plainText.substring(0, maxLength).trim() + '...';
}

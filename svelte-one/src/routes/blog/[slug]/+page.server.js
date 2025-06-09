// src/routes/blog/[slug]/+page.server.js
import { getPostBySlug, getRelatedPosts } from '$lib/blog/utils';
import { error } from '@sveltejs/kit';
import { estimateReadingTime, generateTableOfContents } from '$lib/blog/helpers';
import { dev } from '$app/environment';
import { getSecurityHeaders } from '$lib/server/security';

// Cache für Posts, um wiederholte Festplatten-I/O zu vermeiden
const postCache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 Stunde

export async function load({ params, setHeaders }) {
	try {
		const slug = params.slug;
		const cacheKey = `post_${slug}`;

		// Cache-Check: Verwende gecachte Daten, wenn verfügbar und nicht im Dev-Modus
		if (!dev && postCache.has(cacheKey)) {
			const cached = postCache.get(cacheKey);
			if (Date.now() - cached.timestamp < CACHE_DURATION) {
				return cached.data;
			}
		}

		// Post abrufen
		const post = await getPostBySlug(params.slug);

		if (!post) {
			throw error(404, {
				message: 'Dieser Beitrag wurde nicht gefunden.',
				code: 'POST_NOT_FOUND'
			});
		}

		// Performance & SEO Optimierungen
		// 1. Lesezeit berechnen
		if (!post.readingTime) {
			post.readingTime = estimateReadingTime(post.content || post.htmlContent);
		}

		// 2. Inhaltsverzeichnis dynamisch erstellen aus H2/H3 Überschriften
		post.tableOfContents = generateTableOfContents(post.htmlContent);

		// 3. Verwandte Posts finden (basierend auf Kategorie/Tags)
		const relatedPosts = await getRelatedPosts(post, 3);

		// 4. Kanonische URL für SEO
		post.canonicalUrl = `https://laufplanerpro.de/blog/${slug}`;

		// 5. Social Media Preview Daten vorbereiten
		post.socialPreview = {
			title: post.title,
			description: post.excerpt || `Lese mehr über ${post.title}`,
			image: post.featuredImage || 'https://laufplanerpro.de/images/default-social.jpg',
			url: post.canonicalUrl
		};

		// 6. Metadaten für strukturierte Daten (Schema.org) aufbereiten
		const schemaData = {
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: post.title,
			description: post.excerpt,
			image: post.featuredImage,
			datePublished: post.date,
			dateModified: post.lastUpdated || post.date,
			publisher: {
				'@type': 'Organization',
				name: 'LaufPlaner Pro',
				logo: {
					'@type': 'ImageObject',
					url: 'https://laufplanerpro.de/images/logo.png'
				}
			},
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': post.canonicalUrl
			}
		};

		// Daten zum Rückgabeobjekt hinzufügen
		const responseData = {
			post,
			relatedPosts,
			schemaData
		};
		// Für Produktion: Caching-Header setzen
		if (!dev) {
			const securityHeaders = getSecurityHeaders();

			setHeaders({
				'Cache-Control': 'max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
				...securityHeaders
			});

			// In Cache speichern
			postCache.set(cacheKey, {
				data: responseData,
				timestamp: Date.now()
			});
		}

		// Falls eine Bild-Optimierung verwendet wird, Bilder als Assets preloaden
		if (post.featuredImage) {
			// Hier könntest du mit fetch preloaden, aber SvelteKit übernimmt dies oft automatisch
		}

		return responseData;
	} catch (err) {
		console.error('Fehler beim Laden des Blog-Posts:', err);
		throw error(err.status || 500, err.message || 'Interner Serverfehler');
	}
}

// Optional: Prerendering für bessere SEO und Performance
export const prerender = true;

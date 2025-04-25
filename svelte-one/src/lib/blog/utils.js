// src/lib/blog/utils.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'src/lib/blog/posts');

export function getAllPosts() {
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData = fileNames
		.filter((fileName) => fileName.endsWith('.md'))
		.map((fileName) => {
			// Entferne ".md" vom Dateinamen, um die ID zu erhalten
			const slug = fileName.replace(/\.md$/, '');

			// Lese Markdown-Datei als String
			const fullPath = path.join(postsDirectory, fileName);
			const fileContents = fs.readFileSync(fullPath, 'utf8');

			// Parse Frontmatter mit gray-matter
			const { data, content } = matter(fileContents);

			// Berechne Lesezeit
			const stats = readingTime(content);

			// Kombiniere die Daten
			return {
				slug,
				...data,
				readingTime: stats.text,
				excerpt: data.excerpt || content.substring(0, 150) + '...'
			};
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1)); // Sortiere nach Datum

	return allPostsData;
}

export function getPostBySlug(slug) {
	const fullPath = path.join(postsDirectory, `${slug}.md`);
	if (!fs.existsSync(fullPath)) {
		return null;
	}

	const fileContents = fs.readFileSync(fullPath, 'utf8');
	const { data, content } = matter(fileContents);
	const stats = readingTime(content);

	return {
		slug,
		content,
		...data,
		readingTime: stats.text
	};
}

/**
 * Verwandte Posts basierend auf Kategorien und Tags finden
 * @param {Object} post - Der aktuelle Post
 * @param {number} limit - Anzahl der verwandten Posts (Standard: 3)
 * @returns {Array} - Array mit verwandten Posts
 */
export async function getRelatedPosts(post, limit = 3) {
	if (!post) return [];

	// Alle Posts holen (wiederverwendbare Funktion)
	const allPosts = await getAllPosts();

	// Aktuelle Post ausfiltern
	const otherPosts = allPosts.filter((p) => p.slug !== post.slug);

	// Relevanz-Score für jeden Post berechnen
	const scoredPosts = otherPosts.map((otherPost) => {
		let score = 0;

		// Gleiche Kategorie ist sehr relevant
		if (post.category && otherPost.category && post.category === otherPost.category) {
			score += 5;
		}

		// Übereinstimmende Tags erhöhen die Relevanz
		if (post.tags && otherPost.tags) {
			const commonTags = post.tags.filter((tag) => otherPost.tags.includes(tag));
			score += commonTags.length * 2;
		}

		return { ...otherPost, relevanceScore: score };
	});

	// Nach Relevanz sortieren und limitieren
	const relatedPosts = scoredPosts
		.filter((p) => p.relevanceScore > 0) // Nur relevante Posts
		.sort((a, b) => b.relevanceScore - a.relevanceScore)
		.slice(0, limit);

	// Wenn nicht genug relevante Posts, fülle mit neuesten Posts auf
	if (relatedPosts.length < limit) {
		const newestPosts = scoredPosts
			.filter((p) => !relatedPosts.includes(p))
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.slice(0, limit - relatedPosts.length);

		relatedPosts.push(...newestPosts);
	}

	return relatedPosts;
}

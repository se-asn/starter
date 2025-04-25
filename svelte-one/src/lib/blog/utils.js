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

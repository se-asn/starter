// src/routes/blog/[slug]/+page.server.js
import { getAllPosts, getPostBySlug } from '$lib/blog/utils';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const post = getPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Post nicht gefunden');
	}

	const htmlContent = marked(post.content || '');

	// Hole verwandte Posts basierend auf Tags oder Kategorie
	const allPosts = getAllPosts();
	const relatedPosts = allPosts
		.filter(
			(p) =>
				p.slug !== post.slug &&
				((post.tags && p.tags && p.tags.some((tag) => post.tags.includes(tag))) ||
					p.category === post.category)
		)
		.slice(0, 3); // Zeige maximal 3 verwandte Posts

	return {
		post: {
			...post,
			htmlContent
		},
		relatedPosts
	};
}

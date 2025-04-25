// src/routes/blog/[slug]/+page.server.js
import { getPostBySlug } from '$lib/blog/utils';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const post = getPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Post nicht gefunden');
	}

	// Mit mdsvex wird die Markdown-Konvertierung bereits beim Import erledigt
	return {
		post
	};
}

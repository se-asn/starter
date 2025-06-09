// filepath: src/routes/api/blog/comments/[commentId]/like/+server.js
import { json } from '@sveltejs/kit';
import { likeComment } from '$lib/server/blog-data.js';

// POST: Like a comment
export async function POST({ params, request }) {
	try {
		const { commentId } = params;
		const { postSlug } = await request.json();

		if (!postSlug) {
			return json({ error: 'Post slug is required' }, { status: 400 });
		}

		const updatedComment = likeComment(postSlug, commentId);

		if (!updatedComment) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		return json({
			message: 'Comment liked successfully',
			likes: updatedComment.likes
		});
	} catch (error) {
		console.error('Error liking comment:', error);
		return json({ error: 'Failed to like comment' }, { status: 500 });
	}
}

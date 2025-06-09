// filepath: src/routes/api/blog/comments/[commentId]/+server.js
import { json } from '@sveltejs/kit';
import { deleteComment } from '$lib/server/blog-data.js';

// DELETE: Delete a comment (would typically require admin permissions)
export async function DELETE({ params, request }) {
	try {
		const { commentId } = params;
		const { postSlug } = await request.json();
		if (!postSlug) {
			return json({ error: 'Post slug is required' }, { status: 400 });
		}

		const success = deleteComment(postSlug, commentId);

		if (!success) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		return json({ message: 'Comment deleted successfully' });
	} catch (error) {
		console.error('Error deleting comment:', error);
		return json({ error: 'Failed to delete comment' }, { status: 500 });
	}
}

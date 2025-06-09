// filepath: src/routes/api/blog/comments/[commentId]/+server.js
import { json } from '@sveltejs/kit';

// In production, this would use a database
// For now, we're reusing the same in-memory storage from the main comments API
import { commentsData } from '../+server.js';

// DELETE: Delete a comment (would typically require admin permissions)
export async function DELETE({ params, request }) {
	try {
		const { commentId } = params;
		const { postSlug } = await request.json();

		if (!postSlug) {
			return json({ error: 'Post slug is required' }, { status: 400 });
		}

		const postComments = commentsData[postSlug] || [];
		const commentIndex = postComments.findIndex((comment) => comment.id === commentId);

		if (commentIndex === -1) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		// Remove the comment from the array
		postComments.splice(commentIndex, 1);

		return json({ message: 'Comment deleted successfully' });
	} catch (error) {
		console.error('Error deleting comment:', error);
		return json({ error: 'Failed to delete comment' }, { status: 500 });
	}
}

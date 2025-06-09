// filepath: src/routes/api/blog/comments/[commentId]/like/+server.js
import { json } from '@sveltejs/kit';

// In production, this would use a database
// For now, we're reusing the same in-memory storage from the main comments API
import { commentsData } from '../../+server.js';

// POST: Like a comment
export async function POST({ params, request }) {
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

		// Increment the likes count
		postComments[commentIndex].likes += 1;

		return json({
			message: 'Comment liked successfully',
			likes: postComments[commentIndex].likes
		});
	} catch (error) {
		console.error('Error liking comment:', error);
		return json({ error: 'Failed to like comment' }, { status: 500 });
	}
}

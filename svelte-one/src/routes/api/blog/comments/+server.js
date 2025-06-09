// filepath: src/routes/api/blog/comments/+server.js
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { checkRateLimit, getSecurityHeaders } from '$lib/server/security';
import { getComments, addComment } from '$lib/server/blog-data.js';

// GET: Fetch comments for a specific blog post
export async function GET({ url }) {
	try {
		const slug = url.searchParams.get('slug');

		if (!slug) {
			return json({ error: 'Blog post slug is required' }, { status: 400 });
		}

		// Apply security headers
		const headers = getSecurityHeaders();
		// Return comments for the specified blog post
		const comments = getComments(slug);

		return json({ comments }, { headers });
	} catch (error) {
		console.error('Error fetching comments:', error);
		return json({ error: 'Failed to fetch comments' }, { status: 500 });
	}
}

// POST: Add a new comment to a blog post
export async function POST({ request, getClientAddress }) {
	try {
		// Get client IP address for rate limiting
		const clientIp = getClientAddress();

		// Apply rate limiting (5 comments per minute)
		if (!checkRateLimit(`comment_${clientIp}`, 5, 60000)) {
			return json(
				{
					error: 'Rate limit exceeded. Please try again later.'
				},
				{
					status: 429,
					headers: {
						'Retry-After': '60'
					}
				}
			);
		}
		const { postSlug, comment } = await request.json();

		if (!postSlug || !comment) {
			return json({ error: 'Post slug and comment are required' }, { status: 400 });
		}

		if (!comment.content || !comment.author) {
			return json({ error: 'Comment content and author are required' }, { status: 400 });
		}

		// Create a new comment object
		const newComment = {
			id: uuidv4(),			content: comment.content,
			author: comment.author,
			email: comment.email || '',
			avatar: comment.avatar || null,
			date: new Date().toISOString(),
			likes: 0,
			isApproved: true // In production, you might want to moderate comments
		};

		// Add the comment to the post using the helper function
		const savedComment = addComment(postSlug, newComment);

		return json(
			{
				message: 'Comment added successfully',
				comment: savedComment
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error adding comment:', error);
		return json({ error: 'Failed to add comment' }, { status: 500 });
	}
}

// filepath: src/lib/stores/commentStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initial state with empty comments and loading state
const initialState = {
	comments: {},
	isLoading: false,
	error: null
};

// Helper function to load comments from localStorage during development
function getStoredComments() {
	if (browser) {
		const storedComments = localStorage.getItem('blogComments');
		if (storedComments) {
			try {
				return JSON.parse(storedComments);
			} catch (e) {
				console.error('Failed to parse stored comments:', e);
			}
		}
	}
	return initialState;
}

// Create and export the store
function createCommentStore() {
	// Create store with initial state
	const stored = getStoredComments();
	const { subscribe, set, update } = writable(stored);

	// Store comments in localStorage after each change (for development)
	if (browser) {
		subscribe((state) => {
			localStorage.setItem('blogComments', JSON.stringify(state));
		});
	}

	return {
		subscribe,

		// Fetch comments for a specific post
		fetchComments: async (postSlug) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await fetch(`/api/blog/comments?slug=${postSlug}`);

				if (!response.ok) {
					throw new Error('Failed to fetch comments');
				}

				const data = await response.json();

				update((state) => ({
					...state,
					comments: {
						...state.comments,
						[postSlug]: data.comments
					},
					isLoading: false
				}));
			} catch (error) {
				console.error('Error fetching comments:', error);
				update((state) => ({
					...state,
					error: error.message,
					isLoading: false
				}));
			}
		},

		// Add a new comment
		addComment: async (postSlug, comment) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await fetch('/api/blog/comments', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						postSlug,
						comment
					})
				});

				if (!response.ok) {
					throw new Error('Failed to add comment');
				}

				const data = await response.json();

				update((state) => {
					const postComments = state.comments[postSlug] || [];

					return {
						...state,
						comments: {
							...state.comments,
							[postSlug]: [...postComments, data.comment]
						},
						isLoading: false
					};
				});

				return data.comment;
			} catch (error) {
				console.error('Error adding comment:', error);
				update((state) => ({
					...state,
					error: error.message,
					isLoading: false
				}));
				throw error;
			}
		},

		// Like a comment
		likeComment: async (postSlug, commentId) => {
			try {
				const response = await fetch(`/api/blog/comments/${commentId}/like`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ postSlug })
				});

				if (!response.ok) {
					throw new Error('Failed to like comment');
				}

				const data = await response.json();

				update((state) => {
					const postComments = state.comments[postSlug] || [];
					const updatedComments = postComments.map((comment) =>
						comment.id === commentId ? { ...comment, likes: data.likes } : comment
					);

					return {
						...state,
						comments: {
							...state.comments,
							[postSlug]: updatedComments
						}
					};
				});
			} catch (error) {
				console.error('Error liking comment:', error);
			}
		},

		// Delete a comment (admin or author only)
		deleteComment: async (postSlug, commentId) => {
			try {
				const response = await fetch(`/api/blog/comments/${commentId}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ postSlug })
				});

				if (!response.ok) {
					throw new Error('Failed to delete comment');
				}

				update((state) => {
					const postComments = state.comments[postSlug] || [];
					const filteredComments = postComments.filter((comment) => comment.id !== commentId);

					return {
						...state,
						comments: {
							...state.comments,
							[postSlug]: filteredComments
						}
					};
				});
			} catch (error) {
				console.error('Error deleting comment:', error);
			}
		},

		// Reset error state
		resetError: () => {
			update((state) => ({ ...state, error: null }));
		}
	};
}

export const commentStore = createCommentStore();

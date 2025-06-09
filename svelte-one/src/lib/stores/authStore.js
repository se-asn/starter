import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
	const { subscribe, set, update } = writable({
		user: null,
		isAuthenticated: false,
		isLoading: true
	});

	return {
		subscribe,

		initialize: async () => {
			if (!browser) return;

			try {
				const res = await fetch('/api/auth/me');
				const data = await res.json();

				if (data.success) {
					update((state) => ({
						...state,
						user: data.user,
						isAuthenticated: true,
						isLoading: false
					}));
				} else {
					update((state) => ({ ...state, isLoading: false }));
				}
			} catch (err) {
				console.error('Auth error:', err);
				update((state) => ({ ...state, isLoading: false }));
			}
		},

		login: (user) => {
			update((state) => ({
				...state,
				user,
				isAuthenticated: true,
				isLoading: false
			}));
		},
		logout: () => {
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false
			});
		},

		updateUser: (user) => {
			update((state) => ({
				...state,
				user
			}));
		}
	};
}

export const authStore = createAuthStore();

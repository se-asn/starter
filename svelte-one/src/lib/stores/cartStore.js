import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialer Zustand
const initialState = {
	items: [],
	total: 0
};

// Hilfsfunktion, um den Warenkorb aus dem LocalStorage zu laden
function getStoredCart() {
	if (browser) {
		const storedCart = localStorage.getItem('shoppingCart');
		if (storedCart) {
			try {
				return JSON.parse(storedCart);
			} catch (e) {
				console.error('Failed to parse stored cart:', e);
			}
		}
	}
	return initialState;
}

// Hilfsfunktion für die Gesamtsumme
function calculateTotal(items) {
	return items.reduce((sum, item) => sum + (parseFloat(item.price.replace('€', '')) || 0), 0);
}

// Erstellen und exportieren des Stores
function createCartStore() {
	// Store mit initial state erstellen
	const stored = getStoredCart();
	const { subscribe, set, update } = writable(stored);

	// Store nach jeder Änderung speichern
	if (browser) {
		subscribe((state) => {
			localStorage.setItem('shoppingCart', JSON.stringify(state));
		});
	}

	return {
		subscribe,

		// Artikel zum Warenkorb hinzufügen
		addItem: (item) => {
			update((state) => {
				// Prüfen, ob der Artikel bereits im Warenkorb ist
				const existingItemIndex = state.items.findIndex((i) => i.id === item.id);

				if (existingItemIndex >= 0) {
					// Wenn der Artikel bereits im Warenkorb ist, nichts tun
					return state;
				} else {
					// Artikel hinzufügen
					const newItems = [...state.items, item];

					return {
						items: newItems,
						total: calculateTotal(newItems)
					};
				}
			});
		},

		// Artikel aus dem Warenkorb entfernen
		removeItem: (itemId) => {
			update((state) => {
				const newItems = state.items.filter((item) => item.id !== itemId);

				return {
					items: newItems,
					total: calculateTotal(newItems)
				};
			});
		},

		// Warenkorb leeren
		clearCart: () => {
			set(initialState);
		}
	};
}

export const cartStore = createCartStore();

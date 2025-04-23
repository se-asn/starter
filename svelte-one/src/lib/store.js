import { writable } from 'svelte/store';

// Store für den aktiven Plan-Tab (Anfänger oder Fortgeschrittene)
export const activePlanTab = writable('beginner');

// Store für das mobile Menü (offen/geschlossen)
export const mobileMenuOpen = writable(false);

// Hilfsfunktionen zum Ändern der Store-Werte
export function toggleMobileMenu() {
	mobileMenuOpen.update((value) => !value);
}

export function setActivePlanTab(tab) {
	activePlanTab.set(tab);
}

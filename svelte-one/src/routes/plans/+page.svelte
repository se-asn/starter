<script>
	import { onMount } from 'svelte';
	import { cartStore } from '$lib/stores/cartStore';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';

	let isLoading = true;
	let plans = [];
	let selectedFilter = 'all';
	let searchTerm = '';
	let user;
	let isAddingToCart = false;
	let cartMessage = '';

	// Filter-Optionen
	const filters = [
		{ id: 'all', label: 'Alle Pläne' },
		{ id: '5k', label: '5K' },
		{ id: '10k', label: '10K' },
		{ id: 'half', label: 'Halbmarathon' },
		{ id: 'full', label: 'Marathon' }
	];

	// Abonniere den Auth Store
	const unsubscribe = authStore.subscribe((state) => {
		user = state.user;
	});

	// Beispiel-Trainingspläne
	const dummyPlans = [
		{
			id: 'b5k',
			title: 'Vom Sofa zur 5K-Ziellinie',
			distance: '5K',
			category: '5k',
			level: 'Anfänger',
			duration: '6-8 Wochen',
			description:
				'Der perfekte Einstieg für Laufneulinge – unser Konzept baut deine Ausdauer behutsam auf.',
			features: [
				'Clever konzipierte Geh-Lauf-Intervalle für sanften Aufbau deiner Kondition',
				'3 effektive Trainingseinheiten pro Woche für optimalen Fortschritt',
				'Fokus auf nachhaltige Lauftechnik und Erfolgsroutinen'
			],
			price: '€29.99',
			rating: 4.8,
			reviewCount: 124,
			thumbnailUrl: '/images/5km-anfaenger-laufen-einstieg.webp'
		},
		{
			id: 'b10k',
			title: 'Systematisch zur 10K-Distanz',
			distance: '10K',
			category: '10k',
			level: 'Anfänger',
			duration: '8-10 Wochen',
			description:
				'Verdopple deine Ausdauer mit unserem Trainingsaufbau – die perfekte Balance aus Tempo und Erholung.',
			features: [
				'Aufbauend auf 5K-Fitness mit intelligenter Belastungssteigerung',
				'4 strukturierte Trainingseinheiten pro Woche für kontinuierlichen Fortschritt',
				'Einführung effektiver Tempovariationen für spürbaren Leistungsschub'
			],
			price: '€34.99',
			rating: 4.7,
			reviewCount: 98,
			thumbnailUrl: '/images/laufplaner_pro.webp'
		},
		{
			id: 'b21k',
			title: 'Erster Halbmarathon-Erfolg',
			distance: '21K',
			category: 'half',
			level: 'Anfänger',
			duration: '12 Wochen',
			description:
				'Von Läufern für Läufer entwickelt – unser Plan führt dich zur erfolgreichen Bewältigung deiner ersten 21K.',
			features: [
				'Evidenzbasierter, schonender Aufbau deiner Langstreckenfähigkeit',
				'Motivierende Trainingsstruktur für nachhaltiges Durchhaltevermögen',
				'Umfassende Ernährungs-, Erholungs- und Renntaktik-Tipps aus der Praxis'
			],
			price: '€39.99',
			rating: 4.9,
			reviewCount: 145,
			thumbnailUrl: '/images/laufplaner_pro.webp'
		},
		{
			id: 'b42k',
			title: 'Marathon für Einsteiger',
			distance: '42K',
			category: 'full',
			level: 'Anfänger',
			duration: '16 Wochen',
			description:
				'Schritt für Schritt zum Marathonfinish – ein sanfter und sicherer Aufbau für deine erste Marathondistanz.',
			features: [
				'Progressiver Trainingsaufbau mit langsamem Distanzaufbau',
				'4-5 Trainingseinheiten pro Woche mit ausgewogener Belastungssteuerung',
				'Ausführliche Tipps für Langstreckenernährung und Marathonvorbereitung'
			],
			price: '€49.99',
			rating: 4.8,
			reviewCount: 87,
			thumbnailUrl: '/images/laufplaner_pro.webp'
		},
		{
			id: 'a5k',
			title: '5K Bestzeit-Knacker',
			distance: '5K',
			category: '5k',
			level: 'Fortgeschritten',
			duration: '8 Wochen',
			description:
				'Gezielte Tempoarbeit und strukturiertes Training für deine persönliche 5K-Bestzeit.',
			features: [
				'Wissenschaftlich fundierte Temposteigerungen für maximale Leistung',
				'5 effektive Trainingseinheiten pro Woche inklusive Krafttraining',
				'Integration spezieller Tempointervalle zur VO2max-Optimierung'
			],
			price: '€34.99',
			rating: 4.6,
			reviewCount: 76,
			thumbnailUrl: '/images/laufplaner_pro.webp'
		},
		{
			id: 'a10k',
			title: '10K Leistungsoptimierung',
			distance: '10K',
			category: '10k',
			level: 'Fortgeschritten',
			duration: '10 Wochen',
			description:
				'Spezifisches Tempohärtetraining für ambitionierte Läufer, die ihre 10K-Zeit verbessern wollen.',
			features: [
				'Periodisiertes Trainingskonzept mit Fokus auf Schwellentraining',
				'5-6 systematische Trainingseinheiten pro Woche',
				'Gezielte Technikübungen und Krafteinheiten für effizienteres Laufen'
			],
			price: '€39.99',
			rating: 4.7,
			reviewCount: 92,
			thumbnailUrl: '/images/laufplaner_pro.webp'
		}
	];

	onMount(() => {
		// In einer echten App würde hier eine API-Abfrage erfolgen
		// Simulation einer API-Anfrage
		setTimeout(() => {
			plans = dummyPlans;
			isLoading = false;
		}, 800);

		return unsubscribe;
	});

	// Funktion zum Filtern der Pläne
	$: filteredPlans = plans.filter((plan) => {
		// Wenn "alle" ausgewählt ist oder die Kategorie übereinstimmt
		const matchesFilter = selectedFilter === 'all' || plan.category === selectedFilter;
		
		// Filterung nach Suchbegriff
		const matchesSearch = 
			plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			plan.level.toLowerCase().includes(searchTerm.toLowerCase());
		
		return matchesFilter && matchesSearch;
	});

	// Funktion zum Hinzufügen zum Warenkorb
	function addToCart(plan) {
		isAddingToCart = true;
		cartMessage = '';
		
		// Simuliere einen API-Aufruf
		setTimeout(() => {
			// Füge den Plan zum Warenkorb hinzu
			cartStore.addItem({
				id: plan.id,
				title: plan.title,
				price: plan.price,
				type: 'training_plan',
				thumbnail: plan.thumbnailUrl || '/images/laufplaner_pro.webp'
			});
			
			isAddingToCart = false;
			cartMessage = `"${plan.title}" wurde zum Warenkorb hinzugefügt!`;
			
			// Nachricht nach einigen Sekunden wieder ausblenden
			setTimeout(() => {
				cartMessage = '';
			}, 3000);
		}, 500);
	}

	// Funktion zum Kaufen eines Plans
	function buyNow(plan) {
		// Füge den Plan zum Warenkorb hinzu
		cartStore.addItem({
			id: plan.id,
			title: plan.title,
			price: plan.price,
			type: 'training_plan',
			thumbnail: plan.thumbnailUrl || '/images/laufplaner_pro.webp'
		});
		
		// Weiterleitung zum Checkout
		goto('/checkout');
	}
</script>

<div class="store-page">
	<div class="page-header">
		<h1>Trainingspläne</h1>
		<p class="subtitle">Finde den perfekten Plan für dein Laufziel</p>
	</div>
	
	<div class="filters-container">
		<div class="search-bar">
			<input 
				type="text" 
				placeholder="Nach Trainingsplänen suchen..." 
				bind:value={searchTerm}
			/>
			<i class="material-icons">search</i>
		</div>
		
		<div class="category-filters">
			{#each filters as filter}
				<button 
					class="filter-button {selectedFilter === filter.id ? 'active' : ''}"
					on:click={() => selectedFilter = filter.id}
				>
					{filter.label}
				</button>
			{/each}
		</div>
	</div>
	
	{#if cartMessage}
		<div class="cart-message success">
			<i class="material-icons">check_circle</i>
			<span>{cartMessage}</span>
		</div>
	{/if}
	
	{#if isLoading}
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p>Trainingspläne werden geladen...</p>
		</div>
	{:else if filteredPlans.length === 0}
		<div class="no-results">
			<p>Keine Trainingspläne gefunden, die deinen Filterkriterien entsprechen.</p>
			<button class="btn btn-outline" on:click={() => { selectedFilter = 'all'; searchTerm = ''; }}>
				Filter zurücksetzen
			</button>
		</div>
	{:else}
		<div class="plans-grid">
			{#each filteredPlans as plan}
				<div class="plan-card">
					<div class="plan-image">
						<img src={plan.thumbnailUrl || '/images/laufplaner_pro.webp'} alt={plan.title} />
						<div class="plan-level">{plan.level}</div>
					</div>
					
					<div class="plan-content">
						<div class="plan-header">
							<span class="plan-distance">{plan.distance}</span>
							<span class="plan-duration">{plan.duration}</span>
						</div>
						
						<h2 class="plan-title">{plan.title}</h2>
						
						<p class="plan-description">{plan.description}</p>
						
						<div class="plan-features">
							<h3>Enthält:</h3>
							<ul>
								{#each plan.features as feature}
									<li>{feature}</li>
								{/each}
							</ul>
						</div>
						
						<div class="plan-rating">
							<div class="stars">
								{#each Array(5) as _, i}
									<i class="material-icons">
										{i < Math.floor(plan.rating) 
											? 'star' 
											: i < Math.floor(plan.rating) + 0.5 
												? 'star_half' 
												: 'star_border'}
									</i>
								{/each}
							</div>
							<span class="rating-count">{plan.rating} ({plan.reviewCount} Bewertungen)</span>
						</div>
						
						<div class="plan-footer">
							<div class="plan-price">{plan.price}</div>
							
							<div class="plan-actions">
								<button 
									class="btn btn-outline"
									on:click={() => addToCart(plan)}
									disabled={isAddingToCart}
								>
									{#if isAddingToCart}
										<span class="spinner"></span>
									{:else}
										<i class="material-icons">add_shopping_cart</i>
									{/if}
									In den Warenkorb
								</button>
								
								<button 
									class="btn btn-primary"
									on:click={() => buyNow(plan)}
								>
									Jetzt kaufen
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.store-page {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}
	
	.page-header {
		text-align: center;
		margin-bottom: 2rem;
	}
	
	.page-header h1 {
		font-size: 2rem;
		color: var(--primary);
		margin-bottom: 0.5rem;
	}
	
	.subtitle {
		color: var(--text-light);
		font-size: 1.1rem;
	}
	
	.filters-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	
	.search-bar {
		position: relative;
	}
	
	.search-bar input {
		width: 100%;
		padding: 0.75rem 1rem 0.75rem 3rem;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background-color: rgba(0, 0, 0, 0.2);
		color: var(--text);
		font-size: 1rem;
	}
	
	.search-bar i {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-light);
	}
	
	.category-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	
	.filter-button {
		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 50px;
		padding: 0.5rem 1.25rem;
		color: var(--text-light);
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}
	
	.filter-button.active, .filter-button:hover {
		background-color: var(--primary);
		color: var(--dark);
		border-color: var(--primary);
	}
	
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
	}
	
	.loading-spinner {
		width: 2.5rem;
		height: 2.5rem;
		border: 3px solid rgba(0, 242, 254, 0.3);
		border-radius: 50%;
		border-top-color: var(--primary);
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 1rem;
	}
	
	.no-results {
		text-align: center;
		padding: 4rem 2rem;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
	}
	
	.no-results p {
		margin-bottom: 1.5rem;
		color: var(--text-light);
	}
	
	.plans-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 2rem;
	}
	
	.plan-card {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		overflow: hidden;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		display: flex;
		flex-direction: column;
	}
	
	.plan-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}
	
	.plan-image {
		position: relative;
		height: 200px;
		overflow: hidden;
	}
	
	.plan-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease;
	}
	
	.plan-card:hover .plan-image img {
		transform: scale(1.05);
	}
	
	.plan-level {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background-color: rgba(0, 0, 0, 0.7);
		color: var(--primary);
		font-size: 0.8rem;
		padding: 0.35rem 0.75rem;
		border-radius: 50px;
		font-weight: 500;
	}
	
	.plan-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}
	
	.plan-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}
	
	.plan-distance {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--primary);
		background-color: rgba(0, 242, 254, 0.1);
		padding: 0.35rem 0.75rem;
		border-radius: 50px;
	}
	
	.plan-duration {
		font-size: 0.9rem;
		color: var(--text-light);
	}
	
	.plan-title {
		font-size: 1.25rem;
		margin: 0 0 0.75rem 0;
		color: var(--text);
	}
	
	.plan-description {
		color: var(--text-light);
		font-size: 0.95rem;
		margin-bottom: 1.25rem;
	}
	
	.plan-features {
		margin-bottom: 1.25rem;
	}
	
	.plan-features h3 {
		font-size: 0.9rem;
		color: var(--text-light);
		margin-bottom: 0.5rem;
		font-weight: 500;
	}
	
	.plan-features ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}
	
	.plan-features li {
		position: relative;
		padding-left: 1.5rem;
		font-size: 0.9rem;
		color: var(--text);
		margin-bottom: 0.5rem;
	}
	
	.plan-features li:before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--primary);
	}
	
	.plan-rating {
		display: flex;
		align-items: center;
		margin-bottom: 1.25rem;
	}
	
	.stars {
		display: flex;
		margin-right: 0.75rem;
		color: #f1c40f;
	}
	
	.stars i {
		font-size: 1.1rem;
	}
	
	.rating-count {
		font-size: 0.9rem;
		color: var(--text-light);
	}
	
	.plan-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.plan-price {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--primary);
	}
	
	.plan-actions {
		display: flex;
		gap: 0.75rem;
	}
	
	.plan-actions button {
		font-size: 0.9rem;
		padding: 0.5rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.cart-message {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		margin-bottom: 1.5rem;
		border-radius: 8px;
		animation: slideIn 0.3s ease;
	}
	
	.cart-message.success {
		background-color: rgba(39, 174, 96, 0.2);
		border: 1px solid rgba(39, 174, 96, 0.3);
		color: #2ecc71;
	}
	
	.cart-message i {
		font-size: 1.5rem;
	}
	
	.spinner {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: #fff;
		animation: spin 1s ease-in-out infinite;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	@keyframes slideIn {
		from {
			transform: translateY(-20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	
	@media (max-width: 768px) {
		.plans-grid {
			grid-template-columns: 1fr;
		}
		
		.plan-footer {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}
		
		.plan-price {
			text-align: center;
		}
		
		.plan-actions {
			flex-direction: column;
		}
	}
</style>

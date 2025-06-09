<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    let orderData = null;
    let isLoading = true;
    
    onMount(() => {
        // Retrieve the order data from sessionStorage
        try {
            const storedOrderData = sessionStorage.getItem('orderData');
            if (storedOrderData) {
                orderData = JSON.parse(storedOrderData);
            } else {
                // If no order data exists, redirect to home
                setTimeout(() => goto('/'), 2000);
            }
        } catch (e) {
            console.error('Failed to parse order data:', e);
        }
        
        isLoading = false;
        
        // Clear the order data from sessionStorage after retrieving it
        sessionStorage.removeItem('orderData');
    });
    
    // Format price (accepts string or number)
    function formatPrice(price) {
        if (typeof price === 'string' && price.includes('€')) {
            return price;
        }
        return `€${price.toFixed(2)}`;
    }
    
    // Format date to German format
    function formatDate(date) {
        return new Date(date).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Current date for the order date
    const orderDate = new Date();
    
    // Estimated delivery date (7 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
</script>

<svelte:head>
    <title>Bestellbestätigung - RunOne</title>
</svelte:head>

<div class="confirmation-container">
    {#if isLoading}
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Laden...</p>
        </div>
    {:else if !orderData}
        <div class="no-order-data">
            <i class="material-icons">error_outline</i>
            <h2>Keine Bestelldaten gefunden</h2>
            <p>Du wirst zur Startseite weitergeleitet...</p>
        </div>
    {:else}
        <div class="confirmation-header">
            <div class="success-icon">
                <i class="material-icons">check_circle</i>
            </div>
            <h1>Bestellung erfolgreich abgeschlossen!</h1>
            <p>Vielen Dank für deine Bestellung. Wir haben deinen Kauf bestätigt.</p>
        </div>
        
        <div class="order-details">
            <div class="order-info">
                <div class="order-number">
                    <h3>Bestellnummer</h3>
                    <p>{orderData.orderId}</p>
                </div>
                <div class="order-date">
                    <h3>Bestelldatum</h3>
                    <p>{formatDate(orderDate)}</p>
                </div>
                <div class="payment-status">
                    <h3>Zahlungsstatus</h3>
                    <p class="status-badge success">Bezahlt</p>
                </div>
            </div>
            
            <div class="purchased-items">
                <h2>Gekaufte Artikel</h2>
                <div class="items-list">
                    {#each orderData.items as item}
                        <div class="item">
                            <div class="item-thumbnail">
                                <img src={item.thumbnail} alt={item.title} />
                            </div>
                            <div class="item-details">
                                <h3>{item.title}</h3>
                                <p class="item-type">{item.type === 'training_plan' ? 'Trainingsplan' : 'Produkt'}</p>
                            </div>
                            <div class="item-price">{item.price}</div>
                        </div>
                    {/each}
                </div>
                
                <div class="order-summary">
                    {#if orderData.discount > 0}
                        <div class="summary-row">
                            <span>Zwischensumme</span>
                            <span>{formatPrice(orderData.total + orderData.discount)}</span>
                        </div>
                        <div class="summary-row discount">
                            <span>Rabatt</span>
                            <span>-{formatPrice(orderData.discount)}</span>
                        </div>
                    {/if}
                    <div class="summary-row total">
                        <span>Gesamtsumme</span>
                        <span>{formatPrice(orderData.total)}</span>
                    </div>
                </div>
            </div>
            
            <div class="delivery-info">
                <h2>Digitale Lieferung</h2>
                <p>Deine gekauften Trainingspläne werden in deinem Konto bereitgestellt:</p>
                <ul>
                    <li><strong>Zugriff:</strong> Ab sofort in deinem Mitgliederbereich verfügbar</li>
                    <li><strong>Download:</strong> PDF und interaktive Versionen für alle gekauften Pläne</li>
                    <li><strong>Unterstützung:</strong> Bei Fragen steht unser Support-Team zur Verfügung</li>
                </ul>
            </div>
            
            {#if orderData.billingInfo}
                <div class="billing-info">
                    <h2>Rechnungsdaten</h2>
                    <p>{orderData.billingInfo.fullName}</p>
                    <p>{orderData.billingInfo.address}</p>
                    <p>{orderData.billingInfo.postalCode} {orderData.billingInfo.city}</p>
                    <p>{orderData.billingInfo.country}</p>
                    <p>{orderData.billingInfo.email}</p>
                </div>
            {/if}
        </div>
        
        <div class="next-steps">
            <h2>Nächste Schritte</h2>
            <div class="next-steps-grid">
                <div class="next-step">
                    <div class="step-icon">
                        <i class="material-icons">email</i>
                    </div>
                    <h3>Bestätigungs-E-Mail</h3>
                    <p>Eine detaillierte Bestätigung wurde an deine E-Mail-Adresse gesendet.</p>
                </div>
                <div class="next-step">
                    <div class="step-icon">
                        <i class="material-icons">assignment</i>
                    </div>
                    <h3>Zugriff auf Trainingsplan</h3>
                    <p>Deine Pläne sind jetzt in deinem Konto unter "Meine Pläne" verfügbar.</p>
                </div>
                <div class="next-step">
                    <div class="step-icon">
                        <i class="material-icons">support_agent</i>
                    </div>
                    <h3>Support</h3>
                    <p>Bei Fragen oder Problemen steht unser Team zur Verfügung.</p>
                </div>
            </div>
        </div>
        
        <div class="action-buttons">
            <a href="/" class="btn btn-outline">Zurück zur Startseite</a>
            <a href="/member/training-plan" class="btn btn-primary">Zu meinen Trainingsplänen</a>
        </div>
    {/if}
</div>

<style>
    .confirmation-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }
    
    .confirmation-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .success-icon {
        margin-bottom: 1.5rem;
    }
    
    .success-icon i {
        font-size: 4rem;
        color: #2ecc71;
    }
    
    .confirmation-header h1 {
        margin: 0 0 1rem 0;
        color: var(--text);
        font-size: 2rem;
    }
    
    .confirmation-header p {
        color: var(--text-light);
        font-size: 1.1rem;
        margin: 0;
    }
    
    .order-details {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 2rem;
        margin-bottom: 2rem;
    }
    
    .order-info {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .order-info h3 {
        font-size: 0.9rem;
        color: var(--text-light);
        margin: 0 0 0.5rem 0;
        font-weight: 500;
    }
    
    .order-info p {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text);
    }
    
    .status-badge {
        display: inline-block;
        padding: 0.35rem 0.75rem;
        border-radius: 50px;
        font-size: 0.9rem;
    }
    
    .status-badge.success {
        background-color: rgba(46, 204, 113, 0.2);
        color: #2ecc71;
    }
    
    .purchased-items {
        margin-bottom: 2rem;
    }
    
    .purchased-items h2,
    .delivery-info h2,
    .billing-info h2 {
        font-size: 1.25rem;
        margin: 0 0 1.25rem 0;
        color: var(--text);
    }
    
    .items-list {
        margin-bottom: 1.5rem;
    }
    
    .item {
        display: flex;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .item:last-child {
        border-bottom: none;
    }
    
    .item-thumbnail {
        width: 60px;
        height: 60px;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 1rem;
    }
    
    .item-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .item-details {
        flex-grow: 1;
    }
    
    .item-details h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        color: var(--text);
    }
    
    .item-type {
        font-size: 0.85rem;
        color: var(--text-light);
        margin: 0;
    }
    
    .item-price {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--primary);
    }
    
    .order-summary {
        padding: 1.25rem;
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 4px;
    }
    
    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
    }
    
    .summary-row:last-child {
        margin-bottom: 0;
    }
    
    .summary-row.discount {
        color: #2ecc71;
    }
    
    .summary-row.total {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        font-weight: 600;
        font-size: 1.1rem;
    }
    
    .summary-row.total span:last-child {
        color: var(--primary);
    }
    
    .delivery-info,
    .billing-info {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .delivery-info p,
    .billing-info p {
        margin: 0 0 0.75rem 0;
        color: var(--text-light);
    }
    
    .delivery-info ul {
        list-style-type: none;
        padding: 0;
        margin: 1rem 0 0 0;
    }
    
    .delivery-info li {
        margin-bottom: 0.75rem;
        color: var(--text);
    }
    
    .next-steps {
        margin-bottom: 2.5rem;
    }
    
    .next-steps h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
        color: var(--text);
    }
    
    .next-steps-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
    }
    
    .next-step {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 1.5rem;
        text-align: center;
        transition: transform 0.3s ease;
    }
    
    .next-step:hover {
        transform: translateY(-5px);
    }
    
    .step-icon {
        margin-bottom: 1rem;
    }
    
    .step-icon i {
        font-size: 2.5rem;
        color: var(--primary);
    }
    
    .next-step h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1.1rem;
        color: var(--text);
    }
    
    .next-step p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-light);
    }
    
    .action-buttons {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
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
    
    .no-order-data {
        text-align: center;
        padding: 4rem 2rem;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
    }
    
    .no-order-data i {
        font-size: 4rem;
        color: var(--text-light);
        margin-bottom: 1.5rem;
    }
    
    .no-order-data h2 {
        margin-top: 0;
        margin-bottom: 1rem;
    }
    
    .no-order-data p {
        margin: 0;
        color: var(--text-light);
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    @media (max-width: 768px) {
        .order-info {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .next-steps-grid {
            grid-template-columns: 1fr;
        }
        
        .action-buttons {
            flex-direction: column;
            gap: 1rem;
        }
    }
</style>

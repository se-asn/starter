<script>
    import { onMount } from 'svelte';
    import { cartStore } from '$lib/stores/cartStore';
    import { authStore } from '$lib/stores/authStore';
    import { goto } from '$app/navigation';

    let cart;
    let user;
    let isLoading = true;
    let step = 1; // 1 = Review cart, 2 = Address, 3 = Payment, 4 = Processing
    let discountCode = '';
    let discountApplied = false;
    let discountAmount = 0;
    let originalTotal = 0;
    let processingPayment = false;
    let paymentError = '';

    // Form data for billing information
    let billingInfo = {
        fullName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Deutschland'
    };

    // Form data for payment
    let paymentInfo = {
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    };

    // Validation state
    let validationErrors = {
        billingInfo: {},
        paymentInfo: {}
    };

    // Unsubscribe functions
    let unsubscribeCart;
    let unsubscribeAuth;

    onMount(() => {
        // Subscribe to cart store
        unsubscribeCart = cartStore.subscribe(state => {
            cart = state;
            originalTotal = state.total;
            isLoading = false;
        });

        // Subscribe to auth store
        unsubscribeAuth = authStore.subscribe(state => {
            user = state.user;
            
            // Pre-fill billing information if user is logged in
            if (user) {
                billingInfo.fullName = user.name || '';
                billingInfo.email = user.email || '';
            }
        });

        return () => {
            unsubscribeCart && unsubscribeCart();
            unsubscribeAuth && unsubscribeAuth();
        };
    });

    // Apply discount code
    function applyDiscount() {
        // Reset previous state
        discountApplied = false;
        discountAmount = 0;
        
        // Simple demo discount codes
        const discountCodes = {
            'WELCOME10': 0.1,  // 10% off
            'RUNNER20': 0.2,   // 20% off
            'SOMMER25': 0.25   // 25% off
        };
        
        const normalizedCode = discountCode.trim().toUpperCase();
        if (normalizedCode && discountCodes[normalizedCode]) {
            const discount = discountCodes[normalizedCode];
            discountAmount = originalTotal * discount;
            discountApplied = true;
        }
    }

    // Validate billing information
    function validateBillingInfo() {
        const errors = {};
        
        if (!billingInfo.fullName) errors.fullName = 'Name ist erforderlich';
        if (!billingInfo.email) errors.email = 'E-Mail ist erforderlich';
        else if (!/^\S+@\S+\.\S+$/.test(billingInfo.email)) errors.email = 'Ungültige E-Mail-Adresse';
        if (!billingInfo.address) errors.address = 'Adresse ist erforderlich';
        if (!billingInfo.city) errors.city = 'Stadt ist erforderlich';
        if (!billingInfo.postalCode) errors.postalCode = 'Postleitzahl ist erforderlich';
        
        validationErrors.billingInfo = errors;
        return Object.keys(errors).length === 0;
    }

    // Validate payment information
    function validatePaymentInfo() {
        const errors = {};
        
        // Basic validation (in a real app, use a library for proper card validation)
        if (!paymentInfo.cardNumber) errors.cardNumber = 'Kartennummer ist erforderlich';
        else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
            errors.cardNumber = 'Ungültige Kartennummer';
        }
        
        if (!paymentInfo.cardHolder) errors.cardHolder = 'Karteninhaber ist erforderlich';
        if (!paymentInfo.expiryDate) errors.expiryDate = 'Ablaufdatum ist erforderlich';
        else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
            errors.expiryDate = 'Format: MM/JJ';
        }
        
        if (!paymentInfo.cvv) errors.cvv = 'Sicherheitscode ist erforderlich';
        else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
            errors.cvv = 'Ungültiger Sicherheitscode';
        }
        
        validationErrors.paymentInfo = errors;
        return Object.keys(errors).length === 0;
    }

    // Handle step transitions
    function nextStep() {
        if (step === 1) {
            // Can only proceed if cart has items
            if (cart.items.length === 0) return;
            step = 2;
        } else if (step === 2) {
            // Validate billing info before proceeding
            if (validateBillingInfo()) {
                step = 3;
            }
        } else if (step === 3) {
            // Process payment
            if (validatePaymentInfo()) {
                processPayment();
            }
        }
    }

    function prevStep() {
        if (step > 1) step--;
    }

    // Calculate final total after discount
    $: finalTotal = originalTotal - discountAmount;

    // Format price to Euro
    function formatPrice(price) {
        // If price is already formatted with €, return as is
        if (typeof price === 'string' && price.includes('€')) {
            return price;
        }
        
        // Otherwise format as Euro
        return `€${price.toFixed(2)}`;
    }

    // Process payment (simulated)
    async function processPayment() {
        step = 4; // Show processing screen
        processingPayment = true;
        paymentError = '';
        
        // Simulate payment processing
        setTimeout(() => {
            // For demo purposes, we'll simulate a successful payment
            processingPayment = false;
            
            // Create order data to pass to confirmation page
            const orderData = {
                orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                items: cart.items,
                total: finalTotal,
                discount: discountAmount,
                billingInfo: { ...billingInfo }
            };
            
            // Store order data in sessionStorage for the confirmation page
            sessionStorage.setItem('orderData', JSON.stringify(orderData));
            
            // Clear cart and redirect to confirmation page
            cartStore.clearCart();
            goto('/checkout/confirmation');
        }, 2000);
    }

    // Format card number with spaces
    function formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '');
        if (value.length > 16) value = value.substr(0, 16);
        
        // Add space after every 4 digits
        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        paymentInfo.cardNumber = formatted;
    }

    // Format expiry date (MM/YY)
    function formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.substr(0, 4);
        
        if (value.length > 2) {
            paymentInfo.expiryDate = value.substr(0, 2) + '/' + value.substr(2);
        } else {
            paymentInfo.expiryDate = value;
        }
    }
</script>

<svelte:head>
    <title>Checkout - RunOne</title>
</svelte:head>

<div class="checkout-container">
    {#if isLoading}
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Wird geladen...</p>
        </div>
    {:else if cart.items.length === 0}
        <div class="empty-cart">
            <i class="material-icons">shopping_cart</i>
            <h2>Dein Warenkorb ist leer</h2>
            <p>Füge Trainingspläne oder andere Produkte hinzu, um fortzufahren.</p>
            <a href="/plans" class="btn btn-primary">Trainingspläne entdecken</a>
        </div>
    {:else}
        <!-- Checkout steps -->
        <div class="checkout-progress">
            <div class="step {step >= 1 ? 'active' : ''} {step > 1 ? 'completed' : ''}">
                <div class="step-number">1</div>
                <div class="step-label">Warenkorb</div>
            </div>
            <div class="step-connector"></div>
            <div class="step {step >= 2 ? 'active' : ''} {step > 2 ? 'completed' : ''}">
                <div class="step-number">2</div>
                <div class="step-label">Rechnungsdaten</div>
            </div>
            <div class="step-connector"></div>
            <div class="step {step >= 3 ? 'active' : ''} {step > 3 ? 'completed' : ''}">
                <div class="step-number">3</div>
                <div class="step-label">Zahlung</div>
            </div>
        </div>

        <!-- Step 1: Cart review -->
        {#if step === 1}
            <div class="checkout-section">
                <h2>Warenkorb</h2>
                <div class="cart-items">
                    {#each cart.items as item}
                        <div class="cart-item">
                            <div class="item-thumbnail">
                                <img src={item.thumbnail} alt={item.title} />
                            </div>
                            <div class="item-details">
                                <h3>{item.title}</h3>
                                <p class="item-type">{item.type === 'training_plan' ? 'Trainingsplan' : 'Produkt'}</p>
                            </div>
                            <div class="item-price">{item.price}</div>
                            <button class="remove-item" on:click={() => cartStore.removeItem(item.id)}>
                                <i class="material-icons">close</i>
                            </button>
                        </div>
                    {/each}
                </div>
                
                <div class="discount-section">
                    <div class="discount-input">
                        <input 
                            type="text" 
                            placeholder="Rabattcode eingeben" 
                            bind:value={discountCode}
                            disabled={discountApplied}
                        />
                        <button 
                            class="btn btn-outline" 
                            on:click={applyDiscount}
                            disabled={!discountCode || discountApplied}
                        >
                            {discountApplied ? 'Angewendet' : 'Anwenden'}
                        </button>
                    </div>
                    
                    {#if discountApplied}
                        <div class="discount-applied">
                            <i class="material-icons">check_circle</i>
                            <span>Rabattcode angewendet: {formatPrice(discountAmount)} Rabatt</span>
                        </div>
                    {/if}
                </div>
                
                <div class="order-summary">
                    <div class="summary-row">
                        <span>Zwischensumme</span>
                        <span>{formatPrice(originalTotal)}</span>
                    </div>
                    
                    {#if discountApplied}
                        <div class="summary-row discount">
                            <span>Rabatt</span>
                            <span>-{formatPrice(discountAmount)}</span>
                        </div>
                    {/if}
                    
                    <div class="summary-row total">
                        <span>Gesamtsumme</span>
                        <span>{formatPrice(finalTotal)}</span>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <a href="/plans" class="btn btn-outline">Weiter einkaufen</a>
                    <button class="btn btn-primary" on:click={nextStep}>Weiter zur Bezahlung</button>
                </div>
            </div>
        {/if}

        <!-- Step 2: Billing Address -->
        {#if step === 2}
            <div class="checkout-section">
                <h2>Rechnungsdaten</h2>
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label for="fullName">Vollständiger Name *</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            bind:value={billingInfo.fullName} 
                            class={validationErrors.billingInfo.fullName ? 'error' : ''}
                        />
                        {#if validationErrors.billingInfo.fullName}
                            <p class="error-message">{validationErrors.billingInfo.fullName}</p>
                        {/if}
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="email">E-Mail-Adresse *</label>
                        <input 
                            type="email" 
                            id="email" 
                            bind:value={billingInfo.email}
                            class={validationErrors.billingInfo.email ? 'error' : ''}
                        />
                        {#if validationErrors.billingInfo.email}
                            <p class="error-message">{validationErrors.billingInfo.email}</p>
                        {/if}
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="address">Adresse *</label>
                        <input 
                            type="text" 
                            id="address" 
                            bind:value={billingInfo.address}
                            class={validationErrors.billingInfo.address ? 'error' : ''}
                        />
                        {#if validationErrors.billingInfo.address}
                            <p class="error-message">{validationErrors.billingInfo.address}</p>
                        {/if}
                    </div>
                    
                    <div class="form-group">
                        <label for="city">Stadt *</label>
                        <input 
                            type="text" 
                            id="city" 
                            bind:value={billingInfo.city}
                            class={validationErrors.billingInfo.city ? 'error' : ''}
                        />
                        {#if validationErrors.billingInfo.city}
                            <p class="error-message">{validationErrors.billingInfo.city}</p>
                        {/if}
                    </div>
                    
                    <div class="form-group">
                        <label for="postalCode">Postleitzahl *</label>
                        <input 
                            type="text" 
                            id="postalCode" 
                            bind:value={billingInfo.postalCode}
                            class={validationErrors.billingInfo.postalCode ? 'error' : ''}
                        />
                        {#if validationErrors.billingInfo.postalCode}
                            <p class="error-message">{validationErrors.billingInfo.postalCode}</p>
                        {/if}
                    </div>
                    
                    <div class="form-group">
                        <label for="country">Land *</label>
                        <select id="country" bind:value={billingInfo.country}>
                            <option value="Deutschland">Deutschland</option>
                            <option value="Österreich">Österreich</option>
                            <option value="Schweiz">Schweiz</option>
                        </select>
                    </div>
                </div>
                
                <div class="order-summary">
                    <div class="summary-row">
                        <span>Zwischensumme</span>
                        <span>{formatPrice(originalTotal)}</span>
                    </div>
                    
                    {#if discountApplied}
                        <div class="summary-row discount">
                            <span>Rabatt</span>
                            <span>-{formatPrice(discountAmount)}</span>
                        </div>
                    {/if}
                    
                    <div class="summary-row total">
                        <span>Gesamtsumme</span>
                        <span>{formatPrice(finalTotal)}</span>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-outline" on:click={prevStep}>Zurück</button>
                    <button class="btn btn-primary" on:click={nextStep}>Weiter zum Zahlungsprozess</button>
                </div>
            </div>
        {/if}

        <!-- Step 3: Payment -->
        {#if step === 3}
            <div class="checkout-section">
                <h2>Zahlungsinformationen</h2>
                <div class="payment-method-selector">
                    <div class="payment-method active">
                        <input type="radio" id="credit-card" name="payment-method" checked />
                        <label for="credit-card">Kreditkarte</label>
                    </div>
                    <div class="payment-method disabled">
                        <input type="radio" id="paypal" name="payment-method" disabled />
                        <label for="paypal">PayPal (demnächst verfügbar)</label>
                    </div>
                </div>
                
                <div class="payment-form">
                    <div class="form-group full-width">
                        <label for="cardNumber">Kartennummer *</label>
                        <div class="card-number-input">
                            <input 
                                type="text" 
                                id="cardNumber" 
                                value={paymentInfo.cardNumber}
                                on:input={formatCardNumber}
                                placeholder="1234 5678 9012 3456"
                                maxlength="19"
                                class={validationErrors.paymentInfo.cardNumber ? 'error' : ''}
                            />
                            <div class="card-icons">
                                <span class="card-icon visa"></span>
                                <span class="card-icon mastercard"></span>
                            </div>
                        </div>
                        {#if validationErrors.paymentInfo.cardNumber}
                            <p class="error-message">{validationErrors.paymentInfo.cardNumber}</p>
                        {/if}
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="cardHolder">Karteninhaber *</label>
                        <input 
                            type="text" 
                            id="cardHolder" 
                            bind:value={paymentInfo.cardHolder}
                            placeholder="Name wie auf der Karte"
                            class={validationErrors.paymentInfo.cardHolder ? 'error' : ''}
                        />
                        {#if validationErrors.paymentInfo.cardHolder}
                            <p class="error-message">{validationErrors.paymentInfo.cardHolder}</p>
                        {/if}
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiryDate">Gültig bis *</label>
                            <input 
                                type="text" 
                                id="expiryDate" 
                                value={paymentInfo.expiryDate}
                                on:input={formatExpiryDate}
                                placeholder="MM/JJ"
                                maxlength="5"
                                class={validationErrors.paymentInfo.expiryDate ? 'error' : ''}
                            />
                            {#if validationErrors.paymentInfo.expiryDate}
                                <p class="error-message">{validationErrors.paymentInfo.expiryDate}</p>
                            {/if}
                        </div>
                        
                        <div class="form-group">
                            <label for="cvv">Sicherheitscode (CVV) *</label>
                            <input 
                                type="text" 
                                id="cvv" 
                                bind:value={paymentInfo.cvv}
                                placeholder="123"
                                maxlength="4"
                                class={validationErrors.paymentInfo.cvv ? 'error' : ''}
                            />
                            {#if validationErrors.paymentInfo.cvv}
                                <p class="error-message">{validationErrors.paymentInfo.cvv}</p>
                            {/if}
                        </div>
                    </div>
                </div>
                
                <div class="secure-payment-notice">
                    <i class="material-icons">lock</i>
                    <p>Deine Zahlungsinformationen werden sicher verschlüsselt übertragen.</p>
                </div>
                
                <div class="order-summary">
                    <div class="summary-row">
                        <span>Zwischensumme</span>
                        <span>{formatPrice(originalTotal)}</span>
                    </div>
                    
                    {#if discountApplied}
                        <div class="summary-row discount">
                            <span>Rabatt</span>
                            <span>-{formatPrice(discountAmount)}</span>
                        </div>
                    {/if}
                    
                    <div class="summary-row total">
                        <span>Gesamtsumme</span>
                        <span>{formatPrice(finalTotal)}</span>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-outline" on:click={prevStep}>Zurück</button>
                    <button class="btn btn-primary" on:click={nextStep}>Bestellung abschließen</button>
                </div>
                
                {#if paymentError}
                    <div class="payment-error">
                        <i class="material-icons">error</i>
                        <p>{paymentError}</p>
                    </div>
                {/if}
            </div>
        {/if}

        <!-- Step 4: Processing -->
        {#if step === 4}
            <div class="processing-payment">
                <div class="loading-spinner large"></div>
                <h2>Deine Zahlung wird verarbeitet</h2>
                <p>Bitte habe einen Moment Geduld. Schließe diese Seite nicht...</p>
            </div>
        {/if}
    {/if}
</div>

<style>
    .checkout-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }
    
    .checkout-progress {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2.5rem;
    }
    
    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }
    
    .step-number {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.2);
        color: var(--text-light);
        font-weight: 600;
        margin-bottom: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .step.active .step-number {
        background-color: var(--primary);
        color: var(--dark);
    }
    
    .step.completed .step-number {
        background-color: #2ecc71;
        color: var(--dark);
    }
    
    .step.completed .step-number::after {
        content: '✓';
    }
    
    .step-label {
        font-size: 0.85rem;
        color: var(--text-light);
        transition: all 0.3s ease;
    }
    
    .step.active .step-label {
        color: var(--primary);
        font-weight: 500;
    }
    
    .step-connector {
        height: 2px;
        flex-grow: 1;
        background-color: rgba(255, 255, 255, 0.1);
        width: 4rem;
        margin: 0 0.5rem;
        position: relative;
        top: -0.5rem;
    }
    
    .checkout-section {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 2rem;
    }
    
    .checkout-section h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: var(--text);
        font-size: 1.5rem;
    }
    
    .cart-items {
        margin-bottom: 2rem;
    }
    
    .cart-item {
        display: flex;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .cart-item:last-child {
        border-bottom: none;
    }
    
    .item-thumbnail {
        width: 80px;
        height: 80px;
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
        font-size: 1.1rem;
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
        margin: 0 1.5rem;
    }
    
    .remove-item {
        background: none;
        border: none;
        color: var(--text-light);
        cursor: pointer;
        padding: 0.25rem;
        transition: all 0.3s ease;
    }
    
    .remove-item:hover {
        color: #e74c3c;
    }
    
    .discount-section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .discount-input {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .discount-input input {
        flex-grow: 1;
        padding: 0.75rem 1rem;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text);
    }
    
    .discount-applied {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #2ecc71;
        font-size: 0.9rem;
    }
    
    .order-summary {
        margin-bottom: 2rem;
        padding: 1.5rem;
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
    
    .action-buttons {
        display: flex;
        justify-content: space-between;
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
    }
    
    .form-group.full-width {
        grid-column: span 2;
    }
    
    .form-group label {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-light);
    }
    
    .form-group input, .form-group select {
        padding: 0.75rem;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text);
        font-size: 1rem;
    }
    
    .form-group input.error,
    .form-group select.error {
        border-color: #e74c3c;
    }
    
    .error-message {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        margin-bottom: 0;
    }
    
    .payment-method-selector {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .payment-method {
        padding: 1rem;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.1);
        flex: 1;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .payment-method.active {
        border-color: var(--primary);
    }
    
    .payment-method.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .payment-method label {
        margin-left: 0.5rem;
        cursor: pointer;
    }
    
    .payment-form {
        margin-bottom: 2rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }
    
    .card-number-input {
        position: relative;
    }
    
    .card-icons {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        gap: 0.5rem;
    }
    
    .card-icon {
        width: 2rem;
        height: 1.25rem;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 3px;
        display: inline-block;
    }
    
    .secure-payment-notice {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        margin-bottom: 2rem;
    }
    
    .secure-payment-notice i {
        color: #2ecc71;
    }
    
    .secure-payment-notice p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-light);
    }
    
    .payment-error {
        margin-top: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background-color: rgba(231, 76, 60, 0.2);
        border-radius: 4px;
        color: #e74c3c;
    }
    
    .processing-payment {
        text-align: center;
        padding: 4rem 2rem;
    }
    
    .processing-payment h2 {
        margin-top: 2rem;
    }
    
    .loading-spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid rgba(0, 242, 254, 0.3);
        border-radius: 50%;
        border-top-color: var(--primary);
        animation: spin 1s ease-in-out infinite;
        margin: 0 auto;
    }
    
    .loading-spinner.large {
        width: 4rem;
        height: 4rem;
        border-width: 4px;
    }
    
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
    }
    
    .empty-cart {
        text-align: center;
        padding: 4rem 2rem;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
    }
    
    .empty-cart i {
        font-size: 4rem;
        color: var(--text-light);
        margin-bottom: 1.5rem;
    }
    
    .empty-cart h2 {
        margin-top: 0;
        margin-bottom: 1rem;
    }
    
    .empty-cart p {
        margin-bottom: 2rem;
        color: var(--text-light);
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    @media (max-width: 768px) {
        .checkout-progress {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .step-connector {
            width: 2px;
            height: 2rem;
            margin: 0 0 0 1.25rem;
        }
        
        .form-grid,
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .form-group.full-width {
            grid-column: span 1;
        }
        
        .action-buttons {
            flex-direction: column;
            gap: 1rem;
        }
        
        .payment-method-selector {
            flex-direction: column;
        }
        
        .checkout-section {
            padding: 1.5rem 1rem;
        }
    }
</style>

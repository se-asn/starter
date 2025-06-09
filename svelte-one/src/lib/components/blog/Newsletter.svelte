<script>
    let email = '';
    let name = '';
    let isSubmitting = false;
    let message = '';
    let isSuccess = false;
    let isError = false;
    
    async function submitNewsletter() {
        if (!email) {
            message = 'Bitte gib eine E-Mail-Adresse ein.';
            isError = true;
            return;
        }
        
        // Basic email validation
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            message = 'Bitte gib eine gültige E-Mail-Adresse ein.';
            isError = true;
            return;
        }
        
        isSubmitting = true;
        isError = false;
        isSuccess = false;
        message = '';
        
        try {
            const response = await fetch('/api/blog/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                isSuccess = true;
                message = data.message;
                email = '';
                name = '';
            } else {
                isError = true;
                message = data.error || 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
            }
        } catch (error) {
            console.error('Error submitting newsletter signup:', error);
            isError = true;
            message = 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<section class="newsletter-section">
    <div class="newsletter-container">
        <div class="newsletter-content">
            <h2>Lauftraining-Newsletter</h2>
            <p>Melde dich für unseren kostenlosen Newsletter an und erhalte:</p>
            <ul>
                <li>Wöchentliche Lauftipps direkt in dein Postfach</li>
                <li>Exklusive Trainingsvideos und Anleitungen</li>
                <li>Zugang zu limitierten Angeboten und Rabatten</li>
                <li>Neueste Artikel und Expertenwissen</li>
            </ul>
        </div>
        
        <div class="newsletter-form-container">
            {#if isSuccess}
                <div class="message success">
                    <i class="material-icons">check_circle</i>
                    <p>{message}</p>
                </div>
            {:else}
                <form on:submit|preventDefault={submitNewsletter} class="newsletter-form">
                    {#if isError}
                        <div class="message error">
                            <i class="material-icons">error</i>
                            <p>{message}</p>
                        </div>
                    {/if}
                    
                    <div class="form-group">
                        <input 
                            type="text" 
                            placeholder="Dein Name (optional)" 
                            bind:value={name}
                        />
                    </div>
                    
                    <div class="form-group">
                        <input 
                            type="email" 
                            placeholder="Deine E-Mail-Adresse *" 
                            bind:value={email}
                            required
                        />
                    </div>
                    
                    <div class="form-policy">
                        <p>
                            Wir verwenden deine Daten nur für den Newsletter. Du kannst dich jederzeit abmelden.
                            Weitere Informationen findest du in unserer <a href="/datenschutz">Datenschutzerklärung</a>.
                        </p>
                    </div>
                    
                    <button type="submit" class="subscribe-button" disabled={isSubmitting}>
                        {#if isSubmitting}
                            <span class="spinner"></span>
                            Wird angemeldet...
                        {:else}
                            Jetzt anmelden
                        {/if}
                    </button>
                </form>
            {/if}
        </div>
    </div>
</section>

<style>
    .newsletter-section {
        background-color: var(--dark-gray);
        padding: 5rem 0;
        margin-top: 3rem;
    }
    
    .newsletter-container {
        max-width: 900px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        background-color: var(--dark);
        border-radius: 10px;
        padding: 3rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        position: relative;
        overflow: hidden;
    }
    
    .newsletter-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
    }
    
    .newsletter-content h2 {
        font-size: 1.8rem;
        color: var(--primary);
        margin-top: 0;
        margin-bottom: 1.5rem;
    }
    
    .newsletter-content p {
        font-size: 1rem;
        color: var(--text);
        margin-bottom: 1.25rem;
    }
    
    .newsletter-content ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .newsletter-content li {
        position: relative;
        padding-left: 1.75rem;
        margin-bottom: 0.75rem;
        color: var(--text-light);
    }
    
    .newsletter-content li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary);
        font-weight: bold;
    }
    
    .newsletter-form-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    .newsletter-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .form-group input {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text);
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus {
        outline: none;
        border-color: var(--primary);
    }
    
    .form-policy {
        font-size: 0.8rem;
        color: var(--text-light);
        margin-bottom: 0.5rem;
    }
    
    .form-policy a {
        color: var(--primary);
        text-decoration: none;
    }
    
    .form-policy a:hover {
        text-decoration: underline;
    }
    
    .subscribe-button {
        background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
        color: var(--dark);
        border: none;
        border-radius: 4px;
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .subscribe-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 242, 254, 0.3);
    }
    
    .subscribe-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .message {
        padding: 1rem;
        border-radius: 4px;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }
    
    .message.success {
        background-color: rgba(46, 204, 113, 0.2);
        border: 1px solid rgba(46, 204, 113, 0.3);
        color: #2ecc71;
    }
    
    .message.error {
        background-color: rgba(231, 76, 60, 0.2);
        border: 1px solid rgba(231, 76, 60, 0.3);
        color: #e74c3c;
    }
    
    .message i {
        font-size: 1.5rem;
    }
    
    .message p {
        margin: 0;
    }
    
    .spinner {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        border-top-color: #000;
        animation: spin 1s ease-in-out infinite;
        margin-right: 0.5rem;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    @media (max-width: 768px) {
        .newsletter-container {
            grid-template-columns: 1fr;
            padding: 2rem;
        }
        
        .newsletter-section {
            padding: 3rem 1rem;
        }
    }
</style>

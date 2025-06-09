<script>
    import { onMount } from 'svelte';
    let notificationPreferences = {
        email: true,
        browser: true,
        daysBefore: 1
    };
    let isSaving = false;
    let error = null;
    let successMessage = null;
    
    onMount(async () => {
        await loadNotificationPreferences();
    });
    
    async function loadNotificationPreferences() {
        try {
            const response = await fetch('/api/user/notifications');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fehler beim Laden der Benachrichtigungseinstellungen');
            }
            
            const data = await response.json();
            notificationPreferences = data.preferences;
        } catch (err) {
            console.error('Fehler beim Laden der Benachrichtigungseinstellungen:', err);
            error = err.message;
        }
    }
    
    async function saveNotificationPreferences() {
        try {
            isSaving = true;
            error = null;
            successMessage = null;
            
            const response = await fetch('/api/user/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notificationPreferences)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fehler beim Speichern der Benachrichtigungseinstellungen');
            }
            
            successMessage = 'Benachrichtigungseinstellungen erfolgreich gespeichert!';
            
            // Automatically clear success message after 5 seconds
            setTimeout(() => {
                successMessage = null;
            }, 5000);
        } catch (err) {
            console.error('Fehler beim Speichern der Benachrichtigungseinstellungen:', err);
            error = err.message;
        } finally {
            isSaving = false;
        }
    }
</script>

<div class="notification-settings card">
    <h2>Trainings-Benachrichtigungen</h2>
    
    {#if error}
        <div class="error-message">
            <p>{error}</p>
        </div>
    {/if}
    
    {#if successMessage}
        <div class="success-message">
            <p>{successMessage}</p>
        </div>
    {/if}
    
    <div class="settings-form">
        <div class="form-group">
            <label class="toggle-container">
                <span>E-Mail-Benachrichtigungen</span>
                <div class="toggle">
                    <input 
                        type="checkbox" 
                        bind:checked={notificationPreferences.email}
                    >
                    <span class="slider"></span>
                </div>
            </label>
            <p class="form-help">Erhalte eine E-Mail vor anstehenden Trainingseinheiten.</p>
        </div>
        
        <div class="form-group">
            <label class="toggle-container">
                <span>Browser-Benachrichtigungen</span>
                <div class="toggle">
                    <input 
                        type="checkbox" 
                        bind:checked={notificationPreferences.browser}
                    >
                    <span class="slider"></span>
                </div>
            </label>
            <p class="form-help">Erhalte Push-Benachrichtigungen im Browser, wenn du eingeloggt bist.</p>
        </div>
        
        <div class="form-group">
            <label for="days-before">Benachrichtigungszeitpunkt</label>
            <select id="days-before" bind:value={notificationPreferences.daysBefore}>
                <option value="0">Am selben Tag</option>
                <option value="1">1 Tag vorher</option>
                <option value="2">2 Tage vorher</option>
                <option value="3">3 Tage vorher</option>
            </select>
            <p class="form-help">Wie früh möchtest du an deine Trainingseinheiten erinnert werden?</p>
        </div>
        
        <div class="form-actions">
            <button 
                class="btn btn-primary" 
                on:click={saveNotificationPreferences} 
                disabled={isSaving}
            >
                {isSaving ? 'Wird gespeichert...' : 'Änderungen speichern'}
            </button>
        </div>
    </div>
</div>

<style>
    .notification-settings {
        padding: 1.5rem;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        margin-bottom: 2rem;
    }
    
    h2 {
        font-size: 1.25rem;
        color: var(--primary);
        margin: 0 0 1.5rem 0;
    }
    
    .error-message {
        background-color: rgba(231, 76, 60, 0.2);
        border-left: 4px solid #e74c3c;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1.5rem;
    }
    
    .success-message {
        background-color: rgba(46, 204, 113, 0.2);
        border-left: 4px solid #2ecc71;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1.5rem;
    }
    
    .settings-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .toggle-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .toggle {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 30px;
    }
    
    .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.1);
        transition: .4s;
        border-radius: 30px;
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 22px;
        width: 22px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    
    input:checked + .slider {
        background-color: var(--primary);
    }
    
    input:checked + .slider:before {
        transform: translateX(30px);
    }
    
    select {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.75rem;
        color: var(--text);
        font-size: 1rem;
    }
    
    select:focus {
        border-color: var(--primary);
        outline: none;
    }
    
    .form-help {
        font-size: 0.9rem;
        color: var(--text-light);
        margin: 0;
    }
    
    .form-actions {
        margin-top: 1rem;
    }
</style>

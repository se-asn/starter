<script>
    import { onMount } from 'svelte';
    
    export let src;
    export let alt = '';
    export let width = undefined;
    export let height = undefined;
    export let loading = 'lazy';
    export let className = '';
    
    let imageElement;
    let isLoaded = false;
    let hasError = false;
    
    onMount(() => {
        // Create a new image object to preload
        const img = new Image();
        
        img.onload = () => {
            isLoaded = true;
        };
        
        img.onerror = () => {
            hasError = true;
        };
        
        img.src = src;
        
        return () => {
            // Clean up
            img.onload = null;
            img.onerror = null;
        };
    });
    
    function handleError() {
        hasError = true;
    }
</script>

<div class={`optimized-image-wrapper ${className} ${isLoaded ? 'loaded' : 'loading'}`}>
    {#if hasError}
        <div class="image-error">
            <span>Bild konnte nicht geladen werden</span>
        </div>
    {:else}
        <img
            bind:this={imageElement}
            {src}
            {alt}
            {width}
            {height}
            {loading}
            on:error={handleError}
            class={isLoaded ? 'visible' : ''}
        />
        
        {#if !isLoaded}
            <div class="image-placeholder">
                <div class="image-spinner"></div>
            </div>
        {/if}
    {/if}
</div>

<style>
    .optimized-image-wrapper {
        position: relative;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.1);
        width: 100%;
        height: 100%;
    }
    
    .optimized-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .optimized-image-wrapper img.visible {
        opacity: 1;
    }
    
    .image-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.1);
    }
    
    .image-spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid rgba(0, 242, 254, 0.3);
        border-radius: 50%;
        border-top-color: var(--primary);
        animation: spin 1s ease-in-out infinite;
    }
    
    .image-error {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.1);
        color: var(--text-light);
        font-size: 0.9rem;
        text-align: center;
        padding: 1rem;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>

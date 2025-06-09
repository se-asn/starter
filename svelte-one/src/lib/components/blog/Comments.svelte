<script>
    import { onMount } from 'svelte';
    import { commentStore } from '$lib/stores/commentStore';
    import { authStore } from '$lib/stores/authStore';
    
    export let postSlug;
    
    let comments = [];
    let newComment = { content: '', author: '', email: '' };
    let isSubmitting = false;
    let isLoggedIn = false;
    let user = null;
    let showCommentForm = false;
    let commentError = '';
    let isLoading = true;
    
    // Subscribe to stores
    const unsubscribeComment = commentStore.subscribe(state => {
        comments = state.comments[postSlug] || [];
        isLoading = state.isLoading;
        
        // Reset error message if store error is cleared
        if (!state.error) {
            commentError = '';
        }
    });
    
    const unsubscribeAuth = authStore.subscribe(state => {
        isLoggedIn = !!state.user;
        user = state.user;
        
        // Pre-fill comment form if user is logged in
        if (isLoggedIn && user) {
            newComment.author = user.name || '';
            newComment.email = user.email || '';
        }
    });
    
    // Clean up subscriptions
    onMount(() => {
        // Fetch comments for this post
        commentStore.fetchComments(postSlug);
        
        return () => {
            unsubscribeComment();
            unsubscribeAuth();
        };
    });
    
    // Submit a new comment
    async function submitComment() {
        // Reset error
        commentError = '';
        
        // Validate comment
        if (!newComment.content.trim()) {
            commentError = 'Bitte gib einen Kommentar ein.';
            return;
        }
        
        if (!isLoggedIn) {
            if (!newComment.author.trim()) {
                commentError = 'Bitte gib deinen Namen ein.';
                return;
            }
            
            if (!newComment.email.trim()) {
                commentError = 'Bitte gib deine E-Mail-Adresse ein.';
                return;
            }
            
            // Basic email validation
            if (!/^\S+@\S+\.\S+$/.test(newComment.email)) {
                commentError = 'Bitte gib eine gültige E-Mail-Adresse ein.';
                return;
            }
        }
        
        isSubmitting = true;
        
        try {
            // Add avatar if user is logged in
            const commentData = {
                ...newComment,
                avatar: user?.avatar || null
            };
            
            await commentStore.addComment(postSlug, commentData);
            
            // Reset form
            newComment.content = '';
            
            // If not logged in, keep the name and email for convenience
            if (!isLoggedIn) {
                showCommentForm = false;
            }
        } catch (error) {
            commentError = 'Fehler beim Speichern des Kommentars. Bitte versuche es später erneut.';
        } finally {
            isSubmitting = false;
        }
    }
    
    // Like a comment
    function likeComment(commentId) {
        commentStore.likeComment(postSlug, commentId);
    }
    
    // Format the date nicely
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Generate initials for avatar
    function getInitials(name) {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    
    // Toggle comment form
    function toggleCommentForm() {
        showCommentForm = !showCommentForm;
    }
</script>

<section class="comments-section">
    <h2 class="comments-heading">
        Kommentare {comments.length > 0 ? `(${comments.length})` : ''}
    </h2>
    
    <div class="comments-container">
        {#if isLoading}
            <div class="comments-loading">
                <div class="loading-spinner"></div>
                <p>Kommentare werden geladen...</p>
            </div>
        {:else if comments.length === 0}
            <div class="no-comments">
                <p>Noch keine Kommentare. Sei der Erste, der einen Kommentar hinterlässt!</p>
            </div>
        {:else}
            <div class="comments-list">
                {#each comments as comment (comment.id)}
                    <div class="comment">
                        <div class="comment-avatar">
                            {#if comment.avatar}
                                <img src={comment.avatar} alt={comment.author} />
                            {:else}
                                <div class="avatar-placeholder">
                                    {getInitials(comment.author)}
                                </div>
                            {/if}
                        </div>
                        <div class="comment-content">
                            <div class="comment-header">
                                <h4 class="comment-author">{comment.author}</h4>
                                <span class="comment-date">{formatDate(comment.date)}</span>
                            </div>
                            <div class="comment-text">
                                {comment.content}
                            </div>
                            <div class="comment-actions">
                                <button class="like-button" on:click={() => likeComment(comment.id)}>
                                    <i class="material-icons">thumb_up</i>
                                    <span>{comment.likes}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    
    <div class="add-comment">
        {#if showCommentForm}
            <form class="comment-form" on:submit|preventDefault={submitComment}>
                <h3>Kommentar hinzufügen</h3>
                
                {#if commentError}
                    <div class="error-message">
                        {commentError}
                    </div>
                {/if}
                
                <div class="form-group">
                    <textarea 
                        bind:value={newComment.content} 
                        placeholder="Dein Kommentar..."
                        rows="4"
                        required
                    ></textarea>
                </div>
                
                {#if !isLoggedIn}
                    <div class="form-row">
                        <div class="form-group">
                            <input 
                                type="text" 
                                bind:value={newComment.author} 
                                placeholder="Dein Name" 
                                required
                            />
                        </div>
                        <div class="form-group">
                            <input 
                                type="email" 
                                bind:value={newComment.email} 
                                placeholder="Deine E-Mail (wird nicht veröffentlicht)" 
                                required
                            />
                        </div>
                    </div>
                {/if}
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" on:click={toggleCommentForm}>
                        Abbrechen
                    </button>
                    <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
                        {#if isSubmitting}
                            <span class="spinner"></span>
                            Wird gesendet...
                        {:else}
                            Kommentar senden
                        {/if}
                    </button>
                </div>
            </form>
        {:else}
            <button class="btn btn-primary add-comment-button" on:click={toggleCommentForm}>
                <i class="material-icons">comment</i>
                Kommentar hinzufügen
            </button>
        {/if}
    </div>
</section>

<style>
    .comments-section {
        margin-top: 3rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 2rem;
    }
    
    .comments-heading {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        color: var(--text);
    }
    
    .comments-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
    
    .loading-spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid rgba(0, 242, 254, 0.3);
        border-radius: 50%;
        border-top-color: var(--primary);
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 1rem;
    }
    
    .no-comments {
        background-color: rgba(0, 0, 0, 0.2);
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        color: var(--text-light);
    }
    
    .comments-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .comment {
        display: flex;
        gap: 1rem;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 1.5rem;
        border-radius: 8px;
    }
    
    .comment-avatar {
        flex-shrink: 0;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        overflow: hidden;
    }
    
    .comment-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .avatar-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--primary);
        color: var(--dark);
        font-weight: 600;
        font-size: 1rem;
    }
    
    .comment-content {
        flex-grow: 1;
    }
    
    .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    
    .comment-author {
        margin: 0;
        font-size: 1rem;
        color: var(--text);
    }
    
    .comment-date {
        font-size: 0.8rem;
        color: var(--text-light);
    }
    
    .comment-text {
        margin-bottom: 1rem;
        line-height: 1.5;
        color: var(--text);
    }
    
    .comment-actions {
        display: flex;
        justify-content: flex-end;
    }
    
    .like-button {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        background: none;
        border: none;
        color: var(--text-light);
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .like-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--primary);
    }
    
    .like-button i {
        font-size: 1rem;
    }
    
    .add-comment {
        margin-top: 2rem;
    }
    
    .add-comment-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 auto;
    }
    
    .comment-form {
        background-color: rgba(0, 0, 0, 0.2);
        padding: 1.5rem;
        border-radius: 8px;
    }
    
    .comment-form h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        color: var(--text);
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text);
        font-family: inherit;
        font-size: 1rem;
        resize: vertical;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary);
    }
    
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }
    
    .error-message {
        background-color: rgba(231, 76, 60, 0.2);
        color: #e74c3c;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }
    
    .spinner {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-right: 0.5rem;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .comment {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .comment-avatar {
            width: 2.5rem;
            height: 2.5rem;
        }
        
        .comment-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
        }
        
        .form-actions {
            flex-direction: column;
        }
    }
</style>

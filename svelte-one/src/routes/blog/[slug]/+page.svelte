<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
	export let data;
	const { post } = data;
</script>

<svelte:head>
	<title>Lauftraining Blog | Expertentipps | LaufPlaner Pro</title>
	<meta
		name="description"
		content="Lauftipps, Trainingspläne und Expertenwissen rund ums Laufen - von Anfängern bis Profis. Entdecke unsere Artikel zum Thema Lauftraining."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Lauftraining Blog | LaufPlaner Pro" />
	<meta
		property="og:description"
		content="Expertenwissen, Trainingstipps und Erfolgsgeschichten für dein optimales Lauftraining."
	/>
	<meta property="og:url" content="https://laufplanerpro.de/blog" />
	<link rel="canonical" href="https://laufplanerpro.de/blog" />
</svelte:head>

<article class="blog-post">
	<div class="container">
		<div class="post-header">
			<div class="post-meta">
				<span class="post-category">{post.category || 'Lauftraining'}</span>
				<span class="post-date"
					>{new Date(post.date).toLocaleDateString('de-DE', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}</span
				>
			</div>
			<h1 class="post-title">{post.title}</h1>
			<p class="post-excerpt">{post.excerpt}</p>
			<div class="post-info">
				<div class="author-info">
					{#if post.author}
						<div class="author-name">Von {post.author}</div>
					{/if}
					<div class="reading-time">{post.readingTime}</div>
				</div>
				<div class="social-share">
					<a
						href={`https://x.com/intent/tweet?url=https://laufplanerpro.de/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
						target="_blank"
						rel="noopener noreferrer"
						class="share-button"
						aria-label="Auf X (Twitter) teilen"
					>
						<i class="fab fa-twitter"></i>
					</a>
					<a
						href={`https://www.facebook.com/sharer/sharer.php?u=https://laufplanerpro.de/blog/${post.slug}`}
						target="_blank"
						rel="noopener noreferrer"
						class="share-button"
						aria-label="Auf Facebook teilen"
					>
						<i class="fab fa-facebook-f"></i>
					</a>
				</div>
			</div>
		</div>

		{#if post.featuredImage}
			<div class="featured-image">
				<figure>
					<img
						src={post.featuredImage}
						alt={post.title}
						loading="eager"
						width="1200"
						height="600"
					/>
					{#if post.imageCaption}
						<figcaption>{post.imageCaption}</figcaption>
					{/if}
				</figure>
			</div>
		{/if}

		<div class="post-content">
			{#if post.htmlContent}
				{@html post.htmlContent}
			{:else}
				<p>Dieser Beitrag hat keinen Inhalt.</p>
			{/if}
		</div>

		<div class="post-footer">
			<div class="post-tags">
				{#if post.tags && post.tags.length > 0}
					<span class="tags-title">Themen:</span>
					{#each post.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				{/if}
			</div>

			<div class="post-navigation">
				<a href="/blog" class="back-to-blog">← Zurück zur Blog-Übersicht</a>
			</div>
		</div>
	</div>
</article>

<section class="related-posts">
	<div class="container">
		<h2 class="section-title">Das könnte dich auch interessieren</h2>

		{#if data.relatedPosts && data.relatedPosts.length > 0}
			<div class="related-posts-grid">
				{#each data.relatedPosts as relatedPost}
					<div class="related-post-card">
						{#if relatedPost.featuredImage}
							<img
								src={relatedPost.featuredImage}
								alt={relatedPost.title}
								class="related-post-image"
								loading="lazy"
								width="300"
								height="180"
							/>
						{/if}
						<div class="related-post-content">
							<h3 class="related-post-title">
								<a href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</a>
							</h3>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="no-related-posts">Noch keine verwandten Beiträge verfügbar.</p>
		{/if}
	</div>
</section>

<style>
	/* Füge diese Regel hinzu */
	.featured-image figure {
		margin: 0;
		width: 100%;
	}

	/* Rest des CSS bleibt unverändert */
	.blog-post {
		padding: 5rem 0;
		background-color: var(--dark-gray);
	}

	.container {
		max-width: 850px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.post-header {
		margin-bottom: 2.5rem;
		text-align: center;
	}

	.post-meta {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	.post-category {
		color: var(--primary);
		font-weight: 600;
	}

	.post-date {
		color: var(--text-gray);
	}

	.post-title {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		color: white;
	}

	.post-excerpt {
		color: var(--text-gray);
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
	}

	.post-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--dark);
		border-bottom: 1px solid var(--dark);
		padding: 1rem 0;
	}

	.author-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--text-gray);
	}

	.author-name {
		font-weight: 500;
	}

	.reading-time {
		font-size: 0.85rem;
	}

	.social-share {
		display: flex;
		gap: 0.75rem;
	}

	.share-button {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: var(--dark);
		color: white;
		transition: all 0.3s ease;
	}

	.share-button:hover {
		background-color: var(--primary);
		color: var(--dark);
		transform: translateY(-3px);
	}

	.featured-image {
		margin-bottom: 2rem;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.featured-image img {
		width: 100%;
		height: auto;
		display: block;
	}

	.featured-image figcaption {
		padding: 0.75rem;
		text-align: center;
		font-size: 0.85rem;
		color: var(--text-gray);
		background-color: var(--dark);
	}

	.post-content {
		color: #d0d0d0;
		line-height: 1.8;
		font-size: 1.1rem;
	}

	.post-content :global(h2) {
		color: white;
		margin: 2rem 0 1rem;
	}

	.post-content p {
		margin-bottom: 1.5rem;
	}

	.post-content :global(a) {
		color: var(--primary);
		text-decoration: underline;
	}

	.post-content :global(ul),
	.post-content :global(ol) {
		margin: 1.5rem 0;
		padding-left: 1.5rem;
	}

	.post-footer {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--dark);
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.tags-title {
		color: var(--text-gray);
	}

	.tag {
		background-color: var(--dark);
		color: var(--primary);
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.85rem;
	}

	.post-navigation {
		display: flex;
		justify-content: center;
	}

	.back-to-blog {
		color: var(--primary);
		text-decoration: none;
		transition: all 0.3s ease;
		font-weight: 600;
	}

	.back-to-blog:hover {
		transform: translateX(-5px);
	}

	.related-posts {
		padding: 5rem 0;
		background-color: var(--dark);
	}

	.section-title {
		text-align: center;
		color: white;
		margin-bottom: 3rem;
		font-size: 2rem;
	}

	.related-posts-grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.related-posts-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.related-post-card {
		background-color: var(--dark-gray);
		border-radius: 0.5rem;
		overflow: hidden;
		transition: transform 0.3s ease;
	}

	.related-post-card:hover {
		transform: translateY(-5px);
	}

	.related-post-image {
		width: 100%;
		height: 160px;
		object-fit: cover;
	}

	.related-post-content {
		padding: 1rem;
	}

	.related-post-title {
		font-size: 1rem;
		margin: 0;
	}

	.related-post-title a {
		color: white;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.related-post-title a:hover {
		color: var(--primary);
	}

	.no-related-posts {
		text-align: center;
		color: var(--text-gray);
	}
</style>

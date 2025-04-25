<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	export let data;
	const { post, relatedPosts } = data;

	// SEO: Strukturierte Daten als JSON-LD
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		image: post.featuredImage,
		datePublished: post.date,
		dateModified: post.lastUpdated || post.date,
		publisher: {
			'@type': 'Organization',
			name: 'LaufPlaner Pro',
			logo: {
				'@type': 'ImageObject',
				url: 'https://laufplanerpro.de/images/logo.png'
			}
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://laufplanerpro.de/blog/${post.slug}`
		}
	};

	// Native Web Share API für modernen "Teilen"-Button
	let canUseShareAPI = false;
	onMount(() => {
		canUseShareAPI = typeof navigator !== 'undefined' && navigator.share !== undefined;
	});

	function handleShare() {
		if (canUseShareAPI) {
			navigator.share({
				title: post.title,
				text: post.excerpt,
				url: `https://laufplanerpro.de/blog/${post.slug}`
			});
		}
	}
</script>

<svelte:head>
	<!-- Dynamischer Titel mit Post-Titel -->
	<title>{post.title} | Lauftraining Blog | LaufPlaner Pro</title>

	<!-- SEO: Meta-Beschreibung -->
	<meta name="description" content={post.excerpt} />

	<!-- SEO: Kanonische URL mit Post-Slug -->
	<link rel="canonical" href={`https://laufplanerpro.de/blog/${post.slug}`} />

	<!-- SEO: Meta-Keywords basierend auf Tags -->
	{#if post.tags && post.tags.length > 0}
		<meta name="keywords" content={post.tags.join(', ')} />
	{/if}

	<!-- SEO: Open Graph Tags -->
	<meta property="og:type" content="article" />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.excerpt} />
	<meta property="og:url" content={`https://laufplanerpro.de/blog/${post.slug}`} />
	{#if post.featuredImage}
		<meta property="og:image" content={post.featuredImage} />
	{/if}
	<meta property="article:published_time" content={post.date} />
	{#if post.tags}
		{#each post.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- SEO: Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.excerpt} />
	{#if post.featuredImage}
		<meta name="twitter:image" content={post.featuredImage} />
	{/if}

	<!-- SEO: Strukturierte Daten -->
	<script type="application/ld+json">
{JSON.stringify(jsonLd)}
	</script>
</svelte:head>

<article class="blog-post" itemscope itemtype="https://schema.org/BlogPosting">
	<!-- Featured Image Hero -->
	{#if post.featuredImage}
		<div class="featured-hero">
			<div class="featured-gradient"></div>
			<img
				src={post.featuredImage}
				alt={post.title}
				loading="eager"
				fetchpriority="high"
				decoding="sync"
				class="featured-image-hero"
				width="1920"
				height="800"
				itemprop="image"
			/>
			<div class="hero-content container">
				<!-- Post Category -->
				<div class="post-category-badge" itemprop="articleSection">
					{post.category || 'Lauftraining'}
				</div>

				<!-- Post Title -->
				<h1 class="hero-title" itemprop="headline">{post.title}</h1>

				<!-- Date and Reading Time -->
				<div class="post-meta">
					<time class="post-date" itemprop="datePublished" datetime={post.date}>
						{new Date(post.date).toLocaleDateString('de-DE', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</time>
					<div class="meta-divider">•</div>
					<div class="reading-time">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="icon"
							><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"
							></polyline></svg
						>
						{post.readingTime}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="content-wrapper">
		<div class="container">
			<div class="post-layout">
				<!-- Main Content -->
				<div class="post-main">
					{#if !post.featuredImage}
						<!-- Fallback Post Header when no featured image -->
						<div class="post-header">
							<div class="post-category" itemprop="articleSection">
								{post.category || 'Lauftraining'}
							</div>
							<h1 class="post-title" itemprop="headline">{post.title}</h1>
							<div class="post-meta">
								<time class="post-date" itemprop="datePublished" datetime={post.date}>
									{new Date(post.date).toLocaleDateString('de-DE', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</time>
								<span class="meta-divider">•</span>
								<span class="reading-time">{post.readingTime}</span>
							</div>
						</div>
					{/if}

					<!-- Post Excerpt as Intro -->
					<div class="post-excerpt" itemprop="description">
						{post.excerpt}
					</div>

					<!-- Post Content -->
					<div class="post-content" itemprop="articleBody">
						{#if post.htmlContent}
							{@html post.htmlContent}
						{:else}
							<p>Dieser Beitrag hat keinen Inhalt.</p>
						{/if}
					</div>

					<!-- Tags -->
					{#if post.tags && post.tags.length > 0}
						<div class="post-tags">
							<h3>Themen</h3>
							<div class="tags-list">
								{#each post.tags as tag}
									<a href={`/blog/tag/${tag.toLowerCase().replace(' ', '-')}`} class="tag">
										{tag}
									</a>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Post Navigation -->
					<div class="post-navigation">
						<a href="/blog" class="back-to-blog">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"
								></polyline></svg
							>
							Zurück zur Blog-Übersicht
						</a>
					</div>
				</div>

				<!-- Sidebar -->
				<div class="post-sidebar">
					<!-- Sticky Share Buttons -->
					<div class="share-container">
						<h3 class="share-title">Teilen</h3>
						<div class="share-buttons">
							<!-- Facebook -->
							<a
								href={`https://www.facebook.com/sharer/sharer.php?u=https://laufplanerpro.de/blog/${post.slug}`}
								target="_blank"
								rel="noopener noreferrer"
								class="share-button facebook"
								aria-label="Auf Facebook teilen"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
									><path
										d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"
									/></svg
								>
							</a>

							<!-- Twitter/X -->
							<a
								href={`https://x.com/intent/tweet?url=https://laufplanerpro.de/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
								target="_blank"
								rel="noopener noreferrer"
								class="share-button twitter"
								aria-label="Auf X (Twitter) teilen"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
									><path
										d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
									/></svg
								>
							</a>

							<!-- LinkedIn -->
							<a
								href={`https://www.linkedin.com/shareArticle?mini=true&url=https://laufplanerpro.de/blog/${post.slug}&title=${encodeURIComponent(post.title)}`}
								target="_blank"
								rel="noopener noreferrer"
								class="share-button linkedin"
								aria-label="Auf LinkedIn teilen"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
									><path
										d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
									/></svg
								>
							</a>

							<!-- WhatsApp (Mobile-freundlich) -->
							<a
								href={`whatsapp://send?text=${encodeURIComponent(post.title + ' https://laufplanerpro.de/blog/' + post.slug)}`}
								class="share-button whatsapp"
								aria-label="Auf WhatsApp teilen"
								data-action="share/whatsapp/share"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
									><path
										d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
									/></svg
								>
							</a>

							<!-- Web Share API fallback -->
							{#if canUseShareAPI}
								<button
									on:click={handleShare}
									class="share-button native-share"
									aria-label="Teilen"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"
										></circle><circle cx="18" cy="19" r="3"></circle><line
											x1="8.59"
											y1="13.51"
											x2="15.42"
											y2="17.49"
										></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg
									>
								</button>
							{/if}
						</div>
					</div>

					<!-- Table of Contents (Auto-generated from H2s) -->
					<div class="toc-container">
						<h3 class="toc-title">Inhaltsverzeichnis</h3>
						<div class="toc">
							<ul class="toc-list">
								<li><a href="#section1">Training starten</a></li>
								<li><a href="#section2">Ernährungstipps</a></li>
								<li><a href="#section3">Regeneration</a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</article>

<!-- Related Posts Section -->
<section class="related-posts">
	<div class="container">
		<h2 class="section-title">Das könnte dich auch interessieren</h2>

		{#if relatedPosts && relatedPosts.length > 0}
			<div class="related-posts-grid">
				{#each relatedPosts as relatedPost}
					<div class="related-post-card">
						{#if relatedPost.featuredImage}
							<a href={`/blog/${relatedPost.slug}`} class="related-post-image-link">
								<img
									src={relatedPost.featuredImage}
									alt={relatedPost.title}
									class="related-post-image"
									loading="lazy"
									width="300"
									height="180"
								/>
							</a>
						{/if}
						<div class="related-post-content">
							<div class="related-post-meta">
								<span class="related-post-category">{relatedPost.category || 'Lauftraining'}</span>
								<span class="related-post-date">
									{new Date(relatedPost.date).toLocaleDateString('de-DE', {
										year: 'numeric',
										month: 'short',
										day: 'numeric'
									})}
								</span>
							</div>
							<h3 class="related-post-title">
								<a href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</a>
							</h3>
							<p class="related-post-excerpt">{relatedPost.excerpt?.substring(0, 80)}...</p>
							<a href={`/blog/${relatedPost.slug}`} class="read-more">Weiterlesen</a>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="no-related-posts">Noch keine verwandten Beiträge verfügbar.</p>

			<!-- CTA zum Blog gehen -->
			<div class="blog-cta">
				<a href="/blog" class="btn-primary">Alle Artikel durchsuchen</a>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Modern Blog Post Styling */

	/* Hero Section */
	.featured-hero {
		position: relative;
		height: 60vh;
		min-height: 400px;
		max-height: 600px;
		overflow: hidden;
		margin-top: -4rem; /* Adjust for navigation */
	}

	.featured-gradient {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(18, 18, 18, 0.8) 100%);
		z-index: 1;
	}

	.featured-image-hero {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.hero-content {
		position: absolute;
		bottom: 2rem;
		left: 0;
		right: 0;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.post-category-badge {
		background: var(--primary);
		color: var(--dark);
		padding: 0.25rem 1rem;
		border-radius: 20px;
		font-weight: 600;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.hero-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: white;
		margin-bottom: 1rem;
		max-width: 800px;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.post-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: #ccc;
	}

	.meta-divider {
		color: var(--primary);
	}

	.reading-time {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.reading-time .icon {
		color: var(--primary);
	}

	/* Content Layout */
	.content-wrapper {
		background-color: var(--dark-gray);
		padding: 3rem 0 5rem;
	}

	.post-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 992px) {
		.post-layout {
			grid-template-columns: 2fr 1fr;
		}
	}

	/* Main Content Styling */
	.post-main {
		background-color: var(--dark);
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.post-header {
		margin-bottom: 2rem;
	}

	.post-title {
		font-size: 2.25rem;
		margin: 0.5rem 0;
		color: white;
	}

	.post-excerpt {
		font-size: 1.25rem;
		line-height: 1.6;
		color: #a0a0a0;
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		font-style: italic;
	}

	.post-content {
		color: #d0d0d0;
		line-height: 1.8;
		font-size: 1.1rem;
	}

	.post-content :global(h2) {
		font-size: 1.75rem;
		color: white;
		margin: 2.5rem 0 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.post-content :global(h3) {
		font-size: 1.4rem;
		color: white;
		margin: 2rem 0 1rem;
	}

	.post-content :global(p) {
		margin-bottom: 1.5rem;
	}

	.post-content :global(a) {
		color: var(--primary);
		text-decoration: underline;
		transition: color 0.2s ease;
	}

	.post-content :global(a:hover) {
		color: #4ddeff;
	}

	.post-content :global(ul),
	.post-content :global(ol) {
		margin: 1.5rem 0;
		padding-left: 1.5rem;
	}

	.post-content :global(blockquote) {
		border-left: 4px solid var(--primary);
		padding-left: 1.5rem;
		margin-left: 0;
		font-style: italic;
		color: #a0a0a0;
	}

	.post-content :global(img) {
		max-width: 100%;
		border-radius: 8px;
		margin: 2rem 0;
	}

	.post-content :global(pre) {
		background-color: var(--dark-gray);
		padding: 1rem;
		border-radius: 5px;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	/* Tags */
	.post-tags {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.post-tags h3 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: white;
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.tag {
		background-color: rgba(0, 242, 254, 0.15);
		color: var(--primary);
		padding: 0.4rem 1rem;
		border-radius: 20px;
		font-size: 0.85rem;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.tag:hover {
		background-color: rgba(0, 242, 254, 0.25);
		transform: translateY(-2px);
	}

	/* Post Navigation */
	.post-navigation {
		margin-top: 3rem;
		display: flex;
		justify-content: center;
	}

	.back-to-blog {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--primary);
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1rem;
		transition: transform 0.3s ease;
	}

	.back-to-blog:hover {
		transform: translateX(-5px);
	}

	/* Sidebar */
	.post-sidebar > div {
		background-color: var(--dark);
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.post-sidebar h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		color: white;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding-bottom: 0.5rem;
	}

	/* Share Buttons */
	.share-buttons {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.share-button {
		width: 42px;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: white;
		transition: all 0.3s ease;
	}

	.share-button:hover {
		transform: translateY(-3px);
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
	}

	.facebook {
		background-color: #3b5998;
	}

	.twitter {
		background-color: #1da1f2;
	}

	.linkedin {
		background-color: #0077b5;
	}

	.whatsapp {
		background-color: #25d366;
	}

	.native-share {
		background-color: var(--primary);
		border: none;
		cursor: pointer;
	}

	/* Table of Contents */
	.toc-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.toc-list li {
		margin-bottom: 0.75rem;
	}

	.toc-list a {
		color: #a0a0a0;
		text-decoration: none;
		transition: all 0.2s ease;
		display: block;
		padding: 0.5rem;
		border-left: 2px solid transparent;
	}

	.toc-list a:hover {
		color: var(--primary);
		background-color: rgba(255, 255, 255, 0.05);
		border-left: 2px solid var(--primary);
		padding-left: 0.75rem;
	}

	/* Related Posts Section */
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
		gap: 2rem;
	}

	@media (min-width: 640px) {
		.related-posts-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 992px) {
		.related-posts-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.related-post-card {
		background-color: var(--dark-gray);
		border-radius: 8px;
		overflow: hidden;
		transition: transform 0.3s ease;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.related-post-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}

	.related-post-image-link {
		display: block;
		overflow: hidden;
	}

	.related-post-image {
		width: 100%;
		height: 180px;
		object-fit: cover;
		transition: transform 0.5s ease;
	}

	.related-post-card:hover .related-post-image {
		transform: scale(1.05);
	}

	.related-post-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.related-post-meta {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.75rem;
		font-size: 0.8rem;
	}

	.related-post-category {
		color: var(--primary);
		font-weight: 600;
	}

	.related-post-date {
		color: #a0a0a0;
	}

	.related-post-title {
		font-size: 1.2rem;
		margin-bottom: 0.75rem;
	}

	.related-post-title a {
		color: white;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.related-post-title a:hover {
		color: var(--primary);
	}

	.related-post-excerpt {
		color: #a0a0a0;
		font-size: 0.9rem;
		margin-bottom: 1.25rem;
		flex-grow: 1;
	}

	.read-more {
		color: var(--primary);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.9rem;
		margin-top: auto;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.read-more::after {
		content: '→';
		transition: transform 0.3s ease;
		display: inline-block;
		margin-left: 0.25rem;
	}

	.read-more:hover::after {
		transform: translateX(3px);
	}

	.no-related-posts {
		text-align: center;
		color: #a0a0a0;
		margin-bottom: 2rem;
	}

	.blog-cta {
		text-align: center;
		margin-top: 2rem;
	}

	.btn-primary {
		display: inline-block;
		background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
		color: var(--dark);
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(0, 242, 254, 0.3);
	}

	/* Responsive Adjustments */
	@media (max-width: 768px) {
		.hero-title {
			font-size: 2rem;
		}

		.post-meta {
			flex-direction: column;
			align-items: center;
			gap: 0.75rem;
		}

		.meta-divider {
			display: none;
		}

		.post-content :global(h2) {
			font-size: 1.5rem;
		}
	}
</style>

<!-- src/routes/blog/+page.svelte -->
<script>
	export let data;
	const { posts } = data;
</script>

<svelte:head>
	<title>Blog | LaufPlaner Pro</title>
	<meta
		name="description"
		content="Laufexpertise, Trainingstipps und Erfolgsgeschichten im LaufPlaner Pro Blog"
	/>
</svelte:head>

<section class="blog-hero">
	<div class="container">
		<h1>Laufwissen & Trainingstipps</h1>
		<p class="blog-subtitle">
			Expertenwissen, Erfolgsgeschichten und wissenschaftlich fundierte Tipps für dein optimales
			Lauftraining.
		</p>
	</div>
</section>

<section class="blog-posts">
	<div class="container">
		<div class="posts-grid">
			{#each posts as post}
				<article class="post-card">
					{#if post.featuredImage}
						<img
							src={post.featuredImage}
							alt={post.title}
							class="post-image"
							loading="lazy"
							width="800"
							height="500"
						/>
					{/if}
					<div class="post-content">
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
						<h2 class="post-title">
							<a href={`/blog/${post.slug}`}>{post.title}</a>
						</h2>
						<p class="post-excerpt">{post.excerpt}</p>
						<div class="post-footer">
							<span class="reading-time">{post.readingTime}</span>
							<a href={`/blog/${post.slug}`} class="read-more"
								>Weiterlesen <span aria-hidden="true">→</span></a
							>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.blog-hero {
		background-color: var(--dark);
		padding: 5rem 0 3rem;
		text-align: center;
	}

	.blog-hero h1 {
		color: white;
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.blog-subtitle {
		color: var(--text-gray);
		font-size: 1.25rem;
		max-width: 42rem;
		margin: 0 auto;
	}

	.blog-posts {
		padding: 5rem 0;
		background-color: var(--dark-gray);
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 2rem;
	}

	@media (min-width: 768px) {
		.posts-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.posts-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.post-card {
		background-color: var(--dark);
		border-radius: 0.5rem;
		overflow: hidden;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.post-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}

	.post-image {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.post-content {
		padding: 1.5rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.post-meta {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.75rem;
		font-size: 0.85rem;
	}

	.post-category {
		color: var(--primary);
		font-weight: 600;
	}

	.post-date {
		color: var(--text-gray);
	}

	.post-title {
		font-size: 1.35rem;
		margin-bottom: 1rem;
	}

	.post-title a {
		color: white;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.post-title a:hover {
		color: var(--primary);
	}

	.post-excerpt {
		color: var(--text-gray);
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.post-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
	}

	.reading-time {
		color: var(--text-gray);
		font-size: 0.85rem;
	}

	.read-more {
		color: var(--primary);
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.read-more:hover {
		transform: translateX(3px);
	}
</style>

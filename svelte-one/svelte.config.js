import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Use Cloudflare adapter for Cloudflare Pages deployment
		adapter: adapter(),
		prerender: {
			handleMissingId: 'warn',
			handleHttpError: 'warn'
		}
	}
};

export default config;

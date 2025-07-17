<script lang="ts">
	import { supabase } from '$lib/supabase';

	let testResults = '';
	let loading = false;

	async function testDemoLogin() {
		loading = true;
		testResults = 'Testing demo login...\n';

		try {
			// First, try to sign up the demo user (in case it doesn't exist)
			const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
				email: 'demo@example.com',
				password: 'demo123',
				options: {
					data: { name: 'Demo User' }
				}
			});

			testResults += `Sign up attempt: ${signUpError ? signUpError.message : 'Success or user already exists'}\n`;

			// Now try to sign in
			const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
				email: 'demo@example.com',
				password: 'demo123'
			});

			testResults += `Sign in attempt: ${signInError ? signInError.message : 'Success!'}\n`;

			if (signInData.user) {
				testResults += `User authenticated: ${JSON.stringify(signInData.user, null, 2)}\n`;
			}
		} catch (error) {
			testResults += `Error: ${error}\n`;
		}

		loading = false;
	}

	async function testSupabaseConnection() {
		loading = true;
		testResults = 'Testing Supabase connection...\n';

		try {
			const { data, error } = await supabase.from('athletes').select('count').limit(1);
			testResults += `Database connection: ${error ? error.message : 'Success!'}\n`;
		} catch (error) {
			testResults += `Connection error: ${error}\n`;
		}

		loading = false;
	}
</script>

<h1>Authentication Test Page</h1>

<div>
	<button on:click={testSupabaseConnection} disabled={loading}> Test Supabase Connection </button>

	<button on:click={testDemoLogin} disabled={loading}> Test Demo Login </button>
</div>

{#if testResults}
	<pre style="background: #f5f5f5; padding: 1rem; margin-top: 1rem; border-radius: 4px;">
		{testResults}
	</pre>
{/if}

<style>
	button {
		background: #007acc;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		margin: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>

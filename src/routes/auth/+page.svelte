<!-- LaufplanerPro - Professional Athlete Application System -->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase';
	import { en } from '$lib/i18n/en';

	// Use English language pack
	const t = en;

	let currentStep = 'login'; // 'login', 'apply', 'submitted'
	let email = '';
	let password = '';
	let loading = false;
	let error = '';
	let success = '';
	let mounted = false;

	// Application form data
	interface ApplicationData {
		[key: string]: string | string[];
		// Personal Info
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		birthDate: string;
		gender: string;
		location: string;

		// Athletic Background
		experience: string; // years
		primaryDiscipline: string; // triathlon, running, cycling, swimming
		currentLevel: string; // beginner, amateur, competitive, elite
		weeklyTrainingHours: string;

		// Performance Data
		bestMarathonTime: string;
		bestHalfMarathonTime: string;
		best10kTime: string;
		best5kTime: string;
		bestIronmanTime: string;
		bestOlympicTriTime: string;
		bestSprintTriTime: string;

		// Physiological Data
		restingHR: string;
		maxHR: string;
		ftp: string; // watts
		ltHR: string; // lactate threshold HR
		vo2Max: string;
		weight: string;
		height: string;
		bodyFat: string;

		// Swimming Data
		best50mFree: string;
		best100mFree: string;
		best1500mFree: string;
		swimCSS: string; // Critical Swim Speed

		// Goals & Motivation
		goals2025: string;
		targetRaces: string;
		motivation: string;
		expectations: string;

		// Equipment & Technology
		devices: string[]; // garmin, wahoo, polar, strava, etc.
		trainingApps: string[];
		equipment: string; // bike type, wetsuit, etc.

		// Additional Info
		injuries: string;
		medications: string;
		coach: string;
		teamClub: string;
		socialMedia: string;
		referralSource: string;
		additionalInfo: string;
	}

	let applicationData: ApplicationData = {
		// Personal Info
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		birthDate: '',
		gender: '',
		location: '',

		// Athletic Background
		experience: '', // years
		primaryDiscipline: '', // triathlon, running, cycling, swimming
		currentLevel: '', // beginner, amateur, competitive, elite
		weeklyTrainingHours: '',

		// Performance Data
		bestMarathonTime: '',
		bestHalfMarathonTime: '',
		best10kTime: '',
		best5kTime: '',
		bestIronmanTime: '',
		bestOlympicTriTime: '',
		bestSprintTriTime: '',

		// Physiological Data
		restingHR: '',
		maxHR: '',
		ftp: '', // watts
		ltHR: '', // lactate threshold HR
		vo2Max: '',
		weight: '',
		height: '',
		bodyFat: '',

		// Swimming Data
		best50mFree: '',
		best100mFree: '',
		best1500mFree: '',
		swimCSS: '', // Critical Swim Speed

		// Goals & Motivation
		goals2025: '',
		targetRaces: '',
		motivation: '',
		expectations: '',

		// Equipment & Technology
		devices: [], // garmin, wahoo, polar, strava, etc.
		trainingApps: [],
		equipment: '', // bike type, wetsuit, etc.

		// Additional Info
		injuries: '',
		medications: '',
		coach: '',
		teamClub: '',
		socialMedia: '',
		referralSource: '',
		additionalInfo: ''
	};

	onMount(() => {
		mounted = true;

		// Check URL parameters for demo mode
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('mode') === 'demo') {
			email = 'demo@laufplanerpro.de';
			password = 'Demo123!';
		}

		// Redirect if already authenticated (browser only)
		if (typeof window !== 'undefined') {
			supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
				if (user) {
					goto('/dashboard');
				}
			});
		}
	});

	function showApplicationForm() {
		currentStep = 'apply';
		error = '';
		success = '';
	}

	function backToLogin() {
		currentStep = 'login';
		error = '';
		success = '';
	}

	function fillDemoCredentials() {
		email = 'demo@laufplanerpro.de';
		password = 'Demo123!';
		error = '';
		success = 'Demo credentials loaded! Click "Neural Login" to proceed.';
	}

	async function handleLogin() {
		loading = true;
		error = '';
		success = '';

		try {
			// Check for demo credentials
			if (email === 'demo@laufplanerpro.de' && password === 'Demo123!') {
				// Handle demo login - use real Supabase auth
				const { data, error: demoError } = await supabase.auth.signInWithPassword({
					email: 'demo@laufplanerpro.de',
					password: 'Demo123!'
				});

				if (demoError) {
					error = 'Demo login failed: ' + demoError.message;
					return;
				}

				if (data.user) {
					// Set localStorage for compatibility with other pages
					localStorage.setItem('authToken', data.session?.access_token || 'supabase_session');
					localStorage.setItem('user', JSON.stringify({
						email: data.user.email,
						name: data.user.user_metadata?.name || 'Alex Mueller',
						id: data.user.id
					}));
					localStorage.setItem('demoMode', 'true');

					success = 'Demo access granted! Loading dashboard...';

					setTimeout(() => {
						goto('/dashboard');
					}, 1500);
				}
				
				loading = false;
				return;
			}

			// Regular Supabase login for real users
			const { data, error: loginError } = await supabase.auth.signInWithPassword({
				email: email,
				password: password
			});

			if (loginError) {
				error = loginError.message;
				return;
			}

			if (data.user) {
				// Set localStorage for compatibility with other pages
				localStorage.setItem('authToken', data.session?.access_token || 'supabase_session');
				localStorage.setItem('user', JSON.stringify({
					email: data.user.email,
					name: data.user.user_metadata?.name || data.user.email,
					id: data.user.id
				}));
				
				success = 'Login successful! Redirecting...';
				setTimeout(() => {
					goto('/dashboard');
				}, 1000);
			}
		} catch (e) {
			console.error('Login error:', e);
			error = 'An unexpected error occurred.';
		} finally {
			loading = false;
		}
	}

	async function submitApplication() {
		loading = true;
		error = '';
		success = '';

		// Validate required fields
		const requiredFields = [
			'firstName',
			'lastName',
			'email',
			'phone',
			'birthDate',
			'experience',
			'primaryDiscipline',
			'currentLevel',
			'goals2025',
			'motivation'
		];

		for (const field of requiredFields) {
			if (!applicationData[field]) {
				error = 'Bitte alle Pflichtfelder ausfüllen.';
				loading = false;
				return;
			}
		}

		try {
			// Submit application to API
			const response = await fetch('/api/applications', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(applicationData)
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || 'Error submitting application.';
				return;
			}

			if (result.success) {
				currentStep = 'submitted';
				success = 'Application submitted successfully!';

				// Store application ID for reference
				localStorage.setItem('applicationId', result.applicationId);
			} else {
				error = result.error || 'Unknown error occurred.';
			}
		} catch (e) {
			console.error('Application submission error:', e);
			error = 'Network error. Please check your internet connection.';
		} finally {
			loading = false;
		}
	}

	// Handle device selection
	function toggleDevice(device: string) {
		if (applicationData.devices.includes(device)) {
			applicationData.devices = applicationData.devices.filter((d) => d !== device);
		} else {
			applicationData.devices = [...applicationData.devices, device];
		}
	}

	// Handle training app selection
	function toggleApp(app: string) {
		if (applicationData.trainingApps.includes(app)) {
			applicationData.trainingApps = applicationData.trainingApps.filter((a) => a !== app);
		} else {
			applicationData.trainingApps = [...applicationData.trainingApps, app];
		}
	}
</script>

<svelte:head>
	<title>LaufplanerPro - Elite Athlete Application</title>
	<meta name="description" content="Professional triathlon training platform application" />
</svelte:head>

<div class="auth-container">
	<!-- Neural Background Pattern -->
	<div class="neural-bg"></div>

	<!-- Header -->
	<header class="auth-header">
		<div class="logo">
			<div class="icon-neural"></div>
			<span class="logo-text">LaufplanerPro</span>
		</div>
		<p class="subtitle">Elite Training Platform</p>
	</header>

	<!-- Main Content -->
	<main class="auth-main">
		{#if currentStep === 'login'}		<!-- Login Form -->
		<div class="auth-card">
			<div class="auth-form-header">
				<h1>Member Login</h1>
				<p class="form-subtitle">Access for approved athletes</p>
			</div>

			{#if error}
				<div class="alert error">
					<span class="alert-icon">⚠️</span>
					{error}
				</div>
			{/if}

			{#if success}
				<div class="alert success">
					<span class="alert-icon">✅</span>
					{success}
				</div>
			{/if}

			<form on:submit|preventDefault={handleLogin} class="auth-form">
				<div class="form-group">
					<label for="email">Email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="your.email@domain.com"
						required
						disabled={loading}
					/>
				</div>

				<div class="form-group">
					<label for="password">Password</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="••••••••"
						required
						disabled={loading}
					/>
				</div>

				<button type="submit" class="btn-primary" disabled={loading}>
					{loading ? 'Signing in...' : 'Sign In'}
				</button>
			</form>

			<div class="auth-divider">
				<span>or</span>
			</div>

			<button on:click={fillDemoCredentials} class="btn-demo" disabled={loading}>
				🚀 Demo Neural Access
			</button>

			<div class="auth-footer">
				<p>Not a member yet?</p>
				<button on:click={showApplicationForm} class="btn-link">
					Apply for access now →
				</button>
			</div>
		</div>
		{:else if currentStep === 'apply'}		<!-- Application Form -->
		<div class="application-card">
			<div class="application-header">
				<button on:click={backToLogin} class="back-btn">← Back</button>
				<div>
					<h1>LaufplanerPro Application</h1>
					<p class="form-subtitle">Elite Triathlon Training Platform</p>
				</div>
			</div>

			{#if error}
				<div class="alert error">
					<span class="alert-icon">⚠️</span>
					{error}
				</div>
			{/if}

			<form on:submit|preventDefault={submitApplication} class="application-form">
				<!-- Personal Information -->
				<section class="form-section">
					<h2>👤 Personal Information</h2>
					<div class="form-row">
						<div class="form-group">
							<label for="firstName">First Name *</label>
							<input id="firstName" type="text" bind:value={applicationData.firstName} required />
						</div>
						<div class="form-group">
							<label for="lastName">Last Name *</label>
							<input id="lastName" type="text" bind:value={applicationData.lastName} required />
						</div>
						</div>
						<div class="form-row">						<div class="form-group">
							<label for="email">Email *</label>
							<input id="email" type="email" bind:value={applicationData.email} required />
						</div>
						<div class="form-group">
							<label for="phone">Phone</label>
							<input id="phone" type="tel" bind:value={applicationData.phone} />
						</div>
						</div>
						<div class="form-row">						<div class="form-group">
							<label for="birthDate">Date of Birth *</label>
							<input id="birthDate" type="date" bind:value={applicationData.birthDate} required />
						</div>
						<div class="form-group">
							<label for="gender">Gender</label>
							<select id="gender" bind:value={applicationData.gender}>
								<option value="">Please select</option>
								<option value="m">Male</option>
								<option value="w">Female</option>
								<option value="d">Other</option>
							</select>
						</div>
						</div>					<div class="form-group">
						<label for="location">Location</label>
						<input
							id="location"
							type="text"
							bind:value={applicationData.location}
							placeholder="City, Country"
						/>
					</div>
				</section>

				<!-- Athletic Background -->
				<section class="form-section">
					<h2>🏃‍♂️ Athletic Background</h2>
						<div class="form-row">
							<div class="form-group">
								<label for="experience">Training Experience (Years) *</label>
								<input
									id="experience"
									type="number"
									bind:value={applicationData.experience}
									min="0"
									max="50"
									required
								/>
							</div>
							<div class="form-group">
								<label for="primaryDiscipline">Primary Discipline *</label>
								<select
									id="primaryDiscipline"
									bind:value={applicationData.primaryDiscipline}
									required
								>
									<option value="">Please select</option>
									<option value="triathlon">Triathlon</option>
									<option value="running">Running</option>
									<option value="cycling">Cycling</option>
									<option value="swimming">Swimming</option>
								</select>
							</div>
						</div>
						<div class="form-row">
							<div class="form-group">
								<label for="currentLevel">Current Level *</label>
								<select id="currentLevel" bind:value={applicationData.currentLevel} required>
									<option value="">Please select</option>
									<option value="beginner">Beginner</option>
									<option value="amateur">Amateur</option>
									<option value="competitive">Competitive</option>
									<option value="elite">Elite/Professional</option>
								</select>
							</div>
							<div class="form-group">
								<label for="weeklyTrainingHours">Weekly Training Hours</label>
								<input
									id="weeklyTrainingHours"
									type="number"
									bind:value={applicationData.weeklyTrainingHours}
									min="1"
									max="40"
								/>
							</div>
						</div>
					</section>

					<!-- Performance Data -->
					<section class="form-section">
						<h2>📊 Leistungsdaten</h2>
						<h3>🏃‍♂️ Laufen</h3>
						<div class="form-row">
							<div class="form-group">
								<label for="best5k">Beste 5km Zeit</label>
								<input
									id="best5k"
									type="text"
									bind:value={applicationData.best5kTime}
									placeholder="z.B. 20:15"
								/>
							</div>
							<div class="form-group">
								<label for="best10k">Beste 10km Zeit</label>
								<input
									id="best10k"
									type="text"
									bind:value={applicationData.best10kTime}
									placeholder="z.B. 42:30"
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-group">
								<label for="bestHalf">Beste Halbmarathon Zeit</label>
								<input
									id="bestHalf"
									type="text"
									bind:value={applicationData.bestHalfMarathonTime}
									placeholder="z.B. 1:35:20"
								/>
							</div>
							<div class="form-group">
								<label for="bestMarathon">Beste Marathon Zeit</label>
								<input
									id="bestMarathon"
									type="text"
									bind:value={applicationData.bestMarathonTime}
									placeholder="z.B. 3:20:45"
								/>
							</div>
						</div>

						<h3>🏊‍♂️ Schwimmen</h3>
						<div class="form-row">
							<div class="form-group">
								<label for="best50free">Beste 50m Freistil</label>
								<input
									id="best50free"
									type="text"
									bind:value={applicationData.best50mFree}
									placeholder="z.B. 0:35"
								/>
							</div>
							<div class="form-group">
								<label for="best100free">Beste 100m Freistil</label>
								<input
									id="best100free"
									type="text"
									bind:value={applicationData.best100mFree}
									placeholder="z.B. 1:15"
								/>
							</div>
						</div>

						<h3>🚴‍♂️ Triathlon</h3>
						<div class="form-row">
							<div class="form-group">
								<label for="bestSprint">Beste Sprint-Triathlon Zeit</label>
								<input
									id="bestSprint"
									type="text"
									bind:value={applicationData.bestSprintTriTime}
									placeholder="z.B. 1:05:30"
								/>
							</div>
							<div class="form-group">
								<label for="bestOlympic">Beste Olympic-Triathlon Zeit</label>
								<input
									id="bestOlympic"
									type="text"
									bind:value={applicationData.bestOlympicTriTime}
									placeholder="z.B. 2:15:45"
								/>
							</div>
						</div>
					</section>

					<!-- Physiological Data -->
					<section class="form-section">
						<h2>📈 Physiologische Daten</h2>
						<div class="form-row">
							<div class="form-group">
								<label for="restingHR">Ruhepuls (bpm)</label>
								<input
									id="restingHR"
									type="number"
									bind:value={applicationData.restingHR}
									min="30"
									max="100"
								/>
							</div>
							<div class="form-group">
								<label for="maxHR">Maximalpuls (bpm)</label>
								<input
									id="maxHR"
									type="number"
									bind:value={applicationData.maxHR}
									min="120"
									max="220"
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-group">
								<label for="ftp">FTP - Functional Threshold Power (Watt)</label>
								<input
									id="ftp"
									type="number"
									bind:value={applicationData.ftp}
									min="100"
									max="500"
								/>
							</div>
							<div class="form-group">
								<label for="vo2max">VO2Max (ml/kg/min)</label>
								<input
									id="vo2max"
									type="number"
									bind:value={applicationData.vo2Max}
									min="30"
									max="90"
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-group">
								<label for="weight">Gewicht (kg)</label>
								<input
									id="weight"
									type="number"
									bind:value={applicationData.weight}
									min="40"
									max="150"
								/>
							</div>
							<div class="form-group">
								<label for="height">Größe (cm)</label>
								<input
									id="height"
									type="number"
									bind:value={applicationData.height}
									min="140"
									max="220"
								/>
							</div>
						</div>
					</section>

					<!-- Goals & Motivation -->
					<section class="form-section">
						<h2>🎯 Ziele & Motivation</h2>
						<div class="form-group">
							<label for="goals2025">Ihre Ziele für 2025 *</label>
							<textarea
								id="goals2025"
								bind:value={applicationData.goals2025}
								placeholder="Beschreiben Sie Ihre sportlichen Ziele für 2025..."
								rows="3"
								required
							></textarea>
						</div>
						<div class="form-group">
							<label for="targetRaces">Planned Races 2025</label>
							<textarea
								id="targetRaces"
								bind:value={applicationData.targetRaces}
								placeholder="Which races do you plan to participate in?"
								rows="3"
							></textarea>
						</div>
						<div class="form-group">
							<label for="motivation">Why do you want to use LaufplanerPro? *</label>
							<textarea
								id="motivation"
								bind:value={applicationData.motivation}
								placeholder="What motivates you and how can we help you achieve your goals?"
								rows="4"
								required
							></textarea>
						</div>
					</section>

					<!-- Technology & Equipment -->
					<section class="form-section">
						<h2>📱 Technology & Equipment</h2>
						<div class="form-group">
							<fieldset>
								<legend>Training Devices/Apps Used</legend>
								<div class="checkbox-grid">
									{#each ['Garmin', 'Wahoo', 'Polar', 'Suunto', 'Apple Watch', 'Strava', 'TrainingPeaks', 'Zwift'] as device}
										<label class="checkbox-item">
											<input
												type="checkbox"
												checked={applicationData.devices.includes(device)}
												on:change={() => toggleDevice(device)}
											/>
											{device}
										</label>
									{/each}
								</div>
							</fieldset>
						</div>
					</section>

					<!-- Additional Information -->
					<section class="form-section">
						<h2>ℹ️ Zusätzliche Informationen</h2>
						<div class="form-group">
							<label for="coach">Trainer/Coach</label>
							<input
								id="coach"
								type="text"
								bind:value={applicationData.coach}
								placeholder="Name des Trainers (falls vorhanden)"
							/>
						</div>
						<div class="form-group">
							<label for="teamClub">Verein/Team</label>
							<input
								id="teamClub"
								type="text"
								bind:value={applicationData.teamClub}
								placeholder="Vereinszugehörigkeit"
							/>
						</div>
						<div class="form-group">
							<label for="referralSource">Wie haben Sie von uns erfahren?</label>
							<select id="referralSource" bind:value={applicationData.referralSource}>
								<option value="">Bitte wählen</option>
								<option value="google">Google Suche</option>
								<option value="social">Social Media</option>
								<option value="friend">Freunde/Bekannte</option>
								<option value="coach">Trainer-Empfehlung</option>
								<option value="other">Sonstiges</option>
							</select>
						</div>
					</section>

					<div class="form-actions">
						<button type="button" on:click={backToLogin} class="btn-secondary"> Abbrechen </button>
						<button type="submit" class="btn-primary" disabled={loading}>
							{loading ? 'Submitting application...' : 'Submit Application'}
						</button>
					</div>
				</form>
			</div>
		{:else if currentStep === 'submitted'}
			<!-- Success Message -->
			<div class="success-card">
				<div class="success-icon">✅</div>
				<h1>Application Submitted!</h1>
				<div class="success-content">
					<p><strong>Thank you for your application!</strong></p>
					<p>Your application has been successfully submitted and will be reviewed by our team.</p>

					<div class="next-steps">
						<h3>What happens next?</h3>
						<ol>
							<li><strong>Review:</strong> Our team will review your application within 48 hours</li>
							<li><strong>Notification:</strong> You will receive an email with our decision</li>
							<li><strong>Access:</strong> If accepted, you will receive your login credentials</li>
						</ol>
					</div>

					<div class="contact-info">
						<p><strong>Questions?</strong> Contact us at:</p>
						<p>📧 info@laufplanerpro.de</p>
					</div>
				</div>

				<button on:click={backToLogin} class="btn-primary"> Back to Login </button>
			</div>
		{/if}
	</main>
</div>

<style>
	/* Neural/Quantum Authentication Design */
	* {
		box-sizing: border-box;
	}

	.auth-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--neural-bg);
		color: var(--neural-text);
		font-family: var(--font-neural);
		position: relative;
		overflow-x: hidden;
		font-weight: 300;
	}

	/* Neural Background */
	.neural-bg {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.15) 0%, transparent 60%),
			radial-gradient(circle at 75% 75%, rgba(255, 107, 53, 0.15) 0%, transparent 60%),
			radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.1) 0%, transparent 60%);
		pointer-events: none;
		animation: neuralShift 20s ease-in-out infinite;
	}

	@keyframes neuralShift {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
		}
		50% {
			transform: scale(1.1) rotate(180deg);
		}
	}

	/* Header */
	.auth-header {
		text-align: center;
		padding: 3rem 2rem 2rem;
		position: relative;
		z-index: 2;
	}

	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.icon-neural {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: radial-gradient(circle at center, var(--neural-accent) 30%, transparent 70%);
		border: 1px solid var(--neural-accent);
		animation: neuralPulse 2s ease-in-out infinite;
		position: relative;
	}

	.icon-neural:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 12px;
		height: 12px;
		background: var(--neural-accent);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes neuralPulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.7);
		}
		50% {
			box-shadow: 0 0 0 8px rgba(0, 212, 255, 0);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 0.5;
			transform: translate(-50%, -50%) scale(1.2);
		}
	}

	.logo-text {
		font-size: 2.5rem;
		font-weight: 200;
		letter-spacing: 0.05em;
		background: var(--neural-gradient);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.subtitle {
		font-size: 1rem;
		opacity: 0.8;
		font-weight: 300;
		letter-spacing: 0.03em;
		margin: 0;
	}

	/* Main Content */
	.auth-main {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
		z-index: 2;
	}

	/* Auth Card (Login) */
	.auth-card {
		width: 100%;
		max-width: 480px;
		background: var(--neural-glass);
		backdrop-filter: blur(20px);
		border: 1px solid var(--neural-border);
		border-radius: 24px;
		padding: 3rem;
		box-shadow: var(--neural-shadow);
		transform: translateY(20px);
		animation: slideUp 0.8s ease forwards;
	}

	/* Application Card */
	.application-card {
		width: 100%;
		max-width: 900px;
		background: var(--neural-glass);
		backdrop-filter: blur(20px);
		border: 1px solid var(--neural-border);
		border-radius: 24px;
		padding: 3rem;
		box-shadow: var(--neural-shadow);
		transform: translateY(20px);
		animation: slideUp 0.8s ease forwards;
	}

	/* Success Card */
	.success-card {
		width: 100%;
		max-width: 600px;
		background: var(--neural-glass);
		backdrop-filter: blur(20px);
		border: 1px solid var(--neural-border);
		border-radius: 24px;
		padding: 3rem;
		box-shadow: var(--neural-shadow);
		text-align: center;
		transform: translateY(20px);
		animation: slideUp 0.8s ease forwards;
	}

	@keyframes slideUp {
		to {
			transform: translateY(0);
		}
	}

	/* Application Header */
	.application-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 3rem;
	}

	.back-btn {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		color: var(--neural-text);
		padding: 0.75rem 1rem;
		border-radius: 12px;
		cursor: pointer;
		transition: all var(--neural-transition);
		font-size: 0.9rem;
		font-weight: 300;
	}

	.back-btn:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
	}

	/* Form Headers */
	.auth-form-header,
	.application-header > div {
		flex: 1;
		text-align: center;
	}

	.auth-form-header h1,
	.application-header h1 {
		font-size: 2rem;
		font-weight: 200;
		margin: 0 0 1rem 0;
		letter-spacing: 0.02em;
		color: var(--neural-text);
	}

	.form-subtitle {
		font-size: 1rem;
		opacity: 0.8;
		font-weight: 300;
		letter-spacing: 0.01em;
		margin: 0;
		line-height: 1.5;
	}

	/* Alerts */
	.alert {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.alert.error {
		background: rgba(255, 68, 68, 0.15);
		border: 1px solid rgba(255, 68, 68, 0.3);
		color: #ff6b6b;
	}

	.alert.success {
		background: rgba(76, 175, 80, 0.15);
		border: 1px solid rgba(76, 175, 80, 0.3);
		color: #4caf50;
	}

	.alert-icon {
		font-size: 1.2rem;
	}

	/* Form Styles */
	.auth-form,
	.application-form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.application-form {
		gap: 3rem;
	}

	/* Form Sections */
	.form-section {
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		padding: 2rem;
		background: rgba(255, 255, 255, 0.02);
	}

	.form-section h2 {
		font-size: 1.3rem;
		font-weight: 300;
		margin: 0 0 1.5rem 0;
		color: var(--neural-accent);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.form-section h3 {
		font-size: 1.1rem;
		font-weight: 300;
		margin: 2rem 0 1rem 0;
		color: var(--neural-text);
		opacity: 0.9;
		border-bottom: 1px solid var(--neural-border);
		padding-bottom: 0.5rem;
	}

	/* Form Groups */
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.form-group label {
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.02em;
		opacity: 0.9;
		color: var(--neural-text);
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		padding: 1rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 12px;
		color: var(--neural-text);
		font-size: 1rem;
		font-weight: 300;
		letter-spacing: 0.01em;
		transition: all var(--neural-transition);
		font-family: inherit;
	}

	.form-group fieldset {
		border: 1px solid var(--neural-border);
		border-radius: 12px;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.02);
	}

	.form-group legend {
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.02em;
		opacity: 0.9;
		color: var(--neural-text);
		padding: 0 0.5rem;
	}

	.form-group textarea {
		resize: vertical;
		min-height: 100px;
	}

	.form-group input::placeholder,
	.form-group textarea::placeholder {
		color: rgba(255, 255, 255, 0.5);
		font-weight: 300;
	}

	.form-group input:focus,
	.form-group select:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--neural-accent);
		box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
		background: var(--neural-hover);
	}

	/* Checkbox Grid */
	.checkbox-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.checkbox-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 12px;
		cursor: pointer;
		transition: all var(--neural-transition);
		font-size: 0.9rem;
		font-weight: 300;
	}

	.checkbox-item:hover {
		background: var(--neural-hover);
		border-color: var(--neural-accent);
	}

	.checkbox-item input[type='checkbox'] {
		width: 16px;
		height: 16px;
		accent-color: var(--neural-accent);
	}

	/* Buttons */
	.btn-primary {
		padding: 1.25rem 2rem;
		background: var(--neural-gradient);
		border: none;
		border-radius: 12px;
		color: white;
		font-size: 1rem;
		font-weight: 300;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: all var(--neural-transition);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.btn-secondary {
		padding: 1rem 2rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 12px;
		color: var(--neural-text);
		font-size: 1rem;
		font-weight: 300;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: all var(--neural-transition);
	}

	.btn-secondary:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
	}

	.btn-demo {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		padding: 1rem 2rem;
		border-radius: 12px;
		color: var(--neural-text);
		font-weight: 300;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: all var(--neural-transition);
		width: 100%;
	}

	.btn-demo:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
		box-shadow: var(--neural-shadow);
	}

	.btn-link {
		background: none;
		border: none;
		color: var(--neural-accent);
		cursor: pointer;
		font-size: 1rem;
		font-weight: 300;
		letter-spacing: 0.01em;
		transition: color var(--neural-transition);
	}

	.btn-link:hover {
		color: var(--neural-text);
	}

	/* Auth Divider */
	.auth-divider {
		display: flex;
		align-items: center;
		text-align: center;
		margin: 1.5rem 0;
		font-size: 0.9rem;
		opacity: 0.7;
	}

	.auth-divider::before,
	.auth-divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--neural-border);
	}

	.auth-divider span {
		padding: 0 1rem;
	}

	/* Auth Footer */
	.auth-footer {
		text-align: center;
		margin-top: 2rem;
	}

	.auth-footer p {
		margin: 0 0 1rem 0;
		font-size: 0.9rem;
		opacity: 0.8;
	}

	/* Form Actions */
	.form-actions {
		display: flex;
		gap: 1.5rem;
		justify-content: flex-end;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid var(--neural-border);
	}

	/* Success Content */
	.success-icon {
		font-size: 4rem;
		margin-bottom: 1.5rem;
	}

	.success-content {
		text-align: left;
		margin: 2rem 0;
	}

	.success-content p {
		margin: 0 0 1rem 0;
		line-height: 1.6;
	}

	.next-steps {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
	}

	.next-steps h3 {
		margin: 0 0 1rem 0;
		color: var(--neural-accent);
		font-weight: 300;
	}

	.next-steps ol {
		margin: 0;
		padding-left: 1.5rem;
	}

	.next-steps li {
		margin: 0.75rem 0;
		line-height: 1.5;
	}

	.contact-info {
		background: rgba(0, 212, 255, 0.1);
		border: 1px solid rgba(0, 212, 255, 0.3);
		border-radius: 12px;
		padding: 1.5rem;
		margin: 2rem 0;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.auth-card,
		.application-card {
			padding: 2rem;
			margin: 1rem;
		}

		.form-row {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.checkbox-grid {
			grid-template-columns: 1fr;
		}

		.form-actions {
			flex-direction: column;
		}

		.application-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1.5rem;
		}

		.logo-text {
			font-size: 2rem;
		}

		.auth-form-header h1,
		.application-header h1 {
			font-size: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.auth-header {
			padding: 2rem 1rem 1rem;
		}

		.auth-main {
			padding: 1rem;
		}

		.auth-card,
		.application-card {
			padding: 1.5rem;
		}

		.form-section {
			padding: 1.5rem;
		}

		.logo-text {
			font-size: 1.8rem;
		}
	}
</style>

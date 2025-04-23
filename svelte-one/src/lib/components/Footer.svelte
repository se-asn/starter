<!-- src/lib/components/Footer.svelte -->
<footer class="footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-logo">
				<span class="logo">LAUF<span class="text-primary">PLANER</span> PRO</span>
				<p class="footer-tagline">Dein Weg zum nächsten Laufziel beginnt hier.</p>
			</div>

			<div class="footer-links">
				<a href="#plans" class="footer-link">Laufpläne</a>
				<a href="#features" class="footer-link">Features</a>
				<a href="#faq" class="footer-link">FAQ</a>
				<a href="#signup" class="footer-link">Anmelden</a>
			</div>
		</div>

		<div class="footer-bottom">
			<p class="copyright">&copy; 2023 LaufPlaner Pro. Alle Rechte vorbehalten.</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		padding: 3rem 0;
		background-color: var(--dark);
		border-top: 1px solid var(--light-gray);
	}

	.footer-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 768px) {
		.footer-content {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	.footer-logo {
		text-align: center;
	}

	@media (min-width: 768px) {
		.footer-logo {
			text-align: left;
		}
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
	}

	.text-primary {
		color: var(--primary);
	}

	.footer-tagline {
		margin-top: 0.5rem;
		color: var(--text-gray);
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		justify-content: center;
	}

	.footer-link {
		color: #d0d0d0;
		transition: color 0.3s ease;
	}

	.footer-link:hover {
		color: var(--primary);
	}

	.footer-bottom {
		padding-top: 2rem;
		border-top: 1px solid var(--light-gray);
		text-align: center;
	}

	.copyright {
		font-size: 0.875rem;
		color: var(--text-gray);
	}
</style>

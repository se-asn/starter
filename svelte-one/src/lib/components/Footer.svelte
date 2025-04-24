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
				<a href="#faq" class="footer-link">FAQ</a>
				<a href="#signup" class="footer-link">Anmelden</a>
				<a href="mailto:support@laufplanerpro.de" class="footer-link contact-link">
					<i class="fas fa-envelope"></i> Kontakt
				</a>
			</div>
		</div>

		<!-- Neue Trust Signals Sektion -->
		<div class="trust-signals">
			<div class="trust-item">
				<i class="fas fa-lock"></i>
				<span>Sichere Zahlungsmethoden</span>
			</div>
			<div class="trust-item">
				<i class="fas fa-medal"></i>
				<span>Von Laufexperten erstellt</span>
			</div>
			<div class="trust-item">
				<i class="fas fa-shield-alt"></i>
				<span>Sichere Datenübertragung</span>
			</div>
			<div class="trust-item">
				<i class="fas fa-thumbs-up"></i>
				<span>100% Zufriedenheitsgarantie</span>
			</div>
		</div>

		<div class="footer-bottom">
			<div class="payment-options">
				<i class="fab fa-cc-visa" title="Visa"></i>
				<i class="fab fa-cc-mastercard" title="MasterCard"></i>
				<i class="fab fa-cc-paypal" title="PayPal"></i>
				<i class="fab fa-cc-apple-pay" title="Apple Pay"></i>
				<i class="fab fa-google-pay" title="Google Pay"></i>
			</div>

			<p class="copyright">
				&copy; {new Date().getFullYear()} LaufPlanerPro. Alle Rechte vorbehalten.
			</p>
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

	.contact-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* Neue Styles für Trust Signals */
	.trust-signals {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
		margin: 2rem 0;
		padding: 1.5rem 0;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.trust-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: #d0d0d0;
	}

	.trust-item i {
		font-size: 1.25rem;
		color: var(--primary);
	}

	/* Styles für Zahlungsoptionen */
	.payment-options {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.payment-options i {
		font-size: 1.75rem;
		color: #d0d0d0;
		opacity: 0.7;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}

	.payment-options i:hover {
		opacity: 1;
		transform: translateY(-2px);
	}

	.footer-bottom {
		padding-top: 1.5rem;
		border-top: none;
		text-align: center;
	}

	.copyright {
		font-size: 0.875rem;
		color: var(--text-gray);
		margin-top: 0.5rem;
	}
</style>

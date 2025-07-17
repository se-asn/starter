// LaufplanerPro - Email Service for Application Status Notifications

interface EmailTemplate {
	subject: string;
	html: string;
	text: string;
}

interface ApplicationEmailData {
	firstName: string;
	lastName: string;
	email: string;
	status: string;
	applicationId: string;
	reviewDate?: string;
	adminNotes?: string;
}

export class EmailService {
	private readonly apiKey: string;
	private readonly fromEmail: string;
	private readonly platformUrl: string;

	constructor() {
		// In production, these would come from environment variables
		this.apiKey = process.env.EMAIL_API_KEY || '';
		this.fromEmail = process.env.FROM_EMAIL || 'noreply@laufplanerpro.de';
		this.platformUrl = process.env.PLATFORM_URL || 'https://laufplanerpro.de';
	}

	/**
	 * Send status change notification to applicant
	 */
	async sendStatusNotification(data: ApplicationEmailData): Promise<boolean> {
		try {
			const template = this.getEmailTemplate(data.status, data);
			
			// Simulate sending email (replace with actual email service)
			const emailPayload = {
				to: data.email,
				from: this.fromEmail,
				subject: template.subject,
				html: template.html,
				text: template.text
			};

			console.log('📧 Sending email notification:', emailPayload);
			
			// In production, integrate with email service like:
			// - SendGrid
			// - AWS SES
			// - Resend
			// - Mailgun
			
			// For now, simulate successful email sending
			await this.simulateEmailSending(emailPayload);
			
			return true;
		} catch (error) {
			console.error('Failed to send email notification:', error);
			return false;
		}
	}

	/**
	 * Send notification to admin about new application
	 */
	async sendAdminNotification(data: ApplicationEmailData): Promise<boolean> {
		try {
			const template = this.getAdminNotificationTemplate(data);
			
			const emailPayload = {
				to: 'admin@laufplanerpro.de', // Admin email
				from: this.fromEmail,
				subject: template.subject,
				html: template.html,
				text: template.text
			};

			console.log('📧 Sending admin notification:', emailPayload);
			await this.simulateEmailSending(emailPayload);
			
			return true;
		} catch (error) {
			console.error('Failed to send admin notification:', error);
			return false;
		}
	}

	/**
	 * Get email template based on application status
	 */
	private getEmailTemplate(status: string, data: ApplicationEmailData): EmailTemplate {
		const baseUrl = this.platformUrl;
		
		switch (status) {
			case 'approved':
				return {
					subject: '🎉 Willkommen bei LaufplanerPro - Bewerbung genehmigt!',
					html: this.getApprovedEmailHtml(data, baseUrl),
					text: this.getApprovedEmailText(data, baseUrl)
				};
				
			case 'rejected':
				return {
					subject: 'LaufplanerPro Bewerbung - Update zu Ihrer Anfrage',
					html: this.getRejectedEmailHtml(data, baseUrl),
					text: this.getRejectedEmailText(data, baseUrl)
				};
				
			case 'reviewing':
				return {
					subject: 'LaufplanerPro - Ihre Bewerbung wird überprüft',
					html: this.getReviewingEmailHtml(data, baseUrl),
					text: this.getReviewingEmailText(data, baseUrl)
				};
				
			case 'on_hold':
				return {
					subject: 'LaufplanerPro - Bewerbung vorläufig zurückgestellt',
					html: this.getOnHoldEmailHtml(data, baseUrl),
					text: this.getOnHoldEmailText(data, baseUrl)
				};
				
			default:
				return {
					subject: 'LaufplanerPro - Bewerbungsstatus Update',
					html: this.getDefaultEmailHtml(data, baseUrl),
					text: this.getDefaultEmailText(data, baseUrl)
				};
		}
	}

	/**
	 * Admin notification template
	 */
	private getAdminNotificationTemplate(data: ApplicationEmailData): EmailTemplate {
		return {
			subject: `🏃‍♂️ Neue LaufplanerPro Bewerbung: ${data.firstName} ${data.lastName}`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2 style="color: #0ea5e9;">Neue Athletenbewerbung eingegangen</h2>
					<div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<h3>Bewerber Details:</h3>
						<p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
						<p><strong>E-Mail:</strong> ${data.email}</p>
						<p><strong>Bewerbungs-ID:</strong> ${data.applicationId}</p>
					</div>
					<p>
						<a href="${this.platformUrl}/admin" 
						   style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
						   Bewerbung überprüfen
						</a>
					</p>
				</div>
			`,
			text: `
				Neue LaufplanerPro Bewerbung eingegangen
				
				Bewerber: ${data.firstName} ${data.lastName}
				E-Mail: ${data.email}
				Bewerbungs-ID: ${data.applicationId}
				
				Jetzt überprüfen: ${this.platformUrl}/admin
			`
		};
	}

	// Email template implementations
	private getApprovedEmailHtml(data: ApplicationEmailData, baseUrl: string): string {
		return `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
				<div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 30px; text-align: center; color: white;">
					<h1 style="margin: 0;">🎉 Willkommen bei LaufplanerPro!</h1>
				</div>
				
				<div style="padding: 30px; background: white;">
					<h2>Hallo ${data.firstName},</h2>
					
					<p style="font-size: 18px; color: #059669; font-weight: bold;">
						Herzlichen Glückwunsch! Ihre Bewerbung wurde genehmigt.
					</p>
					
					<p>Wir freuen uns, Sie als Teil der LaufplanerPro Elite-Community begrüßen zu dürfen. Sie haben nun Zugang zu unserer professionellen Trainingsplattform.</p>
					
					<div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<h3 style="color: #0ea5e9;">Ihre nächsten Schritte:</h3>
						<ol>
							<li>Loggen Sie sich in Ihr Dashboard ein</li>
							<li>Vervollständigen Sie Ihr Athletenprofil</li>
							<li>Verbinden Sie Ihre Trainingsgeräte</li>
							<li>Beginnen Sie mit der Datenanalyse</li>
						</ol>
					</div>
					
					${data.adminNotes ? `
						<div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
							<h4 style="color: #d97706; margin-top: 0;">Notiz vom Team:</h4>
							<p style="margin-bottom: 0;">${data.adminNotes}</p>
						</div>
					` : ''}
					
					<div style="text-align: center; margin: 30px 0;">
						<a href="${baseUrl}/auth" 
						   style="background: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
						   Jetzt einloggen
						</a>
					</div>
					
					<p style="color: #666; font-size: 14px;">
						Bei Fragen erreichen Sie uns unter support@laufplanerpro.de
					</p>
				</div>
			</div>
		`;
	}

	private getApprovedEmailText(data: ApplicationEmailData, baseUrl: string): string {
		return `
			Willkommen bei LaufplanerPro!
			
			Hallo ${data.firstName},
			
			Herzlichen Glückwunsch! Ihre Bewerbung wurde genehmigt.
			
			Wir freuen uns, Sie als Teil der LaufplanerPro Elite-Community begrüßen zu dürfen.
			
			Ihre nächsten Schritte:
			1. Loggen Sie sich in Ihr Dashboard ein
			2. Vervollständigen Sie Ihr Athletenprofil
			3. Verbinden Sie Ihre Trainingsgeräte
			4. Beginnen Sie mit der Datenanalyse
			
			${data.adminNotes ? `Notiz vom Team: ${data.adminNotes}` : ''}
			
			Jetzt einloggen: ${baseUrl}/auth
			
			Bei Fragen erreichen Sie uns unter support@laufplanerpro.de
		`;
	}

	private getRejectedEmailHtml(data: ApplicationEmailData, baseUrl: string): string {
		return `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
				<div style="background: #f8fafc; padding: 30px; text-align: center;">
					<h1 style="margin: 0; color: #64748b;">LaufplanerPro</h1>
				</div>
				
				<div style="padding: 30px; background: white;">
					<h2>Hallo ${data.firstName},</h2>
					
					<p>vielen Dank für Ihr Interesse an LaufplanerPro und Ihre eingereichte Bewerbung.</p>
					
					<p>Nach sorgfältiger Prüfung müssen wir Ihnen mitteilen, dass wir Ihre Bewerbung zum aktuellen Zeitpunkt nicht berücksichtigen können.</p>
					
					${data.adminNotes ? `
						<div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
							<h4 style="color: #d97706; margin-top: 0;">Feedback:</h4>
							<p style="margin-bottom: 0;">${data.adminNotes}</p>
						</div>
					` : ''}
					
					<p>Wir ermutigen Sie, sich zu einem späteren Zeitpunkt erneut zu bewerben, wenn sich Ihre Situation geändert hat.</p>
					
					<p style="color: #666; font-size: 14px;">
						Bei Fragen erreichen Sie uns unter support@laufplanerpro.de
					</p>
				</div>
			</div>
		`;
	}

	private getRejectedEmailText(data: ApplicationEmailData, baseUrl: string): string {
		return `
			LaufplanerPro - Bewerbungsupdate
			
			Hallo ${data.firstName},
			
			vielen Dank für Ihr Interesse an LaufplanerPro und Ihre eingereichte Bewerbung.
			
			Nach sorgfältiger Prüfung müssen wir Ihnen mitteilen, dass wir Ihre Bewerbung zum aktuellen Zeitpunkt nicht berücksichtigen können.
			
			${data.adminNotes ? `Feedback: ${data.adminNotes}` : ''}
			
			Wir ermutigen Sie, sich zu einem späteren Zeitpunkt erneut zu bewerben.
			
			Bei Fragen erreichen Sie uns unter support@laufplanerpro.de
		`;
	}

	private getReviewingEmailHtml(data: ApplicationEmailData, baseUrl: string): string {
		return `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
				<div style="background: #f59e0b; padding: 30px; text-align: center; color: white;">
					<h1 style="margin: 0;">🔍 Bewerbung in Überprüfung</h1>
				</div>
				
				<div style="padding: 30px; background: white;">
					<h2>Hallo ${data.firstName},</h2>
					
					<p>vielen Dank für Ihre Bewerbung bei LaufplanerPro.</p>
					
					<p style="font-size: 16px; color: #d97706; font-weight: bold;">
						Ihre Bewerbung wird derzeit von unserem Team überprüft.
					</p>
					
					<p>Wir prüfen alle eingegangenen Informationen sorgfältig und werden Sie in Kürze über den Status Ihrer Bewerbung informieren.</p>
					
					${data.adminNotes ? `
						<div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
							<h4 style="color: #d97706; margin-top: 0;">Notiz vom Team:</h4>
							<p style="margin-bottom: 0;">${data.adminNotes}</p>
						</div>
					` : ''}
					
					<p style="color: #666; font-size: 14px;">
						Bei Fragen erreichen Sie uns unter support@laufplanerpro.de
					</p>
				</div>
			</div>
		`;
	}

	private getReviewingEmailText(data: ApplicationEmailData, baseUrl: string): string {
		return `
			LaufplanerPro - Bewerbung in Überprüfung
			
			Hallo ${data.firstName},
			
			vielen Dank für Ihre Bewerbung bei LaufplanerPro.
			
			Ihre Bewerbung wird derzeit von unserem Team überprüft.
			
			Wir werden Sie in Kürze über den Status informieren.
			
			${data.adminNotes ? `Notiz vom Team: ${data.adminNotes}` : ''}
			
			Bei Fragen erreichen Sie uns unter support@laufplanerpro.de
		`;
	}

	private getOnHoldEmailHtml(data: ApplicationEmailData, baseUrl: string): string {
		return `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
				<div style="background: #64748b; padding: 30px; text-align: center; color: white;">
					<h1 style="margin: 0;">⏸️ Bewerbung zurückgestellt</h1>
				</div>
				
				<div style="padding: 30px; background: white;">
					<h2>Hallo ${data.firstName},</h2>
					
					<p>vielen Dank für Ihre Bewerbung bei LaufplanerPro.</p>
					
					<p style="font-size: 16px; color: #64748b; font-weight: bold;">
						Ihre Bewerbung wurde vorläufig zurückgestellt.
					</p>
					
					<p>Dies bedeutet nicht, dass Ihre Bewerbung abgelehnt wurde. Wir werden sie zu einem späteren Zeitpunkt erneut prüfen.</p>
					
					${data.adminNotes ? `
						<div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
							<h4 style="color: #64748b; margin-top: 0;">Grund:</h4>
							<p style="margin-bottom: 0;">${data.adminNotes}</p>
						</div>
					` : ''}
					
					<p>Wir werden Sie kontaktieren, sobald wir Ihre Bewerbung weiter bearbeiten können.</p>
					
					<p style="color: #666; font-size: 14px;">
						Bei Fragen erreichen Sie uns unter support@laufplanerpro.de
					</p>
				</div>
			</div>
		`;
	}

	private getOnHoldEmailText(data: ApplicationEmailData, baseUrl: string): string {
		return `
			LaufplanerPro - Bewerbung zurückgestellt
			
			Hallo ${data.firstName},
			
			vielen Dank für Ihre Bewerbung bei LaufplanerPro.
			
			Ihre Bewerbung wurde vorläufig zurückgestellt.
			
			Dies bedeutet nicht, dass Ihre Bewerbung abgelehnt wurde.
			
			${data.adminNotes ? `Grund: ${data.adminNotes}` : ''}
			
			Wir werden Sie kontaktieren, sobald wir Ihre Bewerbung weiter bearbeiten können.
			
			Bei Fragen erreichen Sie uns unter support@laufplanerpro.de
		`;
	}

	private getDefaultEmailHtml(data: ApplicationEmailData, baseUrl: string): string {
		return `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
				<div style="background: #0ea5e9; padding: 30px; text-align: center; color: white;">
					<h1 style="margin: 0;">LaufplanerPro</h1>
				</div>
				
				<div style="padding: 30px; background: white;">
					<h2>Hallo ${data.firstName},</h2>
					
					<p>es gibt ein Update zu Ihrer LaufplanerPro Bewerbung.</p>
					
					<p style="font-size: 16px; font-weight: bold;">
						Status: ${data.status}
					</p>
					
					${data.adminNotes ? `
						<div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
							<h4 style="color: #0ea5e9; margin-top: 0;">Notiz:</h4>
							<p style="margin-bottom: 0;">${data.adminNotes}</p>
						</div>
					` : ''}
					
					<p style="color: #666; font-size: 14px;">
						Bei Fragen erreichen Sie uns unter support@laufplanerpro.de
					</p>
				</div>
			</div>
		`;
	}

	private getDefaultEmailText(data: ApplicationEmailData, baseUrl: string): string {
		return `
			LaufplanerPro - Bewerbungsupdate
			
			Hallo ${data.firstName},
			
			es gibt ein Update zu Ihrer LaufplanerPro Bewerbung.
			
			Status: ${data.status}
			
			${data.adminNotes ? `Notiz: ${data.adminNotes}` : ''}
			
			Bei Fragen erreichen Sie uns unter support@laufplanerpro.de
		`;
	}

	/**
	 * Simulate email sending (replace with actual email service in production)
	 */
	private async simulateEmailSending(payload: any): Promise<void> {
		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 500));
		
		// Log email for development
		console.log('📧 Email would be sent:', {
			to: payload.to,
			subject: payload.subject,
			timestamp: new Date().toISOString()
		});
		
		// In production, replace this with actual email service call:
		// await sendgrid.send(payload);
		// await ses.sendEmail(payload);
		// await resend.emails.send(payload);
	}
}

export const emailService = new EmailService();

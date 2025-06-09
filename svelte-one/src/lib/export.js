// Functions to export training plans to various formats

// Generate an ICS (iCalendar) file for a training plan
export function generateICS(plan, userPlan) {
	// Basic calendar headers
	let icsContent = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//LaufPlaner//TrainingSchedule//DE',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		'X-WR-CALNAME:Trainingsplan: ' + plan.title,
		'X-WR-TIMEZONE:Europe/Berlin'
	];

	// Start date of the plan
	const startDate = new Date(userPlan.startDate);

	// Generate events for each training session
	plan.weeks.forEach((week, weekIndex) => {
		week.sessions.forEach((session, dayIndex) => {
			// Skip rest days
			if (session.type === 'Ruhetag') return;

			// Calculate the date for this session based on the week and day
			const sessionDate = new Date(startDate);
			sessionDate.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);

			// Default duration (in minutes)
			const durationMinutes = session.duration || 45;

			// Format date and time for iCalendar
			const dtStart = formatICalDate(sessionDate);

			// Calculate end time (adding duration)
			const endDate = new Date(sessionDate);
			endDate.setMinutes(endDate.getMinutes() + durationMinutes);
			const dtEnd = formatICalDate(endDate);

			// Create unique ID for this event
			const uid = `training-${plan.id}-w${weekIndex + 1}-d${dayIndex + 1}-${Date.now()}@laufplaner.de`;

			// Create summary
			const summary = `${session.type} - Woche ${week.weekNumber}, ${session.day}`;

			// Build description
			let description = session.description;
			if (session.distance) {
				description += `\\nDistanz: ${session.distance} km`;
			}
			if (session.duration) {
				description += `\\nDauer: ${session.duration} min`;
			}

			// Add event to calendar
			icsContent.push('BEGIN:VEVENT');
			icsContent.push(`UID:${uid}`);
			icsContent.push(`DTSTAMP:${formatICalDate(new Date())}`);
			icsContent.push(`DTSTART:${dtStart}`);
			icsContent.push(`DTEND:${dtEnd}`);
			icsContent.push(`SUMMARY:${summary}`);
			icsContent.push(`DESCRIPTION:${description}`);
			icsContent.push('END:VEVENT');
		});
	});

	// Close calendar
	icsContent.push('END:VCALENDAR');

	return icsContent.join('\r\n');
}

// Generate a CSV file for a training plan
export function generateCSV(plan, userPlan) {
	// CSV headers
	const headers = [
		'Woche',
		'Tag',
		'Datum',
		'Trainingstyp',
		'Beschreibung',
		'Dauer (min)',
		'Distanz (km)',
		'Status'
	];
	const rows = [headers.join(',')];

	// Start date of the plan
	const startDate = new Date(userPlan.startDate);

	// Generate rows for each training session
	plan.weeks.forEach((week, weekIndex) => {
		week.sessions.forEach((session, dayIndex) => {
			// Calculate the date for this session
			const sessionDate = new Date(startDate);
			sessionDate.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);
			const formattedDate = sessionDate.toLocaleDateString('de-DE');

			// Prepare row data, escape commas in text fields
			const rowData = [
				week.weekNumber,
				session.day,
				formattedDate,
				session.type,
				`"${session.description.replace(/"/g, '""')}"`, // Escape quotes in CSV
				session.duration || '',
				session.distance || '',
				session.completed ? 'Erledigt' : 'Offen'
			];

			rows.push(rowData.join(','));
		});
	});

	return rows.join('\n');
}

// Generate a PDF representation of a training plan
// Note: In a real app, you'd use a PDF library like pdfkit, jsPDF, etc.
export function generatePDFData(plan, userPlan) {
	// This is a placeholder for actual PDF generation
	// In a real implementation, you would use a PDF library
	// and return the binary PDF data

	// For now, we just return some metadata about what would be in the PDF
	return {
		title: plan.title,
		weeks: plan.weeks.length,
		startDate: userPlan.startDate,
		targetDate: userPlan.targetDate,
		targetEvent: userPlan.targetEvent,
		format: 'pdf'
	};
}

// Helper function to format a date for iCalendar format
function formatICalDate(date) {
	return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

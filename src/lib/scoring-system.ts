// LaufplanerPro - Automatic Application Scoring System

interface ApplicationScoring {
	performanceScore: number;
	experienceScore: number;
	motivationScore: number;
	totalScore: number;
	recommendation: 'STRONG_APPROVE' | 'APPROVE' | 'REVIEW' | 'REJECT';
	scoringDetails: {
		performance: ScoringDetail[];
		experience: ScoringDetail[];
		motivation: ScoringDetail[];
	};
}

interface ScoringDetail {
	criterion: string;
	points: number;
	maxPoints: number;
	reason: string;
}

interface ApplicationData {
	// Personal Info
	firstName: string;
	lastName: string;
	email: string;
	birthDate: string;
	gender: string;
	
	// Athletic Background
	experience: number;
	primaryDiscipline: string;
	currentLevel: string;
	weeklyTrainingHours: number;
	
	// Performance Data
	bestMarathonTime?: string;
	bestHalfMarathonTime?: string;
	best10kTime?: string;
	best5kTime?: string;
	bestIronmanTime?: string;
	bestOlympicTriTime?: string;
	bestSprintTriTime?: string;
	
	// Physiological Data
	vo2Max?: number;
	ftp?: number;
	restingHR?: number;
	maxHR?: number;
	
	// Swimming Data
	best100mFree?: string;
	best1500mFree?: string;
	
	// Goals & Motivation
	goals2025: string;
	motivation: string;
	targetRaces?: string;
	
	// Equipment & Technology
	devices: string[];
	trainingApps: string[];
	equipment?: string;
}

export class ApplicationScoringSystem {
	
	/**
	 * Calculate comprehensive application score
	 */
	scoreApplication(data: ApplicationData): ApplicationScoring {
		const performanceScore = this.calculatePerformanceScore(data);
		const experienceScore = this.calculateExperienceScore(data);
		const motivationScore = this.calculateMotivationScore(data);
		
		const totalScore = Math.round(
			(performanceScore.score + experienceScore.score + motivationScore.score) / 3
		);
		
		const recommendation = this.getRecommendation(totalScore, performanceScore.score, experienceScore.score, motivationScore.score);
		
		return {
			performanceScore: performanceScore.score,
			experienceScore: experienceScore.score,
			motivationScore: motivationScore.score,
			totalScore,
			recommendation,
			scoringDetails: {
				performance: performanceScore.details,
				experience: experienceScore.details,
				motivation: motivationScore.details
			}
		};
	}

	/**
	 * Calculate performance score based on athletic achievements
	 */
	private calculatePerformanceScore(data: ApplicationData): { score: number; details: ScoringDetail[] } {
		const details: ScoringDetail[] = [];
		let totalPoints = 0;
		let maxPoints = 0;

		// Running Performance (40 points max)
		const runningScore = this.evaluateRunningTimes(data);
		details.push(...runningScore.details);
		totalPoints += runningScore.points;
		maxPoints += 40;

		// Triathlon Performance (30 points max)
		const triathlonScore = this.evaluateTriathlonTimes(data);
		details.push(...triathlonScore.details);
		totalPoints += triathlonScore.points;
		maxPoints += 30;

		// Physiological Metrics (20 points max)
		const physioScore = this.evaluatePhysiologicalData(data);
		details.push(...physioScore.details);
		totalPoints += physioScore.points;
		maxPoints += 20;

		// Swimming Performance (10 points max)
		const swimmingScore = this.evaluateSwimmingTimes(data);
		details.push(...swimmingScore.details);
		totalPoints += swimmingScore.points;
		maxPoints += 10;

		const score = Math.round((totalPoints / maxPoints) * 100);
		
		return { score, details };
	}

	/**
	 * Calculate experience score based on training background
	 */
	private calculateExperienceScore(data: ApplicationData): { score: number; details: ScoringDetail[] } {
		const details: ScoringDetail[] = [];
		let totalPoints = 0;
		let maxPoints = 0;

		// Training Experience (40 points max)
		let experiencePoints = 0;
		if (data.experience >= 10) experiencePoints = 40;
		else if (data.experience >= 7) experiencePoints = 30;
		else if (data.experience >= 5) experiencePoints = 25;
		else if (data.experience >= 3) experiencePoints = 20;
		else if (data.experience >= 1) experiencePoints = 15;
		else experiencePoints = 5;

		details.push({
			criterion: 'Training Experience',
			points: experiencePoints,
			maxPoints: 40,
			reason: `${data.experience} Jahre Trainingserfahrung`
		});
		totalPoints += experiencePoints;
		maxPoints += 40;

		// Current Level (25 points max)
		let levelPoints = 0;
		switch (data.currentLevel?.toLowerCase()) {
			case 'elite':
				levelPoints = 25;
				break;
			case 'competitive':
				levelPoints = 20;
				break;
			case 'amateur':
				levelPoints = 15;
				break;
			case 'beginner':
				levelPoints = 10;
				break;
			default:
				levelPoints = 5;
		}

		details.push({
			criterion: 'Current Level',
			points: levelPoints,
			maxPoints: 25,
			reason: `Level: ${data.currentLevel}`
		});
		totalPoints += levelPoints;
		maxPoints += 25;

		// Weekly Training Hours (20 points max)
		let hoursPoints = 0;
		if (data.weeklyTrainingHours >= 15) hoursPoints = 20;
		else if (data.weeklyTrainingHours >= 12) hoursPoints = 16;
		else if (data.weeklyTrainingHours >= 10) hoursPoints = 14;
		else if (data.weeklyTrainingHours >= 8) hoursPoints = 12;
		else if (data.weeklyTrainingHours >= 6) hoursPoints = 10;
		else if (data.weeklyTrainingHours >= 4) hoursPoints = 8;
		else hoursPoints = 5;

		details.push({
			criterion: 'Weekly Training Volume',
			points: hoursPoints,
			maxPoints: 20,
			reason: `${data.weeklyTrainingHours} Stunden pro Woche`
		});
		totalPoints += hoursPoints;
		maxPoints += 20;

		// Technology & Equipment (15 points max)
		let techPoints = 0;
		const deviceCount = data.devices?.length || 0;
		const appCount = data.trainingApps?.length || 0;
		
		if (deviceCount >= 3) techPoints += 8;
		else if (deviceCount >= 2) techPoints += 6;
		else if (deviceCount >= 1) techPoints += 4;
		
		if (appCount >= 3) techPoints += 7;
		else if (appCount >= 2) techPoints += 5;
		else if (appCount >= 1) techPoints += 3;

		details.push({
			criterion: 'Technology Integration',
			points: techPoints,
			maxPoints: 15,
			reason: `${deviceCount} Geräte, ${appCount} Apps`
		});
		totalPoints += techPoints;
		maxPoints += 15;

		const score = Math.round((totalPoints / maxPoints) * 100);
		return { score, details };
	}

	/**
	 * Calculate motivation score based on goals and commitment
	 */
	private calculateMotivationScore(data: ApplicationData): { score: number; details: ScoringDetail[] } {
		const details: ScoringDetail[] = [];
		let totalPoints = 0;
		let maxPoints = 0;

		// Goals Quality (40 points max)
		const goalsLength = data.goals2025?.length || 0;
		const hasSpecificGoals = this.hasSpecificGoals(data.goals2025);
		const hasTimeTargets = this.hasTimeTargets(data.goals2025);
		
		let goalsPoints = 0;
		if (goalsLength > 200 && hasSpecificGoals && hasTimeTargets) goalsPoints = 40;
		else if (goalsLength > 150 && hasSpecificGoals) goalsPoints = 32;
		else if (goalsLength > 100 && hasSpecificGoals) goalsPoints = 25;
		else if (goalsLength > 50) goalsPoints = 18;
		else if (goalsLength > 20) goalsPoints = 10;
		else goalsPoints = 5;

		details.push({
			criterion: 'Goals Quality',
			points: goalsPoints,
			maxPoints: 40,
			reason: `${goalsLength} Zeichen, ${hasSpecificGoals ? 'spezifisch' : 'allgemein'}, ${hasTimeTargets ? 'mit Zeitzielen' : 'ohne Zeitziele'}`
		});
		totalPoints += goalsPoints;
		maxPoints += 40;

		// Motivation Quality (35 points max)
		const motivationLength = data.motivation?.length || 0;
		const hasPersonalStory = this.hasPersonalStory(data.motivation);
		const showsCommitment = this.showsCommitment(data.motivation);
		
		let motivationPoints = 0;
		if (motivationLength > 300 && hasPersonalStory && showsCommitment) motivationPoints = 35;
		else if (motivationLength > 200 && hasPersonalStory) motivationPoints = 28;
		else if (motivationLength > 150 && showsCommitment) motivationPoints = 22;
		else if (motivationLength > 100) motivationPoints = 18;
		else if (motivationLength > 50) motivationPoints = 12;
		else motivationPoints = 5;

		details.push({
			criterion: 'Motivation Quality',
			points: motivationPoints,
			maxPoints: 35,
			reason: `${motivationLength} Zeichen, ${hasPersonalStory ? 'persönliche Geschichte' : 'oberflächlich'}, ${showsCommitment ? 'zeigt Engagement' : 'wenig Engagement'}`
		});
		totalPoints += motivationPoints;
		maxPoints += 35;

		// Target Races (25 points max)
		const targetRacesLength = data.targetRaces?.length || 0;
		const hasSpecificRaces = this.hasSpecificRaces(data.targetRaces || '');
		
		let racesPoints = 0;
		if (targetRacesLength > 100 && hasSpecificRaces) racesPoints = 25;
		else if (targetRacesLength > 50 && hasSpecificRaces) racesPoints = 20;
		else if (targetRacesLength > 30) racesPoints = 15;
		else if (targetRacesLength > 10) racesPoints = 10;
		else racesPoints = 5;

		details.push({
			criterion: 'Target Races',
			points: racesPoints,
			maxPoints: 25,
			reason: `${targetRacesLength} Zeichen, ${hasSpecificRaces ? 'spezifische Rennen' : 'allgemeine Angaben'}`
		});
		totalPoints += racesPoints;
		maxPoints += 25;

		const score = Math.round((totalPoints / maxPoints) * 100);
		return { score, details };
	}

	/**
	 * Evaluate running performance times
	 */
	private evaluateRunningTimes(data: ApplicationData): { points: number; details: ScoringDetail[] } {
		const details: ScoringDetail[] = [];
		let points = 0;

		// Marathon time (15 points max)
		if (data.bestMarathonTime) {
			const marathonMinutes = this.parseTimeToMinutes(data.bestMarathonTime);
			if (marathonMinutes > 0) {
				let marathonPoints = 0;
				if (marathonMinutes < 150) marathonPoints = 15; // Sub 2:30
				else if (marathonMinutes < 180) marathonPoints = 12; // Sub 3:00
				else if (marathonMinutes < 210) marathonPoints = 10; // Sub 3:30
				else if (marathonMinutes < 240) marathonPoints = 8; // Sub 4:00
				else if (marathonMinutes < 270) marathonPoints = 6; // Sub 4:30
				else marathonPoints = 3;

				details.push({
					criterion: 'Marathon Time',
					points: marathonPoints,
					maxPoints: 15,
					reason: `${data.bestMarathonTime} (${this.formatTime(marathonMinutes)})`
				});
				points += marathonPoints;
			}
		}

		// Half Marathon time (10 points max)
		if (data.bestHalfMarathonTime) {
			const halfMinutes = this.parseTimeToMinutes(data.bestHalfMarathonTime);
			if (halfMinutes > 0) {
				let halfPoints = 0;
				if (halfMinutes < 75) halfPoints = 10; // Sub 1:15
				else if (halfMinutes < 90) halfPoints = 8; // Sub 1:30
				else if (halfMinutes < 105) halfPoints = 6; // Sub 1:45
				else if (halfMinutes < 120) halfPoints = 4; // Sub 2:00
				else halfPoints = 2;

				details.push({
					criterion: 'Half Marathon Time',
					points: halfPoints,
					maxPoints: 10,
					reason: `${data.bestHalfMarathonTime} (${this.formatTime(halfMinutes)})`
				});
				points += halfPoints;
			}
		}

		// 10K time (8 points max)
		if (data.best10kTime) {
			const tenKMinutes = this.parseTimeToMinutes(data.best10kTime);
			if (tenKMinutes > 0) {
				let tenKPoints = 0;
				if (tenKMinutes < 32) tenKPoints = 8; // Sub 32:00
				else if (tenKMinutes < 35) tenKPoints = 6; // Sub 35:00
				else if (tenKMinutes < 40) tenKPoints = 5; // Sub 40:00
				else if (tenKMinutes < 45) tenKPoints = 3; // Sub 45:00
				else tenKPoints = 1;

				details.push({
					criterion: '10K Time',
					points: tenKPoints,
					maxPoints: 8,
					reason: `${data.best10kTime} (${this.formatTime(tenKMinutes)})`
				});
				points += tenKPoints;
			}
		}

		// 5K time (7 points max)
		if (data.best5kTime) {
			const fiveKMinutes = this.parseTimeToMinutes(data.best5kTime);
			if (fiveKMinutes > 0) {
				let fiveKPoints = 0;
				if (fiveKMinutes < 15) fiveKPoints = 7; // Sub 15:00
				else if (fiveKMinutes < 17) fiveKPoints = 5; // Sub 17:00
				else if (fiveKMinutes < 20) fiveKPoints = 4; // Sub 20:00
				else if (fiveKMinutes < 25) fiveKPoints = 2; // Sub 25:00
				else fiveKPoints = 1;

				details.push({
					criterion: '5K Time',
					points: fiveKPoints,
					maxPoints: 7,
					reason: `${data.best5kTime} (${this.formatTime(fiveKMinutes)})`
				});
				points += fiveKPoints;
			}
		}

		return { points, details };
	}

	/**
	 * Evaluate triathlon performance times
	 */
	private evaluateTriathlonTimes(data: ApplicationData): { points: number; details: ScoringDetail[] } {
		const details: ScoringDetail[] = [];
		let points = 0;

		// Ironman time (15 points max)
		if (data.bestIronmanTime) {
			const ironmanMinutes = this.parseTimeToMinutes(data.bestIronmanTime);
			if (ironmanMinutes > 0) {
				let ironmanPoints = 0;
				if (ironmanMinutes < 540) ironmanPoints = 15; // Sub 9:00
				else if (ironmanMinutes < 600) ironmanPoints = 12; // Sub 10:00
				else if (ironmanMinutes < 660) ironmanPoints = 10; // Sub 11:00
				else if (ironmanMinutes < 720) ironmanPoints = 8; // Sub 12:00
				else if (ironmanMinutes < 780) ironmanPoints = 6; // Sub 13:00
				else ironmanPoints = 3;

				details.push({
					criterion: 'Ironman Time',
					points: ironmanPoints,
					maxPoints: 15,
					reason: `${data.bestIronmanTime} (${this.formatTime(ironmanMinutes)})`
				});
				points += ironmanPoints;
			}
		}

		// Olympic Distance time (10 points max)
		if (data.bestOlympicTriTime) {
			const olympicMinutes = this.parseTimeToMinutes(data.bestOlympicTriTime);
			if (olympicMinutes > 0) {
				let olympicPoints = 0;
				if (olympicMinutes < 120) olympicPoints = 10; // Sub 2:00
				else if (olympicMinutes < 135) olympicPoints = 8; // Sub 2:15
				else if (olympicMinutes < 150) olympicPoints = 6; // Sub 2:30
				else if (olympicMinutes < 180) olympicPoints = 4; // Sub 3:00
				else olympicPoints = 2;

				details.push({
					criterion: 'Olympic Triathlon Time',
					points: olympicPoints,
					maxPoints: 10,
					reason: `${data.bestOlympicTriTime} (${this.formatTime(olympicMinutes)})`
				});
				points += olympicPoints;
			}
		}

		// Sprint Distance time (5 points max)
		if (data.bestSprintTriTime) {
			const sprintMinutes = this.parseTimeToMinutes(data.bestSprintTriTime);
			if (sprintMinutes > 0) {
				let sprintPoints = 0;
				if (sprintMinutes < 60) sprintPoints = 5; // Sub 1:00
				else if (sprintMinutes < 70) sprintPoints = 4; // Sub 1:10
				else if (sprintMinutes < 80) sprintPoints = 3; // Sub 1:20
				else if (sprintMinutes < 90) sprintPoints = 2; // Sub 1:30
				else sprintPoints = 1;

				details.push({
					criterion: 'Sprint Triathlon Time',
					points: sprintPoints,
					maxPoints: 5,
					reason: `${data.bestSprintTriTime} (${this.formatTime(sprintMinutes)})`
				});
				points += sprintPoints;
			}
		}

		return { points, details };
	}

	/**
	 * Evaluate physiological data
	 */
	private evaluatePhysiologicalData(data: ApplicationData): { points: number; details: ScoringDetail[] } {
		const details: ScoringDetail[] = [];
		let points = 0;

		// VO2 Max (8 points max)
		if (data.vo2Max && data.vo2Max > 0) {
			let vo2Points = 0;
			if (data.vo2Max >= 70) vo2Points = 8; // Elite level
			else if (data.vo2Max >= 60) vo2Points = 6; // Very good
			else if (data.vo2Max >= 50) vo2Points = 4; // Good
			else if (data.vo2Max >= 40) vo2Points = 2; // Average
			else vo2Points = 1;

			details.push({
				criterion: 'VO2 Max',
				points: vo2Points,
				maxPoints: 8,
				reason: `${data.vo2Max} ml/kg/min`
			});
			points += vo2Points;
		}

		// FTP (7 points max)
		if (data.ftp && data.ftp > 0) {
			let ftpPoints = 0;
			if (data.ftp >= 350) ftpPoints = 7; // Elite level
			else if (data.ftp >= 300) ftpPoints = 6; // Very good
			else if (data.ftp >= 250) ftpPoints = 4; // Good
			else if (data.ftp >= 200) ftpPoints = 2; // Average
			else ftpPoints = 1;

			details.push({
				criterion: 'FTP (Watts)',
				points: ftpPoints,
				maxPoints: 7,
				reason: `${data.ftp} watts`
			});
			points += ftpPoints;
		}

		// Resting HR (3 points max)
		if (data.restingHR && data.restingHR > 0) {
			let hrPoints = 0;
			if (data.restingHR <= 45) hrPoints = 3; // Excellent
			else if (data.restingHR <= 55) hrPoints = 2; // Good
			else if (data.restingHR <= 65) hrPoints = 1; // Average
			else hrPoints = 0;

			details.push({
				criterion: 'Resting Heart Rate',
				points: hrPoints,
				maxPoints: 3,
				reason: `${data.restingHR} bpm`
			});
			points += hrPoints;
		}

		// Max HR (2 points max)
		if (data.maxHR && data.maxHR > 0) {
			let maxHrPoints = 0;
			if (data.maxHR >= 190) maxHrPoints = 2; // High
			else if (data.maxHR >= 180) maxHrPoints = 1; // Average
			else maxHrPoints = 0;

			details.push({
				criterion: 'Max Heart Rate',
				points: maxHrPoints,
				maxPoints: 2,
				reason: `${data.maxHR} bpm`
			});
			points += maxHrPoints;
		}

		return { points, details };
	}

	/**
	 * Evaluate swimming performance
	 */
	private evaluateSwimmingTimes(data: ApplicationData): { points: number; details: ScoringDetail[] } {
		const details: ScoringDetail[] = [];
		let points = 0;

		// 100m Freestyle (6 points max)
		if (data.best100mFree) {
			const swim100Minutes = this.parseTimeToMinutes(data.best100mFree);
			if (swim100Minutes > 0) {
				let swim100Points = 0;
				if (swim100Minutes < 1) swim100Points = 6; // Sub 1:00
				else if (swim100Minutes < 1.25) swim100Points = 5; // Sub 1:15
				else if (swim100Minutes < 1.5) swim100Points = 4; // Sub 1:30
				else if (swim100Minutes < 2) swim100Points = 2; // Sub 2:00
				else swim100Points = 1;

				details.push({
					criterion: '100m Freestyle',
					points: swim100Points,
					maxPoints: 6,
					reason: `${data.best100mFree}`
				});
				points += swim100Points;
			}
		}

		// 1500m Freestyle (4 points max)
		if (data.best1500mFree) {
			const swim1500Minutes = this.parseTimeToMinutes(data.best1500mFree);
			if (swim1500Minutes > 0) {
				let swim1500Points = 0;
				if (swim1500Minutes < 18) swim1500Points = 4; // Sub 18:00
				else if (swim1500Minutes < 20) swim1500Points = 3; // Sub 20:00
				else if (swim1500Minutes < 25) swim1500Points = 2; // Sub 25:00
				else if (swim1500Minutes < 30) swim1500Points = 1; // Sub 30:00
				else swim1500Points = 0;

				details.push({
					criterion: '1500m Freestyle',
					points: swim1500Points,
					maxPoints: 4,
					reason: `${data.best1500mFree}`
				});
				points += swim1500Points;
			}
		}

		return { points, details };
	}

	/**
	 * Get final recommendation based on scores
	 */
	private getRecommendation(
		totalScore: number, 
		performanceScore: number, 
		experienceScore: number, 
		motivationScore: number
	): 'STRONG_APPROVE' | 'APPROVE' | 'REVIEW' | 'REJECT' {
		
		// Strong approval criteria
		if (totalScore >= 85 && performanceScore >= 80 && experienceScore >= 80) {
			return 'STRONG_APPROVE';
		}
		
		// Approval criteria
		if (totalScore >= 70 && performanceScore >= 60 && experienceScore >= 60) {
			return 'APPROVE';
		}
		
		// Review criteria (good potential but needs evaluation)
		if (totalScore >= 50 || motivationScore >= 80) {
			return 'REVIEW';
		}
		
		// Rejection criteria
		return 'REJECT';
	}

	// Helper methods for text analysis
	private hasSpecificGoals(text: string): boolean {
		if (!text) return false;
		const specificTerms = ['zeit', 'platz', 'rang', 'sub', 'unter', 'verbesser', 'pb', 'pr', 'bestzeit'];
		return specificTerms.some(term => text.toLowerCase().includes(term));
	}

	private hasTimeTargets(text: string): boolean {
		if (!text) return false;
		const timePatterns = /\d{1,2}:\d{2}|\d{1,2}h\d{2}|\bsub\s*\d/i;
		return timePatterns.test(text);
	}

	private hasPersonalStory(text: string): boolean {
		if (!text) return false;
		const personalTerms = ['ich', 'mein', 'mir', 'mich', 'seit', 'begann', 'angefangen', 'erfahrung', 'träum'];
		return personalTerms.some(term => text.toLowerCase().includes(term));
	}

	private showsCommitment(text: string): boolean {
		if (!text) return false;
		const commitmentTerms = ['leidenschaft', 'hingabe', 'ziel', 'träum', 'ambition', 'entschlossen', 'fokussiert'];
		return commitmentTerms.some(term => text.toLowerCase().includes(term));
	}

	private hasSpecificRaces(text: string): boolean {
		if (!text) return false;
		const raceTerms = ['ironman', 'marathon', 'triathlon', 'hamburg', 'berlin', 'kona', 'challenge', 'meisterschaft'];
		return raceTerms.some(term => text.toLowerCase().includes(term));
	}

	// Time parsing helpers
	private parseTimeToMinutes(timeStr: string): number {
		if (!timeStr) return 0;
		
		// Try different time formats
		const formats = [
			/^(\d+):(\d+):(\d+)$/, // HH:MM:SS
			/^(\d+):(\d+)$/, // MM:SS or HH:MM
			/^(\d+)h(\d+)m?$/, // 2h30 or 2h30m
			/^(\d+)m(\d+)s?$/, // 30m45 or 30m45s
			/^(\d+\.?\d*)$/ // decimal minutes
		];

		for (const format of formats) {
			const match = timeStr.match(format);
			if (match) {
				if (format === formats[0]) { // HH:MM:SS
					return parseInt(match[1]) * 60 + parseInt(match[2]) + parseInt(match[3]) / 60;
				} else if (format === formats[1]) { // MM:SS or HH:MM
					const first = parseInt(match[1]);
					const second = parseInt(match[2]);
					// Heuristic: if first number > 10, treat as MM:SS, else HH:MM
					if (first > 10) {
						return first + second / 60;
					} else {
						return first * 60 + second;
					}
				} else if (format === formats[2]) { // Hours and minutes
					return parseInt(match[1]) * 60 + parseInt(match[2]);
				} else if (format === formats[3]) { // Minutes and seconds
					return parseInt(match[1]) + parseInt(match[2]) / 60;
				} else if (format === formats[4]) { // Decimal minutes
					return parseFloat(match[1]);
				}
			}
		}
		
		return 0;
	}

	private formatTime(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = Math.floor(minutes % 60);
		const secs = Math.floor((minutes % 1) * 60);
		
		if (hours > 0) {
			return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		} else {
			return `${mins}:${secs.toString().padStart(2, '0')}`;
		}
	}
}

export const scoringSystem = new ApplicationScoringSystem();

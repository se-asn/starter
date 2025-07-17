// LaufplanerPro - Applications API Endpoint
// Handle athlete application submissions and management

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { scoringSystem } from '$lib/scoring-system';
import { emailService } from '$lib/email-service';
import type { RequestHandler } from './$types';

interface ApplicationData {
	// Personal Info
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	birthDate: string;
	gender: string;
	location: string;
	
	// Athletic Background
	experience: string;
	primaryDiscipline: string;
	currentLevel: string;
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
	ftp: string;
	ltHR: string;
	vo2Max: string;
	weight: string;
	height: string;
	bodyFat: string;
	
	// Swimming Data
	best50mFree: string;
	best100mFree: string;
	best1500mFree: string;
	swimCSS: string;
	
	// Goals & Motivation
	goals2025: string;
	targetRaces: string;
	motivation: string;
	expectations: string;
	
	// Equipment & Technology
	devices: string[];
	trainingApps: string[];
	equipment: string;
	
	// Additional Info
	injuries: string;
	medications: string;
	coach: string;
	teamClub: string;
	socialMedia: string;
	referralSource: string;
	additionalInfo: string;
}

// Submit new application
export const POST: RequestHandler = async ({ request }) => {
	try {
		const applicationData: ApplicationData = await request.json();

		// Validate required fields
		const requiredFields = [
			'firstName', 'lastName', 'email', 'experience', 
			'primaryDiscipline', 'currentLevel', 'goals2025', 'motivation'
		];

		for (const field of requiredFields) {
			if (!applicationData[field as keyof ApplicationData]) {
				return json({ 
					success: false, 
					error: `Missing required field: ${field}` 
				}, { status: 400 });
			}
		}

		// Check if email already exists
		const { data: existingApp } = await supabase
			.from('athlete_applications')
			.select('id')
			.eq('email', applicationData.email)
			.single();

		if (existingApp) {
			return json({ 
				success: false, 
				error: 'Eine Bewerbung mit dieser E-Mail-Adresse existiert bereits.' 
			}, { status: 400 });
		}

		// Calculate automatic scoring
		const scoring = scoringSystem.scoreApplication({
			firstName: applicationData.firstName,
			lastName: applicationData.lastName,
			email: applicationData.email,
			birthDate: applicationData.birthDate,
			gender: applicationData.gender,
			
			experience: parseInt(applicationData.experience) || 0,
			primaryDiscipline: applicationData.primaryDiscipline,
			currentLevel: applicationData.currentLevel,
			weeklyTrainingHours: parseInt(applicationData.weeklyTrainingHours) || 0,
			
			bestMarathonTime: applicationData.bestMarathonTime,
			bestHalfMarathonTime: applicationData.bestHalfMarathonTime,
			best10kTime: applicationData.best10kTime,
			best5kTime: applicationData.best5kTime,
			bestIronmanTime: applicationData.bestIronmanTime,
			bestOlympicTriTime: applicationData.bestOlympicTriTime,
			bestSprintTriTime: applicationData.bestSprintTriTime,
			
			vo2Max: parseFloat(applicationData.vo2Max) || undefined,
			ftp: parseFloat(applicationData.ftp) || undefined,
			restingHR: parseInt(applicationData.restingHR) || undefined,
			maxHR: parseInt(applicationData.maxHR) || undefined,
			
			best100mFree: applicationData.best100mFree,
			best1500mFree: applicationData.best1500mFree,
			
			goals2025: applicationData.goals2025,
			motivation: applicationData.motivation,
			targetRaces: applicationData.targetRaces,
			
			devices: applicationData.devices || [],
			trainingApps: applicationData.trainingApps || [],
			equipment: applicationData.equipment
		});

		// Transform data for database
		const dbData = {
			first_name: applicationData.firstName,
			last_name: applicationData.lastName,
			email: applicationData.email,
			phone: applicationData.phone || null,
			birth_date: applicationData.birthDate || null,
			gender: applicationData.gender || null,
			location: applicationData.location || null,
			
			experience: parseInt(applicationData.experience) || 0,
			primary_discipline: applicationData.primaryDiscipline,
			current_level: applicationData.currentLevel,
			weekly_training_hours: parseInt(applicationData.weeklyTrainingHours) || null,
			
			best_marathon_time: applicationData.bestMarathonTime || null,
			best_half_marathon_time: applicationData.bestHalfMarathonTime || null,
			best_10k_time: applicationData.best10kTime || null,
			best_5k_time: applicationData.best5kTime || null,
			best_ironman_time: applicationData.bestIronmanTime || null,
			best_olympic_tri_time: applicationData.bestOlympicTriTime || null,
			best_sprint_tri_time: applicationData.bestSprintTriTime || null,
			
			resting_hr: parseInt(applicationData.restingHR) || null,
			max_hr: parseInt(applicationData.maxHR) || null,
			ftp: parseInt(applicationData.ftp) || null,
			lt_hr: parseInt(applicationData.ltHR) || null,
			vo2_max: parseFloat(applicationData.vo2Max) || null,
			weight: parseFloat(applicationData.weight) || null,
			height: parseInt(applicationData.height) || null,
			body_fat: parseFloat(applicationData.bodyFat) || null,
			
			best_50m_free: applicationData.best50mFree || null,
			best_100m_free: applicationData.best100mFree || null,
			best_1500m_free: applicationData.best1500mFree || null,
			swim_css: applicationData.swimCSS || null,
			
			goals_2025: applicationData.goals2025,
			target_races: applicationData.targetRaces || null,
			motivation: applicationData.motivation,
			expectations: applicationData.expectations || null,
			
			devices: JSON.stringify(applicationData.devices || []),
			training_apps: JSON.stringify(applicationData.trainingApps || []),
			equipment: applicationData.equipment || null,
			
			// Automatic scoring results
			performance_score: scoring.performanceScore,
			experience_score: scoring.experienceScore,
			motivation_score: scoring.motivationScore,
			total_score: scoring.totalScore,
			auto_recommendation: scoring.recommendation,
			
			injuries: applicationData.injuries || null,
			medications: applicationData.medications || null,
			coach: applicationData.coach || null,
			team_club: applicationData.teamClub || null,
			social_media: applicationData.socialMedia || null,
			referral_source: applicationData.referralSource || null,
			additional_info: applicationData.additionalInfo || null,
			
			status: 'pending'
		};

		// Insert application
		const { data, error } = await supabase
			.from('athlete_applications')
			.insert([dbData])
			.select()
			.single();

		if (error) {
			console.error('Database error:', error);
			return json({ 
				success: false, 
				error: 'Fehler beim Speichern der Bewerbung. Bitte versuchen Sie es erneut.' 
			}, { status: 500 });
		}

		// Send confirmation email and admin notification
		try {
			// Send confirmation email to applicant
			await emailService.sendStatusNotification({
				firstName: data.first_name,
				lastName: data.last_name,
				email: data.email,
				status: 'pending',
				applicationId: data.id
			});

			// Send notification to admin
			await emailService.sendAdminNotification({
				firstName: data.first_name,
				lastName: data.last_name,
				email: data.email,
				status: 'pending',
				applicationId: data.id
			});
		} catch (emailError) {
			console.error('Email error:', emailError);
			// Don't fail the application if email fails
		}

		return json({ 
			success: true, 
			message: 'Bewerbung erfolgreich eingereicht!',
			applicationId: data.id
		});

	} catch (error) {
		console.error('Application submission error:', error);
		return json({ 
			success: false, 
			error: 'Ein unerwarteter Fehler ist aufgetreten.' 
		}, { status: 500 });
	}
};

// Get applications (admin only)
export const GET: RequestHandler = async ({ url, request }) => {
	try {
		// Check admin authentication
		const authHeader = request.headers.get('Authorization');
		if (!authHeader) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const token = authHeader.replace('Bearer ', '');
		const { data: { user }, error: authError } = await supabase.auth.getUser(token);

		if (authError || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check if user is admin
		const { data: adminUser } = await supabase
			.from('admin_users')
			.select('*')
			.eq('user_id', user.id)
			.single();

		if (!adminUser) {
			return json({ error: 'Forbidden - Admin access required' }, { status: 403 });
		}

		// Parse query parameters
		const status = url.searchParams.get('status');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = (page - 1) * limit;

		// Build query
		let query = supabase
			.from('athlete_applications')
			.select('*', { count: 'exact' })
			.order('created_at', { ascending: false })
			.range(offset, offset + limit - 1);

		if (status && status !== 'all') {
			query = query.eq('status', status);
		}

		const { data: applications, error, count } = await query;

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch applications' }, { status: 500 });
		}

		return json({
			success: true,
			applications,
			pagination: {
				page,
				limit,
				total: count || 0,
				totalPages: Math.ceil((count || 0) / limit)
			}
		});

	} catch (error) {
		console.error('Get applications error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
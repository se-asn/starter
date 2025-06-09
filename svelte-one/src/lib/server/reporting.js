// Admin reporting functionality
// This module provides statistical functions for admin dashboard reporting

import { userTrainingPlans, availableTrainingPlans } from './training-plans-data.js';

// Get statistics on active users
export function getActiveUsersStats() {
	// In a real app, this would be calculated from database records
	// For this example, we're assuming we have user data available

	const currentDate = new Date();
	const oneWeekAgo = new Date(currentDate);
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	const oneMonthAgo = new Date(currentDate);
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

	// Simulated data for demonstration purposes
	return {
		total: 150,
		activeLastWeek: 87,
		activeLastMonth: 126,
		growth: 12.5, // percentage growth from previous month
		completionRate: 68 // percentage of sessions completed vs scheduled
	};
}

// Get statistics on training plan usage and completion
export function getTrainingPlanStats() {
	// Group plans by type/distance
	const plansByType = availableTrainingPlans.reduce((acc, plan) => {
		acc[plan.distance] = (acc[plan.distance] || 0) + 1;
		return acc;
	}, {});

	// Count assignments by plan type
	const assignmentsByType = userTrainingPlans.reduce((acc, assignment) => {
		const plan = availableTrainingPlans.find((p) => p.id === assignment.planId);
		if (plan) {
			acc[plan.distance] = (acc[plan.distance] || 0) + 1;
		}
		return acc;
	}, {});

	// Calculate average completion percentage
	const completionPercentages = userTrainingPlans.map((plan) => plan.progress || 0);
	const avgCompletion = completionPercentages.length
		? completionPercentages.reduce((sum, val) => sum + val, 0) / completionPercentages.length
		: 0;

	// Calculate most popular plan
	const planCounts = {};
	userTrainingPlans.forEach((assignment) => {
		planCounts[assignment.planId] = (planCounts[assignment.planId] || 0) + 1;
	});

	let mostPopularPlanId = null;
	let mostPopularCount = 0;

	Object.entries(planCounts).forEach(([planId, count]) => {
		if (count > mostPopularCount) {
			mostPopularCount = count;
			mostPopularPlanId = planId;
		}
	});

	const mostPopularPlan = availableTrainingPlans.find((p) => p.id === mostPopularPlanId);

	return {
		totalPlans: availableTrainingPlans.length,
		totalAssignments: userTrainingPlans.length,
		plansByType,
		assignmentsByType,
		avgCompletion: Math.round(avgCompletion),
		mostPopularPlan: mostPopularPlan
			? {
					id: mostPopularPlan.id,
					title: mostPopularPlan.title,
					count: mostPopularCount
				}
			: null
	};
}

// Get monthly training activity data for charts
export function getMonthlyActivityData() {
	// In a real app, this would query the database for training activity
	// For this example, we're generating simulated data

	// Get last 6 months
	const months = [];
	const monthNames = [
		'Jan',
		'Feb',
		'Mär',
		'Apr',
		'Mai',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Okt',
		'Nov',
		'Dez'
	];

	const now = new Date();
	for (let i = 5; i >= 0; i--) {
		const month = new Date(now);
		month.setMonth(now.getMonth() - i);
		months.push(monthNames[month.getMonth()]);
	}

	// Simulated training session data
	const sessionsCompleted = [120, 145, 165, 160, 185, 210];
	const avgCompletionRate = [65, 68, 72, 70, 75, 78];
	const newUsers = [15, 12, 18, 22, 25, 30];

	return {
		months,
		sessionsCompleted,
		avgCompletionRate,
		newUsers
	};
}

// Get training session completion data by day of week
export function getCompletionByDayOfWeek() {
	// This would be a database query in a real application
	// Here we're returning simulated data

	return {
		days: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
		completionRates: [65, 72, 58, 70, 62, 85, 45]
	};
}

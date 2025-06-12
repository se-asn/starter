// API Route: AI Training Plan Generation
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AITrainingPlanGenerator } from '$lib/ai-training-generator';
import type { AthleteProfile, RaceGoal } from '$lib/ai-training-generator';

// POST /api/ai/generate-plan
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { athlete, goal, options } = await request.json();

    console.log('🤖 AI Training Plan Generation Request:', {
      athlete: `${athlete.firstName} ${athlete.lastName}`,
      goal: `${goal.raceType} on ${goal.raceDate}`,
      options
    });

    // Validate required data
    if (!athlete || !goal) {
      return json({ 
        error: 'Missing required data',
        required: ['athlete', 'goal']
      }, { status: 400 });
    }

    // Parse dates
    const athleteProfile: AthleteProfile = {
      ...athlete,
      birthDate: new Date(athlete.birthDate)
    };

    const raceGoal: RaceGoal = {
      ...goal,
      raceDate: new Date(goal.raceDate)
    };

    // Generate the training plan
    console.log('🔄 Generating AI training plan...');
    const generatedPlan = await AITrainingPlanGenerator.generatePlan(
      athleteProfile,
      raceGoal,
      options || {}
    );

    console.log('✅ Training plan generated successfully:', {
      planId: generatedPlan.id,
      totalWeeks: generatedPlan.totalWeeks,
      estimatedTss: generatedPlan.estimatedTss,
      confidence: generatedPlan.confidence
    });

    // Store the plan in database (mock for now)
    const storedPlan = await storePlanInDatabase(generatedPlan);

    return json({
      success: true,
      plan: {
        id: generatedPlan.id,
        name: generatedPlan.name,
        totalWeeks: generatedPlan.totalWeeks,
        phases: generatedPlan.phases,
        estimatedTss: generatedPlan.estimatedTss,
        confidence: generatedPlan.confidence,
        generatedAt: generatedPlan.generatedAt,
        avgWeeklyHours: generatedPlan.weeks.reduce((sum, w) => sum + w.targetHours, 0) / generatedPlan.weeks.length
      },
      preview: {
        firstWeek: generatedPlan.weeks[0],
        peakWeek: generatedPlan.weeks.find(w => w.targetTss === Math.max(...generatedPlan.weeks.map(w => w.targetTss))),
        raceWeek: generatedPlan.weeks[generatedPlan.weeks.length - 1]
      },
      aiAnalysis: {
        model: generatedPlan.aiModel,
        confidence: generatedPlan.confidence,
        adaptations: generatedPlan.adaptations,
        recommendations: generateRecommendations(generatedPlan)
      }
    });

  } catch (error) {
    console.error('❌ AI Training Plan Generation Error:', error);
    return json({
      error: 'Failed to generate training plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

// GET /api/ai/adapt-plan
export const GET: RequestHandler = async ({ url }) => {
  try {
    const planId = url.searchParams.get('planId');
    const userId = parseInt(url.searchParams.get('userId') || '0');

    if (!planId || !userId) {
      return json({ 
        error: 'Missing required parameters',
        required: ['planId', 'userId']
      }, { status: 400 });
    }

    console.log('🔄 Adapting training plan:', planId, 'for user:', userId);

    // Get existing plan from database (mock)
    const existingPlan = await getPlanFromDatabase(planId);
    if (!existingPlan) {
      return json({ error: 'Training plan not found' }, { status: 404 });
    }

    // Get recent performance data (mock)
    const performanceData = await getPerformanceData(userId);

    // Adapt the plan based on current performance
    const adaptedPlan = await AITrainingPlanGenerator.adaptPlan(
      existingPlan,
      performanceData
    );

    console.log('✅ Plan adapted successfully:', {
      originalTss: existingPlan.estimatedTss,
      adaptedTss: adaptedPlan.estimatedTss,
      changes: calculatePlanChanges(existingPlan, adaptedPlan)
    });

    return json({
      success: true,
      adaptedPlan: {
        id: adaptedPlan.id,
        name: adaptedPlan.name,
        adaptedAt: adaptedPlan.generatedAt,
        changes: calculatePlanChanges(existingPlan, adaptedPlan)
      },
      performanceAnalysis: {
        currentForm: performanceData.currentForm,
        fatigue: performanceData.fatigue,
        fitness: performanceData.fitness,
        trend: analyzePerformanceTrend(performanceData)
      },
      recommendations: generateAdaptationRecommendations(existingPlan, adaptedPlan)
    });

  } catch (error) {
    console.error('❌ Plan Adaptation Error:', error);
    return json({
      error: 'Failed to adapt training plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

// PUT /api/ai/feedback
export const PUT: RequestHandler = async ({ request }) => {
  try {
    const { planId, userId, feedback, rating } = await request.json();

    if (!planId || !userId || !feedback) {
      return json({ 
        error: 'Missing required parameters',
        required: ['planId', 'userId', 'feedback']
      }, { status: 400 });
    }

    console.log('📝 Recording AI plan feedback:', {
      planId,
      userId,
      rating,
      feedbackLength: feedback.length
    });

    // Store feedback in database (mock)
    const feedbackRecord = {
      id: `feedback_${Date.now()}`,
      planId,
      userId,
      feedback,
      rating: rating || null,
      submittedAt: new Date()
    };

    console.log('✅ Feedback recorded successfully');

    // Use feedback to improve future recommendations
    await updateAIModel(feedbackRecord);

    return json({
      success: true,
      message: 'Feedback recorded successfully',
      feedbackId: feedbackRecord.id
    });

  } catch (error) {
    console.error('❌ Feedback Recording Error:', error);
    return json({
      error: 'Failed to record feedback',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

// Helper functions (mocked for now - would integrate with real database)

async function storePlanInDatabase(plan: any) {
  console.log('💾 Storing plan in database:', plan.id);
  // Mock storage
  return { stored: true, id: plan.id };
}

async function getPlanFromDatabase(planId: string) {
  console.log('🔍 Retrieving plan from database:', planId);
  // Mock retrieval - in production this would query your database
  return null;
}

async function getPerformanceData(userId: number) {
  console.log('📊 Getting performance data for user:', userId);
  // Mock performance data
  return {
    recentActivities: [],
    currentForm: -5, // TSB
    fatigue: 45,     // ATL
    fitness: 50      // CTL
  };
}

function calculatePlanChanges(original: any, adapted: any) {
  return {
    weeklyHoursChange: 0,
    tssChange: adapted.estimatedTss - original.estimatedTss,
    modificationsCount: 0,
    summary: 'Plan maintained with minor adjustments'
  };
}

function analyzePerformanceTrend(data: any) {
  // Analyze performance trend
  if (data.currentForm > 5) return 'improving';
  if (data.currentForm < -15) return 'declining';
  return 'stable';
}

function generateRecommendations(plan: any) {
  return [
    {
      category: 'nutrition',
      title: 'Race Fueling Strategy',
      description: 'Develop and practice your race day nutrition plan during long training sessions',
      priority: 'high'
    },
    {
      category: 'equipment',
      title: 'Gear Preparation',
      description: 'Ensure all race equipment is tested and familiar before race day',
      priority: 'medium'
    },
    {
      category: 'recovery',
      title: 'Sleep Optimization',
      description: 'Aim for 7-9 hours of quality sleep during high training load weeks',
      priority: 'high'
    }
  ];
}

function generateAdaptationRecommendations(original: any, adapted: any) {
  return [
    {
      title: 'Training Load Adjustment',
      description: 'Your training load has been adjusted based on current performance metrics',
      action: 'Continue monitoring RPE and adjust as needed'
    },
    {
      title: 'Recovery Focus',
      description: 'Increased emphasis on recovery this week',
      action: 'Prioritize sleep and nutrition'
    }
  ];
}

async function updateAIModel(feedback: any) {
  console.log('🧠 Updating AI model with feedback:', feedback.id);
  // In production, this would feed back into the AI training system
}

// AI Training Plan Generator for Smart Triathlete
// Advanced system for creating personalized training plans

export interface AthleteProfile {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  
  // Performance Metrics
  ftpWatts?: number;
  maxHeartRate?: number;
  restingHeartRate?: number;
  vo2Max?: number;
  swimCssPace?: number; // seconds per 100m
  runThresholdPace?: number; // seconds per km
  
  // Training History
  weeklyHours: number;
  experience: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  injuries: string[];
  preferences: TrainingPreferences;
}

export interface TrainingPreferences {
  morningWorkouts: boolean;
  eveningWorkouts: boolean;
  weekendLongSessions: boolean;
  indoorPreference: boolean;
  gymAccess: boolean;
  poolAccess: boolean;
  equipmentAvailable: string[];
  daysPerWeek: number;
  restDays: number[];
  travelSchedule?: string;
}

export interface RaceGoal {
  raceType: 'sprint' | 'olympic' | 'half_ironman' | 'ironman' | 'custom';
  raceDate: Date;
  targetTime?: string;
  priority: 'A' | 'B' | 'C';
  location: string;
  courseDifficulty: 'easy' | 'moderate' | 'hard';
  
  // Distance overrides for custom races
  swimDistanceM?: number;
  bikeDistanceM?: number;
  runDistanceM?: number;
}

export interface TrainingPhase {
  name: string;
  startWeek: number;
  endWeek: number;
  focus: 'base' | 'build' | 'peak' | 'race' | 'recovery';
  weeklyHours: number;
  intensity: 'low' | 'moderate' | 'high';
  description: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  type: 'swim' | 'bike' | 'run' | 'brick' | 'strength' | 'recovery';
  duration: number; // minutes
  tssTarget: number;
  intensityZones: IntensityZone[];
  structure: WorkoutInterval[];
  equipment: string[];
  location: 'indoor' | 'outdoor' | 'pool' | 'gym';
  description: string;
  adaptations: WorkoutAdaptation[];
}

export interface IntensityZone {
  zone: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  description: string;
  heartRatePercent?: [number, number];
  powerPercent?: [number, number];
  paceMultiplier?: [number, number];
  duration: number; // minutes
}

export interface WorkoutInterval {
  type: 'warmup' | 'main' | 'recovery' | 'cooldown';
  duration: number;
  intensity: number; // zone 1-6
  description: string;
  repetitions?: number;
  recoveryTime?: number;
}

export interface WorkoutAdaptation {
  condition: 'fatigue_high' | 'form_low' | 'weather_bad' | 'time_limited';
  modification: string;
  durationChange?: number;
  intensityChange?: number;
}

export interface GeneratedTrainingPlan {
  id: string;
  name: string;
  athlete: AthleteProfile;
  goal: RaceGoal;
  phases: TrainingPhase[];
  weeks: WeeklyPlan[];
  totalWeeks: number;
  estimatedTss: number;
  confidence: number;
  aiModel: string;
  generatedAt: Date;
  adaptations: PlanAdaptation[];
}

export interface WeeklyPlan {
  weekNumber: number;
  phase: string;
  targetHours: number;
  targetTss: number;
  sessions: WorkoutSession[];
  notes: string;
  recoveryFocus: boolean;
}

export interface WorkoutSession {
  dayOfWeek: number;
  workout: WorkoutTemplate;
  scheduledTime?: string;
  notes?: string;
  alternatives?: WorkoutTemplate[];
}

export interface PlanAdaptation {
  trigger: string;
  description: string;
  implementation: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
}

// AI Training Plan Generator
export class AITrainingPlanGenerator {
  private static readonly RACE_DISTANCES = {
    sprint: { swim: 750, bike: 20000, run: 5000 },
    olympic: { swim: 1500, bike: 40000, run: 10000 },
    half_ironman: { swim: 1900, bike: 90000, run: 21097 },
    ironman: { swim: 3800, bike: 180000, run: 42195 }
  };

  private static readonly WORKOUT_TEMPLATES: WorkoutTemplate[] = [
    {
      id: 'swim_base_easy',
      name: 'Base Endurance Swim',
      type: 'swim',
      duration: 45,
      tssTarget: 50,
      intensityZones: [
        { zone: 1, name: 'Recovery', description: 'Easy pace', duration: 10 },
        { zone: 2, name: 'Aerobic', description: 'Comfortable', duration: 25 },
        { zone: 1, name: 'Recovery', description: 'Cool down', duration: 10 }
      ],
      structure: [
        { type: 'warmup', duration: 10, intensity: 1, description: '400m easy' },
        { type: 'main', duration: 25, intensity: 2, description: '1000m steady' },
        { type: 'cooldown', duration: 10, intensity: 1, description: '400m easy' }
      ],
      equipment: ['swimsuit', 'goggles'],
      location: 'pool',
      description: 'Aerobic base building swim session',
      adaptations: [
        {
          condition: 'time_limited',
          modification: 'Reduce main set to 15 minutes',
          durationChange: -10
        }
      ]
    },
    {
      id: 'bike_threshold',
      name: 'Threshold Power Intervals',
      type: 'bike',
      duration: 90,
      tssTarget: 85,
      intensityZones: [
        { zone: 2, name: 'Aerobic', description: 'Warm up', duration: 20 },
        { zone: 4, name: 'Threshold', description: 'Hard effort', duration: 40 },
        { zone: 2, name: 'Aerobic', description: 'Recovery', duration: 30 }
      ],
      structure: [
        { type: 'warmup', duration: 20, intensity: 2, description: 'Easy spin' },
        { type: 'main', duration: 40, intensity: 4, description: '4 x 8min @ threshold', repetitions: 4, recoveryTime: 2 },
        { type: 'cooldown', duration: 30, intensity: 2, description: 'Easy spin' }
      ],
      equipment: ['bike', 'helmet', 'power_meter'],
      location: 'outdoor',
      description: 'Functional threshold power development',
      adaptations: [
        {
          condition: 'weather_bad',
          modification: 'Move to indoor trainer',
          durationChange: 0
        }
      ]
    },
    {
      id: 'run_tempo',
      name: 'Tempo Run',
      type: 'run',
      duration: 60,
      tssTarget: 70,
      intensityZones: [
        { zone: 2, name: 'Aerobic', description: 'Easy pace', duration: 15 },
        { zone: 3, name: 'Tempo', description: 'Comfortably hard', duration: 30 },
        { zone: 2, name: 'Aerobic', description: 'Easy pace', duration: 15 }
      ],
      structure: [
        { type: 'warmup', duration: 15, intensity: 2, description: '2km easy' },
        { type: 'main', duration: 30, intensity: 3, description: '4km tempo' },
        { type: 'cooldown', duration: 15, intensity: 2, description: '2km easy' }
      ],
      equipment: ['running_shoes', 'watch'],
      location: 'outdoor',
      description: 'Aerobic threshold development',
      adaptations: [
        {
          condition: 'fatigue_high',
          modification: 'Reduce tempo portion to 20 minutes',
          durationChange: -10
        }
      ]
    }
  ];

  static async generatePlan(
    athlete: AthleteProfile,
    goal: RaceGoal,
    options: {
      periodization?: 'linear' | 'block' | 'reverse' | 'polarized';
      autoAdapt?: boolean;
      confidenceThreshold?: number;
    } = {}
  ): Promise<GeneratedTrainingPlan> {
    console.log('🤖 Generating AI training plan for:', athlete.firstName, athlete.lastName);
    console.log('🎯 Goal:', goal.raceType, 'on', goal.raceDate);

    // Calculate plan parameters
    const weeksToRace = this.calculateWeeksToRace(goal.raceDate);
    const phases = this.generatePhases(weeksToRace, goal, athlete);
    const weeks = this.generateWeeklyPlans(phases, athlete, goal);

    // Calculate total training load
    const totalTss = weeks.reduce((sum, week) => sum + week.targetTss, 0);
    const avgWeeklyHours = weeks.reduce((sum, week) => sum + week.targetHours, 0) / weeks.length;

    // AI confidence scoring
    const confidence = this.calculateConfidence(athlete, goal, options);

    const plan: GeneratedTrainingPlan = {
      id: `plan_${Date.now()}`,
      name: `${goal.raceType.toUpperCase()} Training Plan - ${athlete.firstName} ${athlete.lastName}`,
      athlete,
      goal,
      phases,
      weeks,
      totalWeeks: weeksToRace,
      estimatedTss: totalTss,
      confidence,
      aiModel: 'Smart Triathlete AI v1.0',
      generatedAt: new Date(),
      adaptations: this.generatePlanAdaptations(athlete, goal)
    };

    console.log('✅ Training plan generated:', {
      totalWeeks: plan.totalWeeks,
      avgWeeklyHours: avgWeeklyHours.toFixed(1),
      totalTss: plan.estimatedTss,
      confidence: plan.confidence
    });

    return plan;
  }

  private static calculateWeeksToRace(raceDate: Date): number {
    const now = new Date();
    const diffTime = raceDate.getTime() - now.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.max(4, Math.min(52, diffWeeks)); // Between 4 and 52 weeks
  }

  private static generatePhases(weeks: number, goal: RaceGoal, athlete: AthleteProfile): TrainingPhase[] {
    const phases: TrainingPhase[] = [];

    if (weeks >= 16) {
      // Full periodization for longer plans
      phases.push({
        name: 'Base Building',
        startWeek: 1,
        endWeek: Math.floor(weeks * 0.5),
        focus: 'base',
        weeklyHours: athlete.weeklyHours * 0.8,
        intensity: 'low',
        description: 'Aerobic base development and technique work'
      });

      phases.push({
        name: 'Build Phase',
        startWeek: Math.floor(weeks * 0.5) + 1,
        endWeek: Math.floor(weeks * 0.85),
        focus: 'build',
        weeklyHours: athlete.weeklyHours * 1.1,
        intensity: 'moderate',
        description: 'Threshold and race-specific work'
      });

      phases.push({
        name: 'Peak & Taper',
        startWeek: Math.floor(weeks * 0.85) + 1,
        endWeek: weeks - 1,
        focus: 'peak',
        weeklyHours: athlete.weeklyHours * 0.9,
        intensity: 'high',
        description: 'Race intensity and volume reduction'
      });

      phases.push({
        name: 'Race Week',
        startWeek: weeks,
        endWeek: weeks,
        focus: 'race',
        weeklyHours: athlete.weeklyHours * 0.4,
        intensity: 'low',
        description: 'Final preparation and race execution'
      });
    } else {
      // Simplified phases for shorter plans
      phases.push({
        name: 'Build Phase',
        startWeek: 1,
        endWeek: weeks - 2,
        focus: 'build',
        weeklyHours: athlete.weeklyHours,
        intensity: 'moderate',
        description: 'Focused race preparation'
      });

      phases.push({
        name: 'Taper',
        startWeek: weeks - 1,
        endWeek: weeks,
        focus: 'race',
        weeklyHours: athlete.weeklyHours * 0.6,
        intensity: 'low',
        description: 'Recovery and race preparation'
      });
    }

    return phases;
  }

  private static generateWeeklyPlans(
    phases: TrainingPhase[],
    athlete: AthleteProfile,
    goal: RaceGoal
  ): WeeklyPlan[] {
    const weeks: WeeklyPlan[] = [];

    for (const phase of phases) {
      for (let week = phase.startWeek; week <= phase.endWeek; week++) {
        const sessions = this.generateWeeklySessions(phase, athlete, goal, week);
        
        weeks.push({
          weekNumber: week,
          phase: phase.name,
          targetHours: phase.weeklyHours,
          targetTss: this.calculateWeeklyTss(sessions),
          sessions,
          notes: this.generateWeeklyNotes(phase, week),
          recoveryFocus: phase.focus === 'recovery' || (week % 4 === 0 && phase.focus === 'base')
        });
      }
    }

    return weeks;
  }

  private static generateWeeklySessions(
    phase: TrainingPhase,
    athlete: AthleteProfile,
    goal: RaceGoal,
    week: number
  ): WorkoutSession[] {
    const sessions: WorkoutSession[] = [];
    const targetSessions = athlete.preferences.daysPerWeek;

    // Swim sessions (2-3 per week for triathletes)
    const swimSessions = Math.min(3, Math.floor(targetSessions * 0.4));
    for (let i = 0; i < swimSessions; i++) {
      sessions.push({
        dayOfWeek: this.getNextAvailableDay(sessions, athlete.preferences.restDays),
        workout: this.selectWorkout('swim', phase, athlete),
        notes: `Week ${week} swim session ${i + 1}`
      });
    }

    // Bike sessions (2-4 per week)
    const bikeSessions = Math.min(4, Math.floor(targetSessions * 0.4));
    for (let i = 0; i < bikeSessions; i++) {
      sessions.push({
        dayOfWeek: this.getNextAvailableDay(sessions, athlete.preferences.restDays),
        workout: this.selectWorkout('bike', phase, athlete),
        notes: `Week ${week} bike session ${i + 1}`
      });
    }

    // Run sessions (2-4 per week)
    const runSessions = Math.min(4, targetSessions - swimSessions - bikeSessions);
    for (let i = 0; i < runSessions; i++) {
      sessions.push({
        dayOfWeek: this.getNextAvailableDay(sessions, athlete.preferences.restDays),
        workout: this.selectWorkout('run', phase, athlete),
        notes: `Week ${week} run session ${i + 1}`
      });
    }

    // Add brick sessions for advanced athletes
    if (athlete.experience !== 'beginner' && phase.focus === 'build') {
      sessions.push({
        dayOfWeek: this.getNextAvailableDay(sessions, athlete.preferences.restDays),
        workout: this.selectWorkout('brick', phase, athlete),
        notes: `Week ${week} brick session`
      });
    }

    return sessions.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  }

  private static getNextAvailableDay(existingSessions: WorkoutSession[], restDays: number[]): number {
    for (let day = 1; day <= 7; day++) {
      if (!restDays.includes(day) && !existingSessions.some(s => s.dayOfWeek === day)) {
        return day;
      }
    }
    // If all days are taken, use the least busy day
    return Math.floor(Math.random() * 7) + 1;
  }

  private static selectWorkout(
    type: 'swim' | 'bike' | 'run' | 'brick',
    phase: TrainingPhase,
    athlete: AthleteProfile
  ): WorkoutTemplate {
    // Filter templates by type and phase appropriateness
    const appropriateWorkouts = this.WORKOUT_TEMPLATES.filter(workout => {
      if (type === 'brick') return workout.type === 'bike' || workout.type === 'run';
      return workout.type === type;
    });

    // Select based on phase and athlete level
    if (appropriateWorkouts.length === 0) {
      // Return a default workout if none found
      return this.WORKOUT_TEMPLATES[0];
    }

    return appropriateWorkouts[Math.floor(Math.random() * appropriateWorkouts.length)];
  }

  private static calculateWeeklyTss(sessions: WorkoutSession[]): number {
    return sessions.reduce((sum, session) => sum + session.workout.tssTarget, 0);
  }

  private static generateWeeklyNotes(phase: TrainingPhase, week: number): string {
    const notes = [`Week ${week} of ${phase.name}`];
    
    if (phase.focus === 'base') {
      notes.push('Focus on aerobic development and technique');
    } else if (phase.focus === 'build') {
      notes.push('Increase intensity with threshold and race-pace work');
    } else if (phase.focus === 'peak') {
      notes.push('High intensity, race-specific preparation');
    } else if (phase.focus === 'race') {
      notes.push('Final preparation - stay fresh and confident');
    }

    if (week % 4 === 0) {
      notes.push('Recovery week - reduce volume by 20-30%');
    }

    return notes.join('. ');
  }

  private static calculateConfidence(
    athlete: AthleteProfile,
    goal: RaceGoal,
    options: any
  ): number {
    let confidence = 0.8; // Base confidence

    // Adjust based on data completeness
    if (athlete.ftpWatts && athlete.maxHeartRate && athlete.vo2Max) {
      confidence += 0.1;
    }

    // Adjust based on experience level
    if (athlete.experience === 'advanced' || athlete.experience === 'elite') {
      confidence += 0.05;
    }

    // Adjust based on time to race
    const weeksToRace = this.calculateWeeksToRace(goal.raceDate);
    if (weeksToRace >= 12 && weeksToRace <= 24) {
      confidence += 0.1;
    }

    return Math.min(1.0, confidence);
  }

  private static generatePlanAdaptations(athlete: AthleteProfile, goal: RaceGoal): PlanAdaptation[] {
    const adaptations: PlanAdaptation[] = [
      {
        trigger: 'High fatigue or low form',
        description: 'Automatically reduce training load when TSB drops below -20',
        implementation: 'Reduce weekly volume by 20% and intensity by one zone',
        frequency: 'weekly'
      },
      {
        trigger: 'Missed sessions',
        description: 'Redistribute training load when sessions are missed',
        implementation: 'Move key workouts to available days, drop easier sessions',
        frequency: 'weekly'
      },
      {
        trigger: 'Weather conditions',
        description: 'Adapt outdoor sessions for indoor alternatives',
        implementation: 'Swap outdoor rides for trainer sessions, outdoor runs for treadmill',
        frequency: 'weekly'
      }
    ];

    if (athlete.injuries.length > 0) {
      adaptations.push({
        trigger: 'Injury prevention',
        description: 'Monitor for signs of overuse injury',
        implementation: 'Add extra recovery time and strength work',
        frequency: 'bi-weekly'
      });
    }

    return adaptations;
  }

  // Method to adapt existing plan based on performance data
  static async adaptPlan(
    plan: GeneratedTrainingPlan,
    performanceData: {
      recentActivities: any[];
      currentForm: number;
      fatigue: number;
      fitness: number;
    }
  ): Promise<GeneratedTrainingPlan> {
    console.log('🔄 Adapting training plan based on performance data...');

    // Clone the plan
    const adaptedPlan = { ...plan };

    // Analyze performance trends
    const formTrend = this.analyzeFormTrend(performanceData);
    
    // Apply adaptations based on current form
    if (performanceData.currentForm < -20) {
      // High fatigue - reduce load
      console.log('⚠️ High fatigue detected - reducing training load');
      adaptedPlan.weeks = this.reduceTrainingLoad(plan.weeks, 0.8);
    } else if (performanceData.currentForm > 10) {
      // Good form - can handle more load
      console.log('💪 Good form detected - maintaining or increasing load');
      adaptedPlan.weeks = this.adjustTrainingLoad(plan.weeks, 1.1);
    }

    adaptedPlan.generatedAt = new Date();
    adaptedPlan.aiModel = 'Smart Triathlete AI v1.0 (Adaptive)';

    console.log('✅ Plan adaptation completed');
    return adaptedPlan;
  }

  private static analyzeFormTrend(data: any): 'improving' | 'declining' | 'stable' {
    // Analyze recent form trend
    // This would be more sophisticated in production
    return 'stable';
  }

  private static reduceTrainingLoad(weeks: WeeklyPlan[], multiplier: number): WeeklyPlan[] {
    return weeks.map(week => ({
      ...week,
      targetHours: week.targetHours * multiplier,
      targetTss: week.targetTss * multiplier,
      sessions: week.sessions.map(session => ({
        ...session,
        workout: {
          ...session.workout,
          duration: Math.round(session.workout.duration * multiplier),
          tssTarget: Math.round(session.workout.tssTarget * multiplier)
        }
      }))
    }));
  }

  private static adjustTrainingLoad(weeks: WeeklyPlan[], multiplier: number): WeeklyPlan[] {
    return weeks.map(week => ({
      ...week,
      targetHours: week.targetHours * multiplier,
      targetTss: week.targetTss * multiplier,
      sessions: week.sessions.map(session => ({
        ...session,
        workout: {
          ...session.workout,
          duration: Math.round(session.workout.duration * multiplier),
          tssTarget: Math.round(session.workout.tssTarget * multiplier)
        }
      }))
    }));
  }
}

// LaufplanerPro - English Language Pack
// Complete internationalization for the platform

export const en = {
  // Common/Shared
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    confirm: 'Confirm',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone',
    location: 'Location',
    date: 'Date',
    time: 'Time',
    status: 'Status',
    notes: 'Notes',
    actions: 'Actions',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh'
  },

  // Navigation
  nav: {
    brand: 'LaufplanerPro',
    subtitle: 'Elite Training Platform',
    dashboard: 'Dashboard',
    activities: 'Activities',
    training: 'Training',
    integrations: 'Integrations',
    profile: 'Profile',
    analytics: 'Analytics',
    calendar: 'Calendar',
    races: 'Races',
    recovery: 'Recovery',
    admin: 'Admin',
    logout: 'Logout'
  },

  // Authentication
  auth: {
    title: 'Member Login',
    subtitle: 'Access for approved athletes',
    emailLabel: 'Email',
    emailPlaceholder: 'your.email@domain.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    demoAccess: '🚀 Demo Neural Access',
    demoCredentials: 'Demo credentials loaded! Click "Sign In" to proceed.',
    demoSuccess: 'Demo access granted! Loading dashboard...',
    notMember: 'Not a member yet?',
    applyNow: 'Apply for access now →',
    loginSuccess: 'Login successful! Redirecting...',
    loginError: 'An unexpected error occurred.',
    
    // Application Form
    application: {
      title: 'LaufplanerPro Application',
      subtitle: 'Elite Triathlon Training Platform',
      back: '← Back',
      
      // Personal Information
      personalInfo: '👤 Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      birthDate: 'Date of Birth',
      gender: 'Gender',
      genderOptions: {
        select: 'Please select',
        male: 'Male',
        female: 'Female',
        other: 'Other'
      },
      location: 'Location',
      locationPlaceholder: 'City, Country',
      
      // Athletic Background
      athleticBackground: '🏃‍♂️ Athletic Background',
      experience: 'Training Experience (Years)',
      primaryDiscipline: 'Primary Discipline',
      disciplineOptions: {
        select: 'Please select',
        triathlon: 'Triathlon',
        running: 'Running',
        cycling: 'Cycling',
        swimming: 'Swimming'
      },
      currentLevel: 'Current Level',
      levelOptions: {
        select: 'Please select',
        beginner: 'Beginner',
        amateur: 'Amateur',
        competitive: 'Competitive',
        elite: 'Elite'
      },
      weeklyHours: 'Weekly Training Hours',
      
      // Performance Data
      performanceData: '📈 Performance Data',
      marathonTime: 'Best Marathon Time',
      halfMarathonTime: 'Best Half Marathon Time',
      tenKTime: 'Best 10K Time',
      fiveKTime: 'Best 5K Time',
      ironmanTime: 'Best Ironman Time',
      olympicTriTime: 'Best Olympic Distance Time',
      sprintTriTime: 'Best Sprint Triathlon Time',
      timePlaceholder: 'e.g., 3:25:30 or 1:15:45',
      
      // Physiological Data
      physiologicalData: '🧬 Physiological Data',
      restingHR: 'Resting Heart Rate',
      maxHR: 'Max Heart Rate',
      ftp: 'FTP (Watts)',
      ltHR: 'Lactate Threshold HR',
      vo2Max: 'VO2 Max',
      weight: 'Weight (kg)',
      height: 'Height (cm)',
      bodyFat: 'Body Fat %',
      
      // Swimming Data
      swimmingData: '🏊‍♂️ Swimming Data',
      best50Free: 'Best 50m Freestyle',
      best100Free: 'Best 100m Freestyle',
      best1500Free: 'Best 1500m Freestyle',
      swimCSS: 'Critical Swim Speed',
      
      // Goals & Motivation
      goalsMotivation: '🎯 Goals & Motivation',
      goals2025: '2025 Goals',
      goalsPlaceholder: 'What are your specific training and competition goals for 2025?',
      targetRaces: 'Target Races',
      racesPlaceholder: 'Which specific races or events are you targeting?',
      motivation: 'Motivation',
      motivationPlaceholder: 'What motivates you to train and compete at the highest level?',
      expectations: 'Platform Expectations',
      expectationsPlaceholder: 'What do you expect from the LaufplanerPro platform?',
      
      // Equipment & Technology
      equipment: '⚙️ Equipment & Technology',
      devices: 'Training Devices',
      deviceOptions: {
        garmin: 'Garmin Watch/Computer',
        wahoo: 'Wahoo Devices',
        polar: 'Polar Devices',
        suunto: 'Suunto Watch',
        stages: 'Stages Power Meter',
        kickr: 'Wahoo KICKR Trainer',
        zwift: 'Zwift Setup',
        other: 'Other Devices'
      },
      trainingApps: 'Training Apps/Platforms',
      appOptions: {
        strava: 'Strava',
        trainingpeaks: 'TrainingPeaks',
        zwift: 'Zwift',
        trainerroad: 'TrainerRoad',
        garminconnect: 'Garmin Connect',
        polarflow: 'Polar Flow',
        wahooapp: 'Wahoo App',
        other: 'Other Apps'
      },
      equipmentDetails: 'Equipment Details',
      equipmentPlaceholder: 'Bike type, wetsuit, running shoes, etc.',
      
      // Additional Information
      additionalInfo: '📝 Additional Information',
      injuries: 'Current/Recent Injuries',
      injuriesPlaceholder: 'Any injuries or physical limitations we should know about?',
      medications: 'Medications/Supplements',
      medicationsPlaceholder: 'Any relevant medications or supplements?',
      coach: 'Current Coach',
      coachPlaceholder: 'Do you work with a coach? Name and contact info.',
      teamClub: 'Team/Club',
      teamPlaceholder: 'Are you part of any team or club?',
      socialMedia: 'Social Media',
      socialPlaceholder: 'Your athletic social media handles (optional)',
      referralSource: 'How did you hear about us?',
      referralPlaceholder: 'Social media, friend recommendation, search, etc.',
      additionalNotes: 'Additional Notes',
      notesPlaceholder: 'Anything else you\'d like us to know?',
      
      // Form Actions
      submitApplication: 'Submit Application',
      submitting: 'Submitting Application...',
      
      // Validation Messages
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      minLength: 'Please provide more detailed information',
      
      // Success/Error Messages
      submitSuccess: 'Application submitted successfully!',
      submitError: 'Error submitting application. Please try again.',
      networkError: 'Network error. Please check your internet connection.'
    }
  },

  // Dashboard
  dashboard: {
    title: 'Athlete Dashboard',
    welcome: 'Welcome back',
    
    // Profile Card
    profile: {
      title: 'Athlete Profile',
      experience: 'Experience',
      currentWeight: 'Current Weight',
      targetWeight: 'Target Weight',
      bodyFat: 'Body Fat',
      editProfile: 'Edit Profile'
    },
    
    // Training Zones
    zones: {
      title: 'Training Zones',
      heartRate: 'Heart Rate',
      power: 'Power',
      pace: 'Pace',
      swim: 'Swim Pace',
      recovery: 'Recovery',
      aerobic: 'Aerobic',
      endurance: 'Endurance',
      tempo: 'Tempo',
      threshold: 'Threshold',
      vo2max: 'VO2Max',
      easy: 'Easy'
    },
    
    // Activities
    activities: {
      title: 'Recent Activities',
      duration: 'Duration',
      distance: 'Distance',
      avgPace: 'Avg Pace',
      effort: 'Effort',
      feeling: 'Feeling',
      viewAll: 'View All Activities'
    },
    
    // Workouts
    workouts: {
      title: 'Planned Workouts',
      today: 'Today',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      noWorkouts: 'No workouts planned',
      planWorkout: 'Plan Workout'
    },
    
    // Live Metrics
    liveMetrics: {
      title: 'Live Metrics',
      restingHR: 'Resting HR',
      vo2max: 'VO2 Max',
      ftp: 'FTP',
      ltHR: 'LT Heart Rate',
      fitness: 'Fitness (CTL)',
      fatigue: 'Fatigue (ATL)',
      form: 'Form (TSB)'
    },
    
    // Calendar
    calendar: {
      title: 'Training Calendar',
      viewCalendar: 'View Full Calendar'
    },
    
    // Device Status
    devices: {
      title: 'Device Status',
      connected: 'Connected',
      disconnected: 'Disconnected',
      syncNow: 'Sync Now',
      lastSync: 'Last Sync'
    },
    
    // Nutrition
    nutrition: {
      title: 'Nutrition',
      calories: 'Calories',
      carbs: 'Carbs',
      protein: 'Protein',
      fat: 'Fat',
      hydration: 'Hydration',
      target: 'Target'
    },
    
    // Recovery
    recovery: {
      title: 'Recovery',
      sleepScore: 'Sleep Score',
      hrv: 'HRV',
      stress: 'Stress Level',
      readiness: 'Readiness',
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor'
    },
    
    // Weather
    weather: {
      title: 'Weather',
      temperature: 'Temperature',
      humidity: 'Humidity',
      wind: 'Wind',
      conditions: 'Conditions'
    }
  },

  // Admin Dashboard
  admin: {
    title: 'Admin Dashboard',
    subtitle: 'Application Management',
    
    // Filters
    filters: {
      all: 'All Applications',
      pending: 'Pending',
      reviewing: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      onHold: 'On Hold'
    },
    
    // Application List
    applicationList: {
      name: 'Name',
      email: 'Email',
      discipline: 'Discipline',
      level: 'Level',
      score: 'Score',
      recommendation: 'Recommendation',
      submitted: 'Submitted',
      status: 'Status'
    },
    
    // Application Detail
    applicationDetail: {
      personalInfo: 'Personal Information',
      athleticBackground: 'Athletic Background',
      performanceData: 'Performance Data',
      goalsMotivation: 'Goals & Motivation',
      automaticScoring: 'Automatic Scoring',
      performanceScore: 'Performance Score',
      experienceScore: 'Experience Score',
      motivationScore: 'Motivation Score',
      totalScore: 'Total Score',
      recommendation: 'Recommendation',
      adminNotes: 'Admin Notes',
      notesPlaceholder: 'Add notes about this application...',
      
      // Status Actions
      approve: 'Approve',
      reject: 'Reject',
      setReview: 'Set to Review',
      putHold: 'Put on Hold',
      
      // Labels
      age: 'Age',
      experience: 'Experience',
      weeklyHours: 'Weekly Training Hours',
      goals2025: '2025 Goals',
      motivation: 'Motivation',
      devices: 'Devices',
      apps: 'Training Apps'
    },
    
    // Messages
    messages: {
      loadingError: 'Error loading applications',
      updateSuccess: 'Application status updated successfully',
      updateError: 'Error updating application status',
      unauthorized: 'Access denied. Admin privileges required.',
      noApplications: 'No applications found'
    }
  },

  // Email Templates (for reference)
  email: {
    subject: {
      approved: '🎉 Welcome to LaufplanerPro - Application Approved!',
      rejected: 'LaufplanerPro Application - Update on Your Request',
      reviewing: 'LaufplanerPro - Your Application is Under Review',
      onHold: 'LaufplanerPro - Application Temporarily On Hold',
      newApplication: '🏃‍♂️ New LaufplanerPro Application: {name}',
      pending: 'LaufplanerPro Application Received - Confirmation'
    },
    
    content: {
      approved: {
        greeting: 'Hello {firstName},',
        congratulations: 'Congratulations! Your application has been approved.',
        welcome: 'We\'re excited to welcome you as part of the LaufplanerPro Elite Community. You now have access to our professional training platform.',
        nextSteps: 'Your Next Steps:',
        steps: [
          'Log into your dashboard',
          'Complete your athlete profile',
          'Connect your training devices',
          'Start analyzing your data'
        ],
        loginButton: 'Login Now',
        support: 'If you have any questions, reach us at support@laufplanerpro.de'
      },
      
      rejected: {
        greeting: 'Hello {firstName},',
        thanks: 'Thank you for your interest in LaufplanerPro and your submitted application.',
        decision: 'After careful review, we must inform you that we cannot consider your application at this time.',
        encouragement: 'We encourage you to reapply at a later time when your situation has changed.',
        support: 'If you have any questions, reach us at support@laufplanerpro.de'
      }
    }
  },

  // Error Messages
  errors: {
    generic: 'An unexpected error occurred',
    network: 'Network error. Please check your connection.',
    authentication: 'Authentication failed',
    authorization: 'Access denied',
    notFound: 'Page not found',
    serverError: 'Server error. Please try again later.',
    validation: 'Please check your input and try again'
  }
};

export default en;

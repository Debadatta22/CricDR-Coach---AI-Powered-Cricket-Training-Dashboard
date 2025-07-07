export interface User {
  id: string;
  name: string;
  age: number;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  weeklyHours: number;
  fitnessGoal: string;
  createdAt: Date;
}

export interface TrainingPlan {
  id: string;
  userId: string;
  drills: Drill[];
  weeklyTargets: WeeklyTarget[];
  schedule: DaySchedule[];
  createdAt: Date;
}

export interface Drill {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Batting' | 'Bowling' | 'Fielding' | 'Fitness';
}

export interface WeeklyTarget {
  metric: string;
  current: number;
  target: number;
  unit: string;
}

export interface DaySchedule {
  day: string;
  activities: string[];
  duration: number;
}

export interface ProgressEntry {
  id: string;
  userId: string;
  date: Date;
  netHours: number;
  runsScored?: number;
  wicketsTaken?: number;
  catches?: number;
  drillsCompleted: number;
  moodRating: number;
  fatigueLevel: number;
  selfRating: number;
  notes: string;
}

export interface CoachFeedback {
  id: string;
  userId: string;
  feedback: string;
  suggestions: string[];
  focusAreas: string[];
  motivationalQuote: string;
  createdAt: Date;
}

export interface PerformanceMetrics {
  consistency: number;
  discipline: number;
  improvement: number;
  weeklyTrend: number;
}

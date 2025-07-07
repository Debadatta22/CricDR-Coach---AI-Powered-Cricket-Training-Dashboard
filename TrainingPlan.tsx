import React, { useState, useEffect } from 'react';
import { Target, Clock, Zap, Calendar, RefreshCw } from 'lucide-react';
import { User, TrainingPlan as TrainingPlanType } from '../types';
import { storage } from '../utils/storage';
import { aiService } from '../utils/aiService';

interface TrainingPlanProps {
  user: User | null;
}

const TrainingPlan: React.FC<TrainingPlanProps> = ({ user }) => {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlanType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const savedPlan = storage.getTrainingPlan();
    if (savedPlan) {
      setTrainingPlan(savedPlan);
    }
  }, []);

  const generatePlan = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPlan = aiService.generateTrainingPlan(user);
    setTrainingPlan(newPlan);
    storage.saveTrainingPlan(newPlan);
    setIsGenerating(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Profile First</h2>
            <p className="text-gray-600">Please complete your profile to generate a personalized training plan.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Training Plan</h2>
            <p className="text-gray-600">Our AI coach is creating a personalized plan based on your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trainingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Target className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start Training?</h2>
            <p className="text-gray-600 mb-6">
              Let our AI coach create a personalized training plan tailored to your goals and skill level.
            </p>
            <button
              onClick={generatePlan}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Zap className="w-5 h-5" />
              <span>Generate My Training Plan</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Batting': return 'bg-blue-100 text-blue-800';
      case 'Bowling': return 'bg-purple-100 text-purple-800';
      case 'Fielding': return 'bg-orange-100 text-orange-800';
      case 'Fitness': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Training Plan</h2>
              <p className="text-gray-600">Personalized for {user.name} • {user.role}</p>
            </div>
            <button
              onClick={generatePlan}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Weekly Targets */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 text-emerald-500 mr-2" />
            Weekly Targets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trainingPlan.weeklyTargets.map((target, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">{target.metric}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-emerald-600">{target.target}</span>
                  <span className="text-sm text-gray-500">{target.unit}</span>
                </div>
                <div className="mt-2 bg-white rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(target.current / target.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Drills */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 text-emerald-500 mr-2" />
            Training Drills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingPlan.drills.map((drill) => (
              <div key={drill.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">{drill.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>
                      {drill.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(drill.category)}`}>
                      {drill.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{drill.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{drill.duration} minutes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 text-emerald-500 mr-2" />
            Weekly Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {trainingPlan.schedule.map((day) => (
              <div key={day.day} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">{day.day}</h4>
                <div className="space-y-2">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {activity}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center text-sm text-emerald-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{day.duration} hours</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlan;

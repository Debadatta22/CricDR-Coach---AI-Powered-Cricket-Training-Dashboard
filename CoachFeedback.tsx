import React, { useState, useEffect } from 'react';
import { MessageCircle, Brain, Target, TrendingUp, RefreshCw, Lightbulb } from 'lucide-react';
import { User, ProgressEntry, CoachFeedback as CoachFeedbackType } from '../types';
import { storage } from '../utils/storage';
import { aiService } from '../utils/aiService';

interface CoachFeedbackProps {
  user: User | null;
}

const CoachFeedback: React.FC<CoachFeedbackProps> = ({ user }) => {
  const [feedback, setFeedback] = useState<CoachFeedbackType | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const savedFeedback = storage.getFeedback();
    const entries = storage.getProgress();
    
    if (savedFeedback) {
      setFeedback(savedFeedback);
    }
    setProgressEntries(entries);
  }, []);

  const generateFeedback = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const metrics = aiService.calculateMetrics(progressEntries);
    const newFeedback = aiService.generateFeedback(user, progressEntries, metrics);
    
    setFeedback(newFeedback);
    storage.saveFeedback(newFeedback);
    setIsGenerating(false);
  };

  const getMetrics = () => {
    return aiService.calculateMetrics(progressEntries);
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-100';
    if (value >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Profile First</h2>
          <p className="text-gray-600">Please complete your profile to get personalized coaching feedback.</p>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Performance</h2>
          <p className="text-gray-600">Our AI coach is reviewing your progress and preparing personalized feedback...</p>
        </div>
      </div>
    );
  }

  const metrics = getMetrics();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Coach Feedback</h2>
            <p className="text-gray-600">Personalized insights and recommendations for {user.name}</p>
          </div>
          <button
            onClick={generateFeedback}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Feedback</span>
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`rounded-lg p-4 ${getMetricBgColor(metrics.consistency)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Consistency</h4>
                <div className={`text-2xl font-bold ${getMetricColor(metrics.consistency)}`}>
                  {Math.round(metrics.consistency)}%
                </div>
              </div>
              <Target className={`w-8 h-8 ${getMetricColor(metrics.consistency)}`} />
            </div>
          </div>
          
          <div className={`rounded-lg p-4 ${getMetricBgColor(metrics.discipline)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Discipline</h4>
                <div className={`text-2xl font-bold ${getMetricColor(metrics.discipline)}`}>
                  {Math.round(metrics.discipline)}%
                </div>
              </div>
              <Brain className={`w-8 h-8 ${getMetricColor(metrics.discipline)}`} />
            </div>
          </div>
          
          <div className={`rounded-lg p-4 ${getMetricBgColor(Math.abs(metrics.improvement) * 10)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Improvement</h4>
                <div className={`text-2xl font-bold ${metrics.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.improvement >= 0 ? '+' : ''}{Math.round(metrics.improvement)}%
                </div>
              </div>
              <TrendingUp className={`w-8 h-8 ${metrics.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          
          <div className={`rounded-lg p-4 ${getMetricBgColor(Math.abs(metrics.weeklyTrend) * 20)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Weekly Trend</h4>
                <div className={`text-2xl font-bold ${metrics.weeklyTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.weeklyTrend >= 0 ? '+' : ''}{Math.round(metrics.weeklyTrend)}
                </div>
              </div>
              <TrendingUp className={`w-8 h-8 ${metrics.weeklyTrend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Feedback */}
      {feedback && (
        <>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 text-emerald-500 mr-2" />
              Personal Feedback
            </h3>
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6">
              <p className="text-gray-800 text-lg leading-relaxed">{feedback.feedback}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 text-emerald-500 mr-2" />
                Suggestions
              </h3>
              <ul className="space-y-3">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 text-emerald-500 mr-2" />
                Focus Areas
              </h3>
              <div className="space-y-2">
                {feedback.focusAreas.map((area, index) => (
                  <span
                    key={index}
                    className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Motivation</h3>
            <blockquote className="text-center">
              <p className="text-xl italic text-gray-800 mb-4">"{feedback.motivationalQuote}"</p>
              <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
            </blockquote>
          </div>
        </>
      )}

      {/* Get Started */}
      {!feedback && progressEntries.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <MessageCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Coaching?</h3>
          <p className="text-gray-600 mb-6">
            Start tracking your progress to get personalized feedback and coaching insights.
          </p>
          <button
            onClick={generateFeedback}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <Brain className="w-5 h-5" />
            <span>Get My First Feedback</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CoachFeedback;

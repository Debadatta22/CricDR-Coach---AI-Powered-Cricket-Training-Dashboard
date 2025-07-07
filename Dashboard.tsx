import React from 'react';
import { User, Target, TrendingUp, Calendar, Award, Clock, ExternalLink, Globe, Users, Linkedin, Instagram, Github, Mail, HdmiPort as Portfolio, ArrowRight, ChevronDown, Info } from 'lucide-react';
import { User as UserType, ProgressEntry } from '../types';
import { storage } from '../utils/storage';
import { aiService } from '../utils/aiService';

interface DashboardProps {
  user: UserType | null;
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onTabChange }) => {
  const progressEntries = storage.getProgress();
  const trainingPlan = storage.getTrainingPlan();
  const recentEntries = progressEntries.slice(-7);
  const metrics = aiService.calculateMetrics(progressEntries);

  const [showPlatforms, setShowPlatforms] = React.useState(false);
  const [showDesignerInfo, setShowDesignerInfo] = React.useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getTotalTrainingHours = () => {
    return progressEntries.reduce((total, entry) => total + entry.netHours, 0);
  };

  const getAverageRating = () => {
    if (progressEntries.length === 0) return 0;
    const total = progressEntries.reduce((sum, entry) => sum + entry.selfRating, 0);
    return Math.round((total / progressEntries.length) * 10) / 10;
  };

  const getStreakDays = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const hasTraining = progressEntries.some(entry => 
        new Date(entry.date).toDateString() === dateStr && entry.netHours > 0
      );
      
      if (hasTraining) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const localPlatforms = [
    {
      name: "Ludimos",
      description: "Your 360° cricket platform. From session planning to player development. Ludimos provides you with coaching & analytical tools to develop your players.",
      url: "https://www.ludimos.com/"
    },
    {
      name: "StanceBeam",
      description: "Get data-driven insights & improve your cricket game with StanceBeam Striker. Buy our smart cricket bat sensor today & unleash your cricket potential!",
      url: "https://www.stancebeam.com/"
    },
    {
      name: "Catapult",
      description: "Comprehensive data & video analysis solutions to capture, analyze, plan, and share every aspect of team & player performance.",
      url: "https://www.catapult.com/sports/cricket"
    },
    {
      name: "CricketConnection",
      description: "Connecting Cricketers, Coaches, and Clubs – Elevating Your Game, One Session at a Time. Join our nationwide platform for personalized coaching!",
      url: "https://cricketconnections.com/"
    },
    {
      name: "Criconet",
      description: "India's premier online cricket club, where fans, players, coaches, scouts, and cricket enthusiasts unite to create a community that lives and breathes cricket.",
      url: "https://www.criconet.com/"
    }
  ];

  const communityPlatforms = [
    {
      name: "Play Cricket ~ Australia",
      description: "Official Australian cricket community platform with coaching resources and development programs.",
      url: "https://play.cricket.com.au/community/coach/resources"
    },
    {
      name: "ICC",
      description: "International Cricket Council's official training and education resources for cricket development worldwide.",
      url: "https://www.icc-cricket.com/about/development/training-and-education"
    },
    {
      name: "NCA",
      description: "National Cricket Academy - Premier cricket training institution with world-class coaching facilities.",
      url: "https://nationalcricketsacademy.com/"
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 relative overflow-hidden">
        {/* Cricket Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-600 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-600 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-600 rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-emerald-600 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 p-6">
          {/* Welcome Header with Images */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl shadow-lg p-8 text-white mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              {/* Left Image */}
              <div className="hidden md:block w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white border-opacity-30">
                <img 
                  src="/images/rahul-dravid.png" 
                  alt="Cricket Coach" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Center Content */}
              <div className="text-center flex-1 mx-8">
                <Target className="w-16 h-16 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Welcome to CricDR Coach</h1>
                <p className="text-emerald-100 text-lg">Your AI-powered cricket training companion</p>
              </div>
              
              {/* Right Image */}
              <div className="hidden md:block w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white border-opacity-30">
                <img 
                  src="/images/cricket-training.png" 
                  alt="Cricket Training" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <button
              onClick={() => onTabChange('profile')}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <User className="w-12 h-12 text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Profile</h3>
              <p className="text-gray-600 mb-4">Tell us about your cricket journey and goals</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-0 group-hover:w-1/4 transition-all duration-500"></div>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-500 mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button
              onClick={() => onTabChange('training')}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <Target className="w-12 h-12 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Training Plan</h3>
              <p className="text-gray-600 mb-4">AI-generated personalized training program</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-0 group-hover:w-2/4 transition-all duration-500"></div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-500 mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button
              onClick={() => onTabChange('progress')}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600 mb-4">Monitor your improvement with detailed analytics</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-0 group-hover:w-3/4 transition-all duration-500"></div>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-500 mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative">
              <button
                onClick={() => setShowPlatforms(!showPlatforms)}
                className="w-full"
              >
                <Globe className="w-12 h-12 text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Platforms</h3>
                <p className="text-gray-600 mb-4">Explore external cricket training platforms</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full w-full transition-all duration-500"></div>
                </div>
                <ChevronDown className={`w-5 h-5 text-orange-500 mx-auto mt-3 transition-transform ${showPlatforms ? 'rotate-180' : ''}`} />
              </button>

              {showPlatforms && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 max-h-96 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Globe className="w-5 h-5 text-emerald-500 mr-2" />
                        Local Platforms
                      </h4>
                      <div className="space-y-3">
                        {localPlatforms.map((platform, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900">{platform.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">{platform.description}</p>
                              </div>
                              <a
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-3 text-emerald-500 hover:text-emerald-600 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Users className="w-5 h-5 text-blue-500 mr-2" />
                        Community Platforms
                      </h4>
                      <div className="space-y-3">
                        {communityPlatforms.map((platform, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900">{platform.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">{platform.description}</p>
                              </div>
                              <a
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-3 text-blue-500 hover:text-blue-600 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Designer Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mt-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Designed By</h3>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-emerald-500">
                    <img 
                      src="/images/debadatta-rout.jpg" 
                      alt="Debadatta Rout" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setShowDesignerInfo(!showDesignerInfo)}
                    className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                    title="Tap to view more info"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
                    Tap to view
                  </div>
                </div>
              </div>

              <h4 className="text-xl font-semibold text-gray-900 mb-2">Debadatta Rout</h4>
              
              {showDesignerInfo && (
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6 mb-6 text-left">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    I'm Debadatta Rout, a final-year B.Tech Computer Science Engineering student at C.V. Raman Global University. 
                    Passionate about frontend web development, I combined my skills and internship experience to build CricDR—a 
                    beginner-friendly cricket-focused website and app.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    I developed a Personalized Cricket Player Training Dashboard as part of my CricDR Coach project—a virtual coaching 
                    platform for beginner cricketers. It allows users to input their role, skills, and goals, and uses AI to generate 
                    customized training plans, performance feedback, and growth insights. The platform also visualizes progress through 
                    interactive charts, making it an engaging and intelligent tool for self-paced cricket improvement.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You can explore my CricDR website—a beginner-friendly, all-in-one cricket platform. It offers AI-powered assistants 
                    (including custom-built agents), learning resources (videos and articles), live scores, updates from cricket boards 
                    and leagues, shopping options, and more. Visit using the link below.
                  </p>
                </div>
              )}

              <div className="flex justify-center space-x-4 mb-6">
                <a
                  href="https://dazzling-parfait-1076ae.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <Portfolio className="w-5 h-5" />
                  <span>Portfolio</span>
                </a>
                
                <a
                  href="https://lambent-fox-9d6931.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <Globe className="w-5 h-5" />
                  <span>CricDR Official</span>
                </a>
              </div>

              <div>
                <h5 className="text-lg font-semibold text-gray-900 mb-4">Follow Me At:</h5>
                <div className="flex justify-center space-x-6">
                  <a
                    href="http://www.linkedin.com/in/debadatta-rout-454935341"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors transform hover:scale-110"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-8 h-8" />
                  </a>
                  <a
                    href="https://www.instagram.com/debadatta22rout?igsh=azJyb3N1b3k5Y2Qw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700 transition-colors transform hover:scale-110"
                    title="Instagram"
                  >
                    <Instagram className="w-8 h-8" />
                  </a>
                  <a
                    href="https://github.com/Debadatta22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-gray-900 transition-colors transform hover:scale-110"
                    title="GitHub"
                  >
                    <Github className="w-8 h-8" />
                  </a>
                  <a
                    href="mailto:routdebadatta22@gmail.com"
                    className="text-red-600 hover:text-red-700 transition-colors transform hover:scale-110"
                    title="Email"
                  >
                    <Mail className="w-8 h-8" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 relative overflow-hidden">
      {/* Cricket Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-600 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-blue-600 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-600 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-emerald-600 rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10 p-6">
        {/* Welcome Header with Images */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10 flex items-center justify-between">
            {/* Left Image */}
            <div className="hidden md:block w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white border-opacity-30">
              <img 
                src="/images/rahul-dravid.png" 
                alt="Cricket Coach" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Center Content */}
            <div className="text-center flex-1 mx-8">
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, {user.name}! 🏏
              </h1>
              <p className="text-emerald-100 text-lg">
                Ready to level up your cricket game today?
              </p>
            </div>
            
            {/* Right Image */}
            <div className="hidden md:block w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white border-opacity-30">
              <img 
                src="/images/cricket-training.png" 
                alt="Cricket Training" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Streak Counter */}
            <div className="absolute top-4 right-4 text-right">
              <div className="text-2xl font-bold">{getStreakDays()}</div>
              <div className="text-emerald-100 text-sm">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Training</h3>
                <div className="text-2xl font-bold text-emerald-600">
                  {getTotalTrainingHours()}h
                </div>
              </div>
              <Clock className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Avg Rating</h3>
                <div className="text-2xl font-bold text-blue-600">
                  {getAverageRating()}/10
                </div>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Consistency</h3>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(metrics.consistency)}%
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sessions</h3>
                <div className="text-2xl font-bold text-orange-600">
                  {progressEntries.length}
                </div>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Today's Plan */}
        {trainingPlan && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 text-emerald-500 mr-2" />
              Today's Training Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainingPlan.drills.slice(0, 3).map((drill) => (
                <div key={drill.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">{drill.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{drill.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{drill.duration} min</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      drill.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      drill.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {drill.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Progress */}
        {recentEntries.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
              This Week's Progress
            </h3>
            <div className="space-y-3">
              {recentEntries.slice(-5).map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{entry.netHours}h</span>
                    <span>{entry.drillsCompleted} drills</span>
                    <span className="text-emerald-600 font-medium">
                      {entry.selfRating}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => onTabChange('training')}
              className="p-4 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors text-left group"
            >
              <Target className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-gray-900">Start Training</h4>
              <p className="text-sm text-gray-600">Begin today's training session</p>
            </button>
            
            <button 
              onClick={() => onTabChange('progress')}
              className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left group"
            >
              <Calendar className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-gray-900">Log Progress</h4>
              <p className="text-sm text-gray-600">Record your training session</p>
            </button>
            
            <button 
              onClick={() => onTabChange('feedback')}
              className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left group"
            >
              <TrendingUp className="w-6 h-6 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-600">Check your performance metrics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

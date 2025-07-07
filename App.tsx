import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import TrainingPlan from './components/TrainingPlan';
import ProgressTracker from './components/ProgressTracker';
import CoachFeedback from './components/CoachFeedback';
import ProgressCharts from './components/ProgressCharts';
import { User } from './types';
import { storage } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard user={user} onTabChange={setActiveTab} />;
      case 'profile':
        return <UserProfile onUserUpdate={handleUserUpdate} />;
      case 'training':
        return <TrainingPlan user={user} />;
      case 'progress':
        return (
          <div className="space-y-6 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-6">
            <ProgressTracker user={user} />
            <ProgressCharts progressEntries={storage.getProgress()} />
          </div>
        );
      case 'feedback':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-6">
            <CoachFeedback user={user} />
          </div>
        );
      default:
        return <Dashboard user={user} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

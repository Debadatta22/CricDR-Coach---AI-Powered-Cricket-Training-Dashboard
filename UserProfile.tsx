import React, { useState, useEffect } from 'react';
import { User, Save, UserCheck } from 'lucide-react';
import { User as UserType } from '../types';
import { storage } from '../utils/storage';

interface UserProfileProps {
  onUserUpdate: (user: UserType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onUserUpdate }) => {
  const [user, setUser] = useState<UserType>({
    id: '',
    name: '',
    age: 16,
    role: 'Batsman',
    skillLevel: 'Beginner',
    weeklyHours: 10,
    fitnessGoal: '',
    createdAt: new Date()
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      id: user.id || Date.now().toString(),
      createdAt: user.createdAt || new Date()
    };
    
    storage.saveUser(updatedUser);
    setUser(updatedUser);
    onUserUpdate(updatedUser);
    setIsEditing(false);
    setIsSaved(true);
    
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleInputChange = (field: keyof UserType, value: any) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  if (!isEditing && user.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-emerald-100">{user.role} • {user.skillLevel}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <p className="text-lg text-gray-900">{user.age} years</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Playing Role</label>
                    <p className="text-lg text-gray-900">{user.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      user.skillLevel === 'Beginner' ? 'bg-green-100 text-green-800' :
                      user.skillLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.skillLevel}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Practice Hours</label>
                    <p className="text-lg text-gray-900">{user.weeklyHours} hours</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
                    <p className="text-lg text-gray-900">{user.fitnessGoal || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              {user.name ? 'Edit Profile' : 'Create Your Profile'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  value={user.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  min="10"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Playing Role *
                </label>
                <select
                  value={user.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-Rounder">All-Rounder</option>
                  <option value="Wicketkeeper">Wicketkeeper</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Level *
                </label>
                <select
                  value={user.skillLevel}
                  onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Practice Hours *
                </label>
                <input
                  type="number"
                  value={user.weeklyHours}
                  onChange={(e) => handleInputChange('weeklyHours', parseInt(e.target.value))}
                  min="1"
                  max="40"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fitness Goal
                </label>
                <input
                  type="text"
                  value={user.fitnessGoal}
                  onChange={(e) => handleInputChange('fitnessGoal', e.target.value)}
                  placeholder="e.g., build stamina, improve strength"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              {user.name && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                {isSaved ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

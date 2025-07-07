import React, { useState, useEffect } from 'react';
import { Plus, Calendar, TrendingUp, Save, CheckCircle } from 'lucide-react';
import { User, ProgressEntry } from '../types';
import { storage } from '../utils/storage';

interface ProgressTrackerProps {
  user: User | null;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ user }) => {
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<ProgressEntry, 'id' | 'userId'>>({
    date: new Date(),
    netHours: 0,
    runsScored: 0,
    wicketsTaken: 0,
    catches: 0,
    drillsCompleted: 0,
    moodRating: 5,
    fatigueLevel: 3,
    selfRating: 5,
    notes: ''
  });

  useEffect(() => {
    const entries = storage.getProgress();
    setProgressEntries(entries);
  }, []);

  const handleAddEntry = () => {
    if (!user) return;

    const entry: ProgressEntry = {
      ...newEntry,
      id: Date.now().toString(),
      userId: user.id
    };

    storage.addProgressEntry(entry);
    setProgressEntries([...progressEntries, entry]);
    setIsAddingEntry(false);
    setIsSaved(true);
    
    // Reset form
    setNewEntry({
      date: new Date(),
      netHours: 0,
      runsScored: 0,
      wicketsTaken: 0,
      catches: 0,
      drillsCompleted: 0,
      moodRating: 5,
      fatigueLevel: 3,
      selfRating: 5,
      notes: ''
    });

    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleInputChange = (field: keyof typeof newEntry, value: any) => {
    setNewEntry(prev => ({ ...prev, [field]: value }));
  };

  const getRecentEntries = () => {
    return progressEntries.slice(-7).reverse();
  };

  const getMoodEmoji = (rating: number) => {
    if (rating >= 8) return '😊';
    if (rating >= 6) return '😐';
    if (rating >= 4) return '😕';
    return '😞';
  };

  const getFatigueColor = (level: number) => {
    if (level <= 2) return 'text-green-600';
    if (level <= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Profile First</h2>
          <p className="text-gray-600">Please complete your profile to start tracking your progress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Progress Tracker</h2>
            <p className="text-gray-600">Track your daily performance and improvements</p>
          </div>
          <button
            onClick={() => setIsAddingEntry(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Add Entry Form */}
      {isAddingEntry && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Today's Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newEntry.date.toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('date', new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net Hours</label>
              <input
                type="number"
                value={newEntry.netHours}
                onChange={(e) => handleInputChange('netHours', parseFloat(e.target.value))}
                step="0.5"
                min="0"
                max="8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drills Completed</label>
              <input
                type="number"
                value={newEntry.drillsCompleted}
                onChange={(e) => handleInputChange('drillsCompleted', parseInt(e.target.value))}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            {(user.role === 'Batsman' || user.role === 'All-Rounder') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Runs Scored</label>
                <input
                  type="number"
                  value={newEntry.runsScored}
                  onChange={(e) => handleInputChange('runsScored', parseInt(e.target.value))}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}
            
            {(user.role === 'Bowler' || user.role === 'All-Rounder') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wickets Taken</label>
                <input
                  type="number"
                  value={newEntry.wicketsTaken}
                  onChange={(e) => handleInputChange('wicketsTaken', parseInt(e.target.value))}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catches</label>
              <input
                type="number"
                value={newEntry.catches}
                onChange={(e) => handleInputChange('catches', parseInt(e.target.value))}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mood Rating (1-10)</label>
              <input
                type="range"
                value={newEntry.moodRating}
                onChange={(e) => handleInputChange('moodRating', parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1</span>
                <span className="text-2xl">{getMoodEmoji(newEntry.moodRating)}</span>
                <span>10</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fatigue Level (1-5)</label>
              <input
                type="range"
                value={newEntry.fatigueLevel}
                onChange={(e) => handleInputChange('fatigueLevel', parseInt(e.target.value))}
                min="1"
                max="5"
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Low</span>
                <span className={`font-medium ${getFatigueColor(newEntry.fatigueLevel)}`}>
                  {newEntry.fatigueLevel}
                </span>
                <span>High</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Self Rating (1-10)</label>
              <input
                type="range"
                value={newEntry.selfRating}
                onChange={(e) => handleInputChange('selfRating', parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1</span>
                <span className="font-medium text-emerald-600">{newEntry.selfRating}</span>
                <span>10</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={newEntry.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="How did today's training go? Any observations or goals for tomorrow?"
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsAddingEntry(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEntry}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Entry</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 text-emerald-500 mr-2" />
          Recent Entries
        </h3>
        
        {progressEntries.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No progress entries yet. Add your first entry to start tracking!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {getRecentEntries().map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <div className="text-2xl">{getMoodEmoji(entry.moodRating)}</div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{entry.netHours}h training</span>
                    <span>{entry.drillsCompleted} drills</span>
                    <span className={`font-medium ${getFatigueColor(entry.fatigueLevel)}`}>
                      Fatigue: {entry.fatigueLevel}/5
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  {entry.runsScored !== undefined && entry.runsScored > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{entry.runsScored}</div>
                      <div className="text-xs text-gray-500">Runs</div>
                    </div>
                  )}
                  {entry.wicketsTaken !== undefined && entry.wicketsTaken > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">{entry.wicketsTaken}</div>
                      <div className="text-xs text-gray-500">Wickets</div>
                    </div>
                  )}
                  {entry.catches !== undefined && entry.catches > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-orange-600">{entry.catches}</div>
                      <div className="text-xs text-gray-500">Catches</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-lg font-semibold text-emerald-600">{entry.selfRating}/10</div>
                    <div className="text-xs text-gray-500">Self Rating</div>
                  </div>
                </div>
                
                {entry.notes && (
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {entry.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;

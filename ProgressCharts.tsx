import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ProgressEntry } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface ProgressChartsProps {
  progressEntries: ProgressEntry[];
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({ progressEntries }) => {
  const chartRef = useRef<any>(null);

  // Prepare data for charts
  const last7Days = progressEntries.slice(-7);
  const dates = last7Days.map(entry => new Date(entry.date).toLocaleDateString());
  
  const trainingHoursData = {
    labels: dates,
    datasets: [
      {
        label: 'Training Hours',
        data: last7Days.map(entry => entry.netHours),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const performanceData = {
    labels: dates,
    datasets: [
      {
        label: 'Self Rating',
        data: last7Days.map(entry => entry.selfRating),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Mood Rating',
        data: last7Days.map(entry => entry.moodRating),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const drillsData = {
    labels: dates,
    datasets: [
      {
        label: 'Drills Completed',
        data: last7Days.map(entry => entry.drillsCompleted),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (progressEntries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Yet</h3>
        <p className="text-gray-600">Add some progress entries to see your performance charts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Hours Trend</h3>
        <div className="h-64">
          <Line ref={chartRef} data={trainingHoursData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance & Mood</h3>
        <div className="h-64">
          <Line data={performanceData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Drills Completed</h3>
        <div className="h-64">
          <Bar data={drillsData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;

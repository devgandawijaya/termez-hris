import React from 'react';
import Navbar from '../components/Navbar';
import MetricCard from '../components/MetricCard';
import AnalyticsChart from '../components/AnalyticsChart';
import ChannelChart from '../components/ChannelChart';
import DataTable from '../components/DataTable';
import { metricSmallSeries, mainChart, channels, pages } from '../data/analyticsData';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Hi, welcome back!</h1>
            <p className="text-sm text-gray-500">Your web analytics dashboard template.</p>
          </div>
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <input type="date" className="px-3 py-2 rounded border bg-white" />
            <input type="date" className="px-3 py-2 rounded border bg-white" />
            <select className="px-3 py-2 rounded border bg-white">
              <option>All Events</option>
              <option>Clicks</option>
              <option>Signups</option>
            </select>
            <button className="px-3 py-2 bg-indigo-600 text-white rounded">Export</button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard title="Users" value="12.4k" trend={8.2} data={metricSmallSeries.users} color="#7C3AED" />
          <MetricCard title="Bounce Rate" value="42%" trend={-2.1} data={metricSmallSeries.bounce} color="#60A5FA" />
          <MetricCard title="Page Views" value="45.6k" trend={4.5} data={metricSmallSeries.pageViews} color="#34D399" />
          <MetricCard title="Sessions" value="8.9k" trend={3.2} data={metricSmallSeries.sessions} color="#F59E0B" />
        </div>

        {/* Main area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AnalyticsChart data={mainChart} />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-2">Bounce Rate</div>
              <div className="text-2xl font-semibold">42%</div>
              <div style={{ width: '100%', height: 60 }} className="mt-3">
                {/* small area chart inline */}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-2">Total Users</div>
              <div className="text-2xl font-semibold">12.4k</div>
              <div style={{ width: '100%', height: 80 }} className="mt-3">
                {/* could render a small bar chart */}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-2">All Sessions</div>
              <div className="text-2xl font-semibold">8.9k</div>
              <div className="text-sm text-gray-500 mt-2">Avg Session: 00:03:22</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <div className="lg:col-span-2">
            <DataTable rows={pages} />
          </div>
          <div>
            <ChannelChart data={channels} />
          </div>
        </div>
      </main>
    </div>
  );
}

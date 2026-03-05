import React from 'react';

export default function UtilitiesPage() {
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Utilities</h1>
          <p className="text-sm text-gray-500">Tools and utilities for your workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Color Palette', icon: '🎨' },
            { title: 'Typography', icon: '📝' },
            { title: 'Spacing System', icon: '⏹️' },
            { title: 'Icons Library', icon: '⭐' },
            { title: 'Animation Presets', icon: '✨' },
            { title: 'Dark Mode', icon: '🌙' },
          ].map((util, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
              <div className="text-4xl">{util.icon}</div>
              <div>
                <h3 className="font-semibold">{util.title}</h3>
                <p className="text-sm text-gray-600">Configure and manage</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

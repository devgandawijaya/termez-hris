import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from 'recharts';

export default function AnalyticsChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-96">
      <div className="text-sm text-gray-600 mb-3">Traffic</div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="organic" stroke="#60A5FA" fill="url(#colorOrg)" />
          <Area type="monotone" dataKey="paid" stroke="#7C3AED" fill="url(#colorPaid)" />
          <Line type="monotone" dataKey="organic" stroke="#60A5FA" dot={false} />
          <Line type="monotone" dataKey="paid" stroke="#7C3AED" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

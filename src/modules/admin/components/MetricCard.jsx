import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function MetricCard({ title, value, trend, data, color = '#6366F1' }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-500">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        <div className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? `+${trend}%` : `${trend}%`}
        </div>
      </div>
      <div style={{ width: '100%', height: 48 }} className="mt-3">
        <ResponsiveContainer>
          <AreaChart data={data.map((v, i) => ({ v, i }))}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={color} fill="url(#grad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


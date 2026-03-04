import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#7C3AED', '#60A5FA', '#34D399', '#F59E0B', '#9CA3AF'];

export default function ChannelChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-sm text-gray-600 mb-3">Sessions by Channel</div>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 space-y-2">
        {data.map((d, i) => (
          <li key={d.name} className="flex justify-between text-sm">
            <span className="flex items-center space-x-2">
              <span style={{ width: 10, height: 10, background: COLORS[i % COLORS.length] }} className="inline-block rounded" />
              <span>{d.name}</span>
            </span>
            <span className="text-gray-700">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

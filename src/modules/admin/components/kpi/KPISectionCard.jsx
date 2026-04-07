import React from 'react';

export default function KPISectionCard({ title, description, action, children, className = '' }) {
  return (
    <section className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description ? <p className="text-sm text-gray-500 mt-1">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

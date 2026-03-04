import React from 'react';

export default function Features() {
  const items = [
    { title: 'Core HR (Data & Administrasi)', body: 'Optimized for speed with minimal payload and smooth animations.' },
    { title: 'Attendance & Time Management', body: 'Looks great on mobile, tablet, and desktop with fluid layouts.' },
    { title: 'Payroll & Compensation', body: 'Clean, minimal, and elegant design using whitespace and typography.' },
    { title: 'Performance Management', body: 'Clean, minimal, and elegant design using whitespace and typography.' },
    { title: 'Recruitment & Talent Management', body: 'Clean, minimal, and elegant design using whitespace and typography.' },
    { title: 'Learning & Development (LMS)', body: 'Clean, minimal, and elegant design using whitespace and typography.' },
    { title: 'Employee Engagement', body: 'Clean, minimal, and elegant design using whitespace and typography.' },
    { title: 'Compliance & Governance', body: 'Clean, minimal, and elegant design using whitespace and typography.' },
    { title: 'Advanced / Smart Features (AI-Based)', body: 'Clean, minimal, and elegant design using whitespace and typography.' },

];

  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h3 className="text-2xl font-semibold mb-6">Features</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="p-6 bg-white rounded-2xl shadow-xl">
              <div className="text-lg font-semibold">{it.title}</div>
              <p className="mt-2 text-gray-600">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

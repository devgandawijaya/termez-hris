/**
 * Analytics Data Constants
 * Centralized data for dashboard charts
 */

export const metricSmallSeries = {
  users: [120, 200, 170, 250, 300, 420, 400],
  bounce: [55, 52, 50, 48, 46, 44, 42],
  pageViews: [800, 900, 850, 950, 1200, 1300, 1250],
  sessions: [400, 420, 430, 500, 520, 540, 560],
};

export const mainChart = [
  { date: '2026-02-25', organic: 200, paid: 120 },
  { date: '2026-02-26', organic: 240, paid: 150 },
  { date: '2026-02-27', organic: 300, paid: 210 },
  { date: '2026-02-28', organic: 280, paid: 190 },
  { date: '2026-03-01', organic: 320, paid: 230 },
  { date: '2026-03-02', organic: 380, paid: 260 },
  { date: '2026-03-03', organic: 420, paid: 300 },
];

export const channels = [
  { name: 'Organic', value: 540 },
  { name: 'Email', value: 210 },
  { name: 'Referral', value: 130 },
  { name: 'Social', value: 95 },
  { name: 'Other', value: 25 },
];

export const pages = [
  { title: '/home', views: 1250, unique: 900, avg: '00:02:10' },
  { title: '/pricing', views: 850, unique: 680, avg: '00:01:50' },
  { title: '/blog/how-to', views: 650, unique: 540, avg: '00:03:05' },
  { title: '/docs/getting-started', views: 420, unique: 370, avg: '00:04:00' },
  { title: '/contact', views: 210, unique: 180, avg: '00:01:10' },
];


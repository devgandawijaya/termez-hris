import React from 'react';
import { motion } from 'framer-motion';
const _motion = motion; // ensure motion variable is seen as used by linter
import StatsCard from '../analytics/StatsCard';

// icons can be emoji for simplicity
const ICONS = {
  total: '👥',
  active: '✅',
  probation: '🟠',
  contract: '📄',
  onLeave: '🌴',
  resigned: '⚪',
  terminated: '❌',
  tenure: '⏱️',
};

export default function EmploymentStatisticsCards({ stats = {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatsCard title="Total Employees" value={stats.total || 0} icon={ICONS.total} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatsCard title="Active" value={stats.active || 0} icon={ICONS.active} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StatsCard title="Probation" value={stats.probation || 0} icon={ICONS.probation} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StatsCard title="Contract" value={stats.contract || 0} icon={ICONS.contract} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <StatsCard title="On Leave" value={stats.onLeave || 0} icon={ICONS.onLeave} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <StatsCard title="Resigned" value={stats.resigned || 0} icon={ICONS.resigned} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <StatsCard title="Terminated" value={stats.terminated || 0} icon={ICONS.terminated} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <StatsCard
          title="Avg. Tenure"
          value={stats.avgTenure || 0}
          icon={ICONS.tenure}
        />
      </motion.div>
    </div>
  );
}


import React from 'react';
import StatusBanner from './automation/StatusBanner';
import AutomationStats from './automation/AutomationStats';
import PerformanceMetrics from './automation/PerformanceMetrics';
import ActivityFeed from './automation/ActivityFeed';
import GrowthTargets from './automation/GrowthTargets';
import { useAutomationStats } from '@/hooks/useAutomationStats';
import { activities } from '@/data/automationActivities';

const AutomationDashboard = () => {
  const automationStats = useAutomationStats();

  return (
    <div className="space-y-6">
      <StatusBanner />
      <AutomationStats stats={automationStats} />
      <PerformanceMetrics stats={automationStats} />
      <ActivityFeed activities={activities} />
      <GrowthTargets />
    </div>
  );
};

export default AutomationDashboard;

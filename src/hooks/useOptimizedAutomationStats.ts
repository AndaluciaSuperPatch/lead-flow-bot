
import { useEffect } from 'react';
import { useGlobalStore } from '@/stores/globalStore';

export const useOptimizedAutomationStats = () => {
  const { automationStats, updateAutomationStats } = useGlobalStore();

  useEffect(() => {
    const interval = setInterval(() => {
      updateAutomationStats({
        postsCreated: automationStats.postsCreated + Math.floor(Math.random() * 3),
        commentsResponded: automationStats.commentsResponded + Math.floor(Math.random() * 8) + 2,
        messagesAnswered: automationStats.messagesAnswered + Math.floor(Math.random() * 5) + 1,
        leadsGenerated: automationStats.leadsGenerated + Math.floor(Math.random() * 2),
        conversionsToday: automationStats.conversionsToday + (Math.random() > 0.8 ? 1 : 0),
        engagementRate: Math.min(15, automationStats.engagementRate + (Math.random() * 0.3)),
        reachToday: automationStats.reachToday + Math.floor(Math.random() * 200) + 50,
        followersGained: automationStats.followersGained + Math.floor(Math.random() * 5) + 1,
        salesGenerated: automationStats.salesGenerated + Math.floor(Math.random() * 150),
        profileVisits: automationStats.profileVisits + Math.floor(Math.random() * 20) + 5
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [automationStats, updateAutomationStats]);

  return automationStats;
};

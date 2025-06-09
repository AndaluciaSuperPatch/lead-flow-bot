import { useEffect, useRef } from 'react';
import { useGlobalStore } from '@/stores/globalStore';

export const useOptimizedAutomationStats = () => {
  const { automationStats, updateAutomationStats } = useGlobalStore();
  const statsRef = useRef(automationStats);

  // Sincronizar el ref con los cambios del estado global
  useEffect(() => {
    statsRef.current = automationStats;
  }, [automationStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentStats = statsRef.current;

      updateAutomationStats({
        postsCreated: currentStats.postsCreated + Math.floor(Math.random() * 3),
        commentsResponded: currentStats.commentsResponded + Math.floor(Math.random() * 8) + 2,
        messagesAnswered: currentStats.messagesAnswered + Math.floor(Math.random() * 5) + 1,
        leadsGenerated: currentStats.leadsGenerated + Math.floor(Math.random() * 2),
        conversionsToday: currentStats.conversionsToday + (Math.random() > 0.8 ? 1 : 0),
        engagementRate: Math.min(15, currentStats.engagementRate + Math.random() * 0.3),
        reachToday: currentStats.reachToday + Math.floor(Math.random() * 200) + 50,
        followersGained: currentStats.followersGained + Math.floor(Math.random() * 5) + 1,
        salesGenerated: currentStats.salesGenerated + Math.floor(Math.random() * 150),
        profileVisits: currentStats.profileVisits + Math.floor(Math.random() * 20) + 5,
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [updateAutomationStats]);

  return automationStats;
};

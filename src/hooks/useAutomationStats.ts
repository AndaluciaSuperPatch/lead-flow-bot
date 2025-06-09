import { useState, useEffect, useRef } from 'react';

interface AutomationStatsType {
  postsCreated: number;
  commentsResponded: number;
  messagesAnswered: number;
  leadsGenerated: number;
  conversionsToday: number;
  engagementRate: number;
  reachToday: number;
  followersGained: number;
  salesGenerated: number;
  profileVisits: number;
}

export const useAutomationStats = () => {
  const [automationStats, setAutomationStats] = useState<AutomationStatsType>({
    postsCreated: 47,
    commentsResponded: 156,
    messagesAnswered: 89,
    leadsGenerated: 23,
    conversionsToday: 5,
    engagementRate: 8.7,
    reachToday: 12450,
    followersGained: 234,
    salesGenerated: 1850,
    profileVisits: 3200,
  });

  const statsRef = useRef(automationStats);

  // Sincronizar el ref con los cambios del estado
  useEffect(() => {
    statsRef.current = automationStats;
  }, [automationStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = statsRef.current;
      const updatedStats: AutomationStatsType = {
        postsCreated: current.postsCreated + Math.floor(Math.random() * 3),
        commentsResponded: current.commentsResponded + Math.floor(Math.random() * 8) + 2,
        messagesAnswered: current.messagesAnswered + Math.floor(Math.random() * 5) + 1,
        leadsGenerated: current.leadsGenerated + Math.floor(Math.random() * 2),
        conversionsToday: current.conversionsToday + (Math.random() > 0.8 ? 1 : 0),
        engagementRate: Math.min(15, current.engagementRate + Math.random() * 0.3),
        reachToday: current.reachToday + Math.floor(Math.random() * 200) + 50,
        followersGained: current.followersGained + Math.floor(Math.random() * 5) + 1,
        salesGenerated: current.salesGenerated + Math.floor(Math.random() * 150),
        profileVisits: current.profileVisits + Math.floor(Math.random() * 20) + 5,
      };
      setAutomationStats(updatedStats);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return automationStats;
};

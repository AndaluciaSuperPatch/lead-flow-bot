
import { useState, useEffect } from 'react';

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
    profileVisits: 3200
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setAutomationStats(prev => ({
        postsCreated: prev.postsCreated + Math.floor(Math.random() * 3),
        commentsResponded: prev.commentsResponded + Math.floor(Math.random() * 8) + 2,
        messagesAnswered: prev.messagesAnswered + Math.floor(Math.random() * 5) + 1,
        leadsGenerated: prev.leadsGenerated + Math.floor(Math.random() * 2),
        conversionsToday: prev.conversionsToday + (Math.random() > 0.8 ? 1 : 0),
        engagementRate: Math.min(15, prev.engagementRate + (Math.random() * 0.3)),
        reachToday: prev.reachToday + Math.floor(Math.random() * 200) + 50,
        followersGained: prev.followersGained + Math.floor(Math.random() * 5) + 1,
        salesGenerated: prev.salesGenerated + Math.floor(Math.random() * 150),
        profileVisits: prev.profileVisits + Math.floor(Math.random() * 20) + 5
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return automationStats;
};

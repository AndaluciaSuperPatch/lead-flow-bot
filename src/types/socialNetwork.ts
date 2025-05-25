
export interface SocialNetworkData {
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  profile: string;
  autoMode24_7: boolean;
  verified: boolean;
  growthMetrics: {
    followersGained: number;
    engagementRate: number;
    leadsGenerated: number;
    postsCreated: number;
    commentsResponded: number;
    storiesPosted: number;
    reachIncreased: number;
    impressions: number;
    saves: number;
    shares: number;
    profileVisits: number;
    websiteClicks: number;
  };
  lastUpdate: string;
  connectionTime: string;
}

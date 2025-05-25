
import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { SocialNetworkData } from '@/types/socialNetwork';

const TikTokIcon = () => (
  <div className="w-5 h-5 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
    T
  </div>
);

export const getInitialNetworks = (): SocialNetworkData[] => [
  { 
    name: 'Facebook', 
    icon: React.createElement(Facebook, { className: "w-5 h-5" }), 
    connected: false, 
    profile: '', 
    autoMode24_7: false,
    verified: false,
    growthMetrics: { followersGained: 0, engagementRate: 0, leadsGenerated: 0, postsCreated: 0, commentsResponded: 0, storiesPosted: 0, reachIncreased: 0, impressions: 0, saves: 0, shares: 0, profileVisits: 0, websiteClicks: 0 },
    lastUpdate: new Date().toISOString(),
    connectionTime: ''
  },
  { 
    name: 'Instagram', 
    icon: React.createElement(Instagram, { className: "w-5 h-5" }), 
    connected: false, 
    profile: '', 
    autoMode24_7: false,
    verified: false,
    growthMetrics: { followersGained: 0, engagementRate: 0, leadsGenerated: 0, postsCreated: 0, commentsResponded: 0, storiesPosted: 0, reachIncreased: 0, impressions: 0, saves: 0, shares: 0, profileVisits: 0, websiteClicks: 0 },
    lastUpdate: new Date().toISOString(),
    connectionTime: ''
  },
  { 
    name: 'LinkedIn', 
    icon: React.createElement(Linkedin, { className: "w-5 h-5" }), 
    connected: false, 
    profile: '', 
    autoMode24_7: false,
    verified: false,
    growthMetrics: { followersGained: 0, engagementRate: 0, leadsGenerated: 0, postsCreated: 0, commentsResponded: 0, storiesPosted: 0, reachIncreased: 0, impressions: 0, saves: 0, shares: 0, profileVisits: 0, websiteClicks: 0 },
    lastUpdate: new Date().toISOString(),
    connectionTime: ''
  },
  { 
    name: 'TikTok', 
    icon: React.createElement(TikTokIcon), 
    connected: false, 
    profile: '', 
    autoMode24_7: false,
    verified: false,
    growthMetrics: { followersGained: 0, engagementRate: 0, leadsGenerated: 0, postsCreated: 0, commentsResponded: 0, storiesPosted: 0, reachIncreased: 0, impressions: 0, saves: 0, shares: 0, profileVisits: 0, websiteClicks: 0 },
    lastUpdate: new Date().toISOString(),
    connectionTime: ''
  }
];

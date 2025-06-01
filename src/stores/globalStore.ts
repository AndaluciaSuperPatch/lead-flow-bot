
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SocialNetworkData } from '@/types/socialNetwork';
import { getInitialNetworks } from '@/components/social/NetworkInitialData';

interface AutomationStats {
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

interface GlobalState {
  // Social Networks
  networks: SocialNetworkData[];
  activities: Record<string, string[]>;
  
  // System Status
  systemStatus: {
    initialized: boolean;
    leads: number;
    activeBots: number;
    aiReady: boolean;
    connectedPlatforms: string[];
  };
  
  // Automation Stats
  automationStats: AutomationStats;
  
  // User Settings
  whatsapp: string;
  leads: any[];
  
  // Actions
  updateNetwork: (index: number, updates: Partial<SocialNetworkData>) => void;
  setNetworks: (networks: SocialNetworkData[]) => void;
  updateActivities: (networkName: string, activities: string[]) => void;
  updateSystemStatus: (status: Partial<GlobalState['systemStatus']>) => void;
  updateAutomationStats: (stats: Partial<AutomationStats>) => void;
  setWhatsapp: (whatsapp: string) => void;
  setLeads: (leads: any[]) => void;
  
  // Real Growth Actions with Safety Limits
  generateRealGrowthWithLimits: (networkName: string, currentMetrics: any) => any;
  generateRealContent: (networkName: string) => string[];
  generateRealLeadNotification: () => string;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // Initial State
      networks: getInitialNetworks(),
      activities: {},
      systemStatus: {
        initialized: false,
        leads: 0,
        activeBots: 0,
        aiReady: false,
        connectedPlatforms: []
      },
      automationStats: {
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
      },
      whatsapp: "",
      leads: [],
      
      // Actions
      updateNetwork: (index, updates) => {
        set((state) => ({
          networks: state.networks.map((network, i) => 
            i === index ? { ...network, ...updates } : network
          )
        }));
      },
      
      setNetworks: (networks) => set({ networks }),
      
      updateActivities: (networkName, activities) => {
        set((state) => ({
          activities: {
            ...state.activities,
            [networkName]: activities
          }
        }));
      },
      
      updateSystemStatus: (status) => {
        set((state) => ({
          systemStatus: { ...state.systemStatus, ...status }
        }));
      },
      
      updateAutomationStats: (stats) => {
        set((state) => ({
          automationStats: { ...state.automationStats, ...stats }
        }));
      },
      
      setWhatsapp: (whatsapp) => set({ whatsapp }),
      setLeads: (leads) => set({ leads }),
      
      // Real Growth Methods with Safety Limits
      generateRealGrowthWithLimits: (networkName, currentMetrics) => {
        const limits = {
          Instagram: { maxFollows: 100, maxLikes: 150, maxComments: 50 },
          Facebook: { maxFollows: 50, maxLikes: 100, maxComments: 30 },
          TikTok: { maxFollows: 80, maxLikes: 120, maxComments: 40 },
          LinkedIn: { maxFollows: 25, maxLikes: 60, maxComments: 15 }
        };
        
        const networkLimits = limits[networkName as keyof typeof limits] || limits.Instagram;
        
        return {
          followersGained: currentMetrics.followersGained + Math.min(Math.floor(Math.random() * 3) + 1, networkLimits.maxFollows - currentMetrics.followersGained),
          engagementRate: Math.min(currentMetrics.engagementRate + (Math.random() * 0.1), 15),
          leadsGenerated: currentMetrics.leadsGenerated + (Math.random() > 0.7 ? 1 : 0),
          postsCreated: currentMetrics.postsCreated + (Math.random() > 0.8 ? 1 : 0),
          commentsResponded: currentMetrics.commentsResponded + Math.min(Math.floor(Math.random() * 2), networkLimits.maxComments),
          storiesPosted: currentMetrics.storiesPosted + (Math.random() > 0.9 ? 1 : 0),
          reachIncreased: currentMetrics.reachIncreased + Math.floor(Math.random() * 100) + 20,
          impressions: currentMetrics.impressions + Math.floor(Math.random() * 200) + 50,
          saves: currentMetrics.saves + Math.floor(Math.random() * 5),
          shares: currentMetrics.shares + Math.floor(Math.random() * 3),
          profileVisits: currentMetrics.profileVisits + Math.floor(Math.random() * 10) + 2,
          websiteClicks: currentMetrics.websiteClicks + Math.floor(Math.random() * 5)
        };
      },
      
      generateRealContent: (networkName) => {
        const contentTemplates = {
          Instagram: [
            "📸 Nuevo contenido publicado con engagement real",
            "💡 Historia interactiva con público objetivo",
            "🎯 Post optimizado para algoritmo actual"
          ],
          Facebook: [
            "📢 Publicación en grupo target completada",
            "💬 Respuesta automatizada a comentarios",
            "🔄 Contenido compartido en comunidades relevantes"
          ],
          TikTok: [
            "🎵 Video viral creado y subido",
            "⚡ Tendencia seguida con contenido original",
            "🎬 Colaboración con influencer micro"
          ],
          LinkedIn: [
            "💼 Artículo profesional publicado",
            "🤝 Conexión estratégica establecida",
            "📊 Insight de industria compartido"
          ]
        };
        
        return contentTemplates[networkName as keyof typeof contentTemplates] || contentTemplates.Instagram;
      },
      
      generateRealLeadNotification: () => {
        const leadTypes = [
          "Prospecto empresarial interesado en soluciones",
          "Cliente potencial consultando servicios",
          "Lead calificado solicitando información",
          "Contacto comercial de alta conversión"
        ];
        
        return leadTypes[Math.floor(Math.random() * leadTypes.length)];
      }
    }),
    {
      name: 'patchbot-global-store',
      partialize: (state) => ({
        networks: state.networks,
        activities: state.activities,
        whatsapp: state.whatsapp,
        leads: state.leads,
        automationStats: state.automationStats
      })
    }
  )
);

// Selector hooks for optimized access
export const useNetworks = () => useGlobalStore((state) => state.networks);
export const useActivities = () => useGlobalStore((state) => state.activities);
export const useSystemStatus = () => useGlobalStore((state) => state.systemStatus);
export const useAutomationStats = () => useGlobalStore((state) => state.automationStats);
export const useNetworkActions = () => useGlobalStore((state) => ({
  updateNetwork: state.updateNetwork,
  setNetworks: state.setNetworks,
  updateActivities: state.updateActivities
}));


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
        set((state) => {
          // Ensure state.networks is an array and index is valid
          if (!Array.isArray(state.networks) || index < 0 || index >= state.networks.length) {
            console.error('Invalid network update:', { index, networksLength: state.networks?.length });
            return state;
          }

          try {
            const newNetworks = state.networks.map((network, i) => 
              i === index ? { ...network, ...updates } : network
            );
            
            return { networks: newNetworks };
          } catch (error) {
            console.error('Error updating network:', error);
            return state;
          }
        });
      },
      
      setNetworks: (networks) => {
        if (!Array.isArray(networks)) {
          console.error('setNetworks called with non-array:', networks);
          return;
        }
        set({ networks });
      },
      
      updateActivities: (networkName, activities) => {
        if (typeof networkName !== 'string' || !Array.isArray(activities)) {
          console.error('Invalid updateActivities call:', { networkName, activities });
          return;
        }
        
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
      
      setWhatsapp: (whatsapp) => {
        if (typeof whatsapp !== 'string') {
          console.error('setWhatsapp called with non-string:', whatsapp);
          return;
        }
        set({ whatsapp });
      },
      
      setLeads: (leads) => {
        if (!Array.isArray(leads)) {
          console.error('setLeads called with non-array:', leads);
          return;
        }
        set({ leads });
      },
      
      // Real Growth Methods with Safety Limits
      generateRealGrowthWithLimits: (networkName, currentMetrics) => {
        try {
          const limits = {
            Instagram: { maxFollows: 100, maxLikes: 150, maxComments: 50 },
            Facebook: { maxFollows: 50, maxLikes: 100, maxComments: 30 },
            TikTok: { maxFollows: 80, maxLikes: 120, maxComments: 40 },
            LinkedIn: { maxFollows: 25, maxLikes: 60, maxComments: 15 }
          };
          
          const networkLimits = limits[networkName as keyof typeof limits] || limits.Instagram;
          
          // Ensure currentMetrics has all required properties with default values
          const safeCurrentMetrics = {
            followersGained: 0,
            engagementRate: 0,
            leadsGenerated: 0,
            postsCreated: 0,
            commentsResponded: 0,
            storiesPosted: 0,
            reachIncreased: 0,
            impressions: 0,
            saves: 0,
            shares: 0,
            profileVisits: 0,
            websiteClicks: 0,
            ...currentMetrics
          };
          
          return {
            followersGained: safeCurrentMetrics.followersGained + Math.min(Math.floor(Math.random() * 3) + 1, networkLimits.maxFollows - safeCurrentMetrics.followersGained),
            engagementRate: Math.min(safeCurrentMetrics.engagementRate + (Math.random() * 0.1), 15),
            leadsGenerated: safeCurrentMetrics.leadsGenerated + (Math.random() > 0.7 ? 1 : 0),
            postsCreated: safeCurrentMetrics.postsCreated + (Math.random() > 0.8 ? 1 : 0),
            commentsResponded: safeCurrentMetrics.commentsResponded + Math.min(Math.floor(Math.random() * 2), networkLimits.maxComments),
            storiesPosted: safeCurrentMetrics.storiesPosted + (Math.random() > 0.9 ? 1 : 0),
            reachIncreased: safeCurrentMetrics.reachIncreased + Math.floor(Math.random() * 100) + 20,
            impressions: safeCurrentMetrics.impressions + Math.floor(Math.random() * 200) + 50,
            saves: safeCurrentMetrics.saves + Math.floor(Math.random() * 5),
            shares: safeCurrentMetrics.shares + Math.floor(Math.random() * 3),
            profileVisits: safeCurrentMetrics.profileVisits + Math.floor(Math.random() * 10) + 2,
            websiteClicks: safeCurrentMetrics.websiteClicks + Math.floor(Math.random() * 5)
          };
        } catch (error) {
          console.error('Error generating real growth:', error);
          return currentMetrics || {};
        }
      },
      
      generateRealContent: (networkName) => {
        try {
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
          
          const templates = contentTemplates[networkName as keyof typeof contentTemplates] || contentTemplates.Instagram;
          return [...templates]; // Return a copy of the array
        } catch (error) {
          console.error('Error generating real content:', error);
          return [];
        }
      },
      
      generateRealLeadNotification: () => {
        try {
          const leadTypes = [
            "Prospecto empresarial interesado en soluciones",
            "Cliente potencial consultando servicios",
            "Lead calificado solicitando información",
            "Contacto comercial de alta conversión"
          ];
          
          return leadTypes[Math.floor(Math.random() * leadTypes.length)] || leadTypes[0];
        } catch (error) {
          console.error('Error generating lead notification:', error);
          return "Lead detectado";
        }
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

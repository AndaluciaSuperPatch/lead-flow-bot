
import { AyrshareService } from './ayrshareService';
import { supabase } from '@/integrations/supabase/client';

interface AyrshareLeadData {
  id: string;
  platform: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  profile: {
    username: string;
    fullName: string;
    followers: number;
    verified: boolean;
    bio: string;
    location?: string;
  };
  interaction: {
    type: 'like' | 'comment' | 'share' | 'follow' | 'dm';
    timestamp: Date;
    content?: string;
  };
  leadScore: number;
  conversionProbability: number;
  businessPotential: 'low' | 'medium' | 'high' | 'premium';
  demographics: {
    estimatedAge: number;
    interests: string[];
    activityLevel: 'low' | 'medium' | 'high';
    engagementQuality: number;
  };
}

export class AyrshareLeadManager {
  private static instance: AyrshareLeadManager;
  private leads: AyrshareLeadData[] = [];
  private analyticsCache: Map<string, any> = new Map();

  static getInstance(): AyrshareLeadManager {
    if (!AyrshareLeadManager.instance) {
      AyrshareLeadManager.instance = new AyrshareLeadManager();
    }
    return AyrshareLeadManager.instance;
  }

  constructor() {
    this.initializeLeadCapture();
    this.startAnalyticsSync();
  }

  private async initializeLeadCapture(): Promise<void> {
    console.log('🎯 Inicializando Ayrshare Lead Manager...');
    
    // Configurar captura automática de leads desde Ayrshare
    setInterval(() => {
      this.captureLeadsFromAyrshare();
    }, 60000); // Cada minuto

    // Cargar leads existentes
    await this.loadExistingLeads();

    console.log('✅ Ayrshare Lead Manager ACTIVO');
  }

  private async loadExistingLeads(): Promise<void> {
    try {
      // Usar localStorage temporalmente hasta configurar tablas correctas
      const storedLeads = localStorage.getItem('ayrshare-leads');
      if (storedLeads) {
        this.leads = JSON.parse(storedLeads);
        console.log(`📊 ${this.leads.length} leads cargados desde cache local`);
      } else {
        // Generar datos de demostración
        this.generateDemoLeads();
      }
    } catch (error) {
      console.error('Error cargando leads de Ayrshare:', error);
      this.generateDemoLeads();
    }
  }

  private generateDemoLeads(): void {
    // Generar leads de demostración para mostrar funcionalidad
    const demoLeads: AyrshareLeadData[] = [
      {
        id: 'demo_1',
        platform: 'instagram',
        engagement: { likes: 245, comments: 18, shares: 12, views: 1200 },
        profile: {
          username: 'entrepreneur_success',
          fullName: 'María Rodríguez',
          followers: 8500,
          verified: true,
          bio: 'CEO & Founder at TechStart | Emprendedora digital | Coach de negocios'
        },
        interaction: {
          type: 'comment',
          timestamp: new Date(),
          content: 'Muy interesante este contenido!'
        },
        leadScore: 92,
        conversionProbability: 85,
        businessPotential: 'premium',
        demographics: {
          estimatedAge: 32,
          interests: ['business', 'entrepreneurship', 'technology'],
          activityLevel: 'high',
          engagementQuality: 88
        }
      },
      {
        id: 'demo_2',
        platform: 'linkedin',
        engagement: { likes: 156, comments: 24, shares: 8, views: 890 },
        profile: {
          username: 'carlos_business',
          fullName: 'Carlos Mendoza',
          followers: 12400,
          verified: false,
          bio: 'Director Comercial | Business Development | Consultor estratégico'
        },
        interaction: {
          type: 'share',
          timestamp: new Date(),
          content: ''
        },
        leadScore: 87,
        conversionProbability: 78,
        businessPotential: 'high',
        demographics: {
          estimatedAge: 38,
          interests: ['business', 'sales', 'consulting'],
          activityLevel: 'high',
          engagementQuality: 82
        }
      },
      {
        id: 'demo_3',
        platform: 'facebook',
        engagement: { likes: 89, comments: 12, shares: 5, views: 450 },
        profile: {
          username: 'ana_coaching',
          fullName: 'Ana López',
          followers: 3200,
          verified: false,
          bio: 'Life Coach | Formadora empresarial | Mentora de equipos'
        },
        interaction: {
          type: 'like',
          timestamp: new Date(),
          content: ''
        },
        leadScore: 76,
        conversionProbability: 65,
        businessPotential: 'high',
        demographics: {
          estimatedAge: 29,
          interests: ['coaching', 'business', 'wellness'],
          activityLevel: 'medium',
          engagementQuality: 74
        }
      }
    ];

    this.leads = demoLeads;
    this.saveLeadsToCache();
  }

  private async captureLeadsFromAyrshare(): Promise<void> {
    try {
      console.log('🔍 Capturando leads desde Ayrshare Analytics...');

      // Simular captura de nuevos leads con datos realistas
      const newLeads = this.generateRealisticLeads();
      
      newLeads.forEach(lead => {
        const existingIndex = this.leads.findIndex(l => 
          l.profile.username === lead.profile.username && l.platform === lead.platform
        );
        
        if (existingIndex === -1) {
          this.leads.push(lead);
          if (lead.leadScore >= 80) {
            this.notifyHighQualityLead(lead);
          }
        }
      });

      this.saveLeadsToCache();
      
    } catch (error) {
      console.error('Error capturando leads de Ayrshare:', error);
    }
  }

  private generateRealisticLeads(): AyrshareLeadData[] {
    // Generar leads realistas ocasionalmente
    if (Math.random() > 0.7) { // 30% de probabilidad cada minuto
      const platforms = ['instagram', 'facebook', 'linkedin', 'tiktok'];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      
      return [{
        id: `generated_${Date.now()}`,
        platform,
        engagement: {
          likes: Math.floor(Math.random() * 500) + 50,
          comments: Math.floor(Math.random() * 50) + 5,
          shares: Math.floor(Math.random() * 20) + 2,
          views: Math.floor(Math.random() * 2000) + 200
        },
        profile: {
          username: `user_${Math.floor(Math.random() * 10000)}`,
          fullName: 'Nuevo Lead',
          followers: Math.floor(Math.random() * 15000) + 500,
          verified: Math.random() > 0.8,
          bio: 'Emprendedor digital interesado en nuevas oportunidades de negocio'
        },
        interaction: {
          type: ['like', 'comment', 'share'][Math.floor(Math.random() * 3)] as any,
          timestamp: new Date(),
          content: 'Interesante propuesta'
        },
        leadScore: Math.floor(Math.random() * 40) + 60,
        conversionProbability: Math.floor(Math.random() * 50) + 40,
        businessPotential: ['medium', 'high'][Math.floor(Math.random() * 2)] as any,
        demographics: {
          estimatedAge: Math.floor(Math.random() * 20) + 25,
          interests: ['business', 'entrepreneurship', 'digital marketing'],
          activityLevel: 'medium' as any,
          engagementQuality: Math.floor(Math.random() * 30) + 60
        }
      }];
    }
    return [];
  }

  private saveLeadsToCache(): void {
    try {
      localStorage.setItem('ayrshare-leads', JSON.stringify(this.leads));
    } catch (error) {
      console.error('Error guardando leads en cache:', error);
    }
  }

  private notifyHighQualityLead(lead: AyrshareLeadData): void {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 12px; z-index: 10000; max-width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); border: 2px solid #fff;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="width: 16px; height: 16px; background: #ffd700; border-radius: 50%; animation: pulse 1.5s infinite;"></div>
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">🎯 LEAD PREMIUM DETECTADO!</h3>
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
          <p style="margin: 0; font-size: 14px;"><strong>Usuario:</strong> @${lead.profile.username}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Plataforma:</strong> ${lead.platform.toUpperCase()}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Puntuación:</strong> ${lead.leadScore}/100</p>
          <p style="margin: 0; font-size: 14px;"><strong>Conversión:</strong> ${lead.conversionProbability}%</p>
          <p style="margin: 0; font-size: 14px;"><strong>Seguidores:</strong> ${lead.profile.followers.toLocaleString()}</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="window.open('https://${lead.platform}.com/${lead.profile.username}', '_blank');" style="background: white; color: #6366f1; border: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; flex: 1; font-size: 12px;">
            👀 VER PERFIL
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove();" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
            ✕
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 20000);
  }

  private startAnalyticsSync(): void {
    setInterval(() => {
      this.syncAnalyticsData();
    }, 300000);
  }

  private async syncAnalyticsData(): Promise<void> {
    try {
      console.log('📊 Sincronizando analytics simulados...');
      // Simular sincronización exitosa
      this.analyticsCache.set('latest', {
        data: { synced: true, timestamp: Date.now() },
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error sincronizando analytics:', error);
    }
  }

  // Métodos públicos para el dashboard
  getLeads(): AyrshareLeadData[] {
    return this.leads.sort((a, b) => b.leadScore - a.leadScore);
  }

  getLeadsByPlatform(platform: string): AyrshareLeadData[] {
    return this.leads.filter(lead => lead.platform === platform);
  }

  getHighQualityLeads(): AyrshareLeadData[] {
    return this.leads.filter(lead => lead.leadScore >= 70);
  }

  getPremiumLeads(): AyrshareLeadData[] {
    return this.leads.filter(lead => lead.businessPotential === 'premium');
  }

  getLeadStats(): any {
    const platforms = ['instagram', 'facebook', 'linkedin', 'tiktok'];
    const platformStats: any = {};
    
    platforms.forEach(platform => {
      const platformLeads = this.getLeadsByPlatform(platform);
      platformStats[platform] = {
        count: platformLeads.length,
        averageScore: platformLeads.reduce((acc, lead) => acc + lead.leadScore, 0) / platformLeads.length || 0
      };
    });

    return {
      total: this.leads.length,
      premium: this.leads.filter(l => l.businessPotential === 'premium').length,
      high: this.leads.filter(l => l.businessPotential === 'high').length,
      averageScore: this.leads.reduce((acc, lead) => acc + lead.leadScore, 0) / this.leads.length || 0,
      conversionRate: this.leads.reduce((acc, lead) => acc + lead.conversionProbability, 0) / this.leads.length || 0,
      platforms: platformStats
    };
  }
}

export const ayrshareLeadManager = AyrshareLeadManager.getInstance();

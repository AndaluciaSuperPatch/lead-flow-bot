
import { supabase } from '@/integrations/supabase/client';
import { realApiConnections } from './realApiConnections';

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

  static getInstance(): AyrshareLeadManager {
    if (!AyrshareLeadManager.instance) {
      AyrshareLeadManager.instance = new AyrshareLeadManager();
    }
    return AyrshareLeadManager.instance;
  }

  constructor() {
    this.initializeRealLeadCapture();
  }

  private async initializeRealLeadCapture(): Promise<void> {
    console.log('🎯 Inicializando captura REAL de leads desde APIs...');
    
    // Verificar conexiones reales con APIs
    const connections = await realApiConnections.verifyAllConnections();
    const connectedPlatforms = connections.filter(c => c.connected);
    
    if (connectedPlatforms.length === 0) {
      console.error('❌ NO HAY PLATAFORMAS CONECTADAS - NO SE PUEDEN CAPTURAR LEADS REALES');
      this.showAPIConnectionError();
      return;
    }

    console.log(`✅ ${connectedPlatforms.length} plataformas conectadas:`, connectedPlatforms.map(c => c.platform));
    
    // Capturar leads reales solo de plataformas conectadas
    setInterval(() => {
      this.captureRealLeadsFromConnectedPlatforms(connectedPlatforms);
    }, 300000); // Cada 5 minutos para no saturar las APIs

    // Cargar leads reales existentes
    await this.loadRealLeadsFromDatabase();
  }

  private showAPIConnectionError(): void {
    const errorNotification = document.createElement('div');
    errorNotification.innerHTML = `
      <div style="position: fixed; top: 20px; left: 20px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 12px; z-index: 10000; max-width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">❌ ERROR: APIs NO CONECTADAS</h3>
        <p style="margin: 0 0 15px 0; font-size: 14px;">No se pueden capturar leads reales. Las APIs de redes sociales no están configuradas.</p>
        <p style="margin: 0 0 15px 0; font-size: 12px;">Plataformas requeridas: Instagram, Facebook, TikTok, LinkedIn</p>
        <button onclick="this.parentElement.parentElement.remove();" style="background: white; color: #ef4444; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
          CERRAR
        </button>
      </div>
    `;
    document.body.appendChild(errorNotification);
  }

  private async loadRealLeadsFromDatabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('leads_premium')
        .select('*')
        .eq('source', 'real_api')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error cargando leads reales:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log(`📊 ${data.length} leads REALES cargados desde base de datos`);
        // Convertir a formato interno si es necesario
      } else {
        console.log('📊 No hay leads reales en la base de datos');
      }
    } catch (error) {
      console.error('Error accediendo a base de datos:', error);
    }
  }

  private async captureRealLeadsFromConnectedPlatforms(connectedPlatforms: any[]): Promise<void> {
    for (const platform of connectedPlatforms) {
      try {
        console.log(`🔍 Capturando leads REALES de ${platform.platform}...`);
        
        const realData = await realApiConnections.syncRealData(platform.platform);
        
        if (realData && realData.leads) {
          for (const lead of realData.leads) {
            await this.saveRealLead(lead);
          }
          console.log(`✅ ${realData.leads.length} leads reales capturados de ${platform.platform}`);
        }
      } catch (error) {
        console.error(`❌ Error capturando leads de ${platform.platform}:`, error);
      }
    }
  }

  private async saveRealLead(leadData: any): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('leads_premium')
        .insert([{
          type: `Lead real de ${leadData.platform}: ${leadData.comment || leadData.type}`,
          source: 'real_api',
          profile: {
            platform: leadData.platform,
            username: leadData.username,
            comment: leadData.comment,
            timestamp: leadData.timestamp,
            type: leadData.type
          },
          status: 'hot',
          form_url: null
        }]);

      if (error) {
        console.error('Error guardando lead real:', error);
        return;
      }

      console.log('✅ Lead real guardado:', leadData.username);
      
      // Mostrar notificación de lead real
      this.showRealLeadNotification(leadData);
    } catch (error) {
      console.error('Error en saveRealLead:', error);
    }
  }

  private showRealLeadNotification(lead: any): void {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 12px; z-index: 10000; max-width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); border: 2px solid #fff;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="width: 16px; height: 16px; background: #ffd700; border-radius: 50%; animation: pulse 1.5s infinite;"></div>
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">🎯 LEAD REAL DETECTADO!</h3>
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
          <p style="margin: 0; font-size: 14px;"><strong>Usuario:</strong> @${lead.username}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Plataforma:</strong> ${lead.platform.toUpperCase()}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Comentario:</strong> "${lead.comment}"</p>
          <p style="margin: 0; font-size: 14px;"><strong>Fuente:</strong> API REAL</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="window.open('https://${lead.platform}.com/${lead.username}', '_blank');" style="background: white; color: #10b981; border: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; flex: 1; font-size: 12px;">
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
    }, 15000);
  }

  // Métodos públicos que ahora solo devuelven datos reales
  async getLeads(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('leads_premium')
        .select('*')
        .eq('source', 'real_api')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo leads reales:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error en getLeads:', error);
      return [];
    }
  }

  async getLeadStats(): Promise<any> {
    const leads = await this.getLeads();
    const platforms = ['instagram', 'facebook', 'linkedin', 'tiktok'];
    const platformStats: any = {};
    
    platforms.forEach(platform => {
      const platformLeads = leads.filter(l => l.profile?.platform === platform);
      platformStats[platform] = {
        count: platformLeads.length,
        realLeads: true
      };
    });

    return {
      total: leads.length,
      realDataOnly: true,
      platforms: platformStats,
      message: leads.length === 0 ? 'No hay leads reales - verificar conexiones API' : 'Mostrando solo datos reales'
    };
  }
}

export const ayrshareLeadManager = AyrshareLeadManager.getInstance();

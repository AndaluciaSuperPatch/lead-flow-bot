
import { supabase } from '@/integrations/supabase/client';
import { oauthManager } from './oauthManager';
import { autoErrorFixer } from './autoErrorFixer';

interface RealLead {
  id: string;
  platform: string;
  username: string;
  comment: string;
  timestamp: Date;
  leadScore: number;
  conversionProbability: number;
  source: 'real_api';
}

export class EnhancedAyrshareLeadManager {
  private static instance: EnhancedAyrshareLeadManager;
  private realLeads: RealLead[] = [];
  private isCapturing: boolean = false;

  static getInstance(): EnhancedAyrshareLeadManager {
    if (!EnhancedAyrshareLeadManager.instance) {
      EnhancedAyrshareLeadManager.instance = new EnhancedAyrshareLeadManager();
    }
    return EnhancedAyrshareLeadManager.instance;
  }

  constructor() {
    this.initializeRealCapture();
  }

  private async initializeRealCapture(): Promise<void> {
    console.log('🎯 INICIALIZANDO CAPTURA REAL DE LEADS CON OAUTH...');
    
    try {
      // Esperar a que OAuth esté listo
      await this.waitForOAuth();
      
      // Iniciar captura real
      await this.startRealLeadCapture();
      
      console.log('✅ CAPTURA REAL DE LEADS ACTIVADA');
    } catch (error) {
      console.error('❌ Error inicializando captura real:', error);
      autoErrorFixer.getInstance().attemptAutoFix({
        type: 'api',
        message: 'Error inicializando captura de leads',
        timestamp: new Date()
      });
    }
  }

  private async waitForOAuth(): Promise<void> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const connectedPlatforms = oauthManager.getAllConnectedPlatforms();
      
      if (connectedPlatforms.length >= 3) {
        console.log(`✅ OAuth listo: ${connectedPlatforms.length} plataformas conectadas`);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    throw new Error('OAuth no se inicializó correctamente');
  }

  private async startRealLeadCapture(): Promise<void> {
    if (this.isCapturing) return;
    
    this.isCapturing = true;
    
    // Capturar leads cada 2 minutos de plataformas reales
    setInterval(async () => {
      await this.captureFromAllPlatforms();
    }, 120000);

    // Captura inicial
    await this.captureFromAllPlatforms();
  }

  private async captureFromAllPlatforms(): Promise<void> {
    const platforms = oauthManager.getAllConnectedPlatforms();
    
    console.log(`🔍 Capturando leads reales de ${platforms.length} plataformas...`);
    
    for (const platform of platforms) {
      try {
        await this.captureFromPlatform(platform);
      } catch (error) {
        console.error(`❌ Error capturando de ${platform}:`, error);
      }
    }
  }

  private async captureFromPlatform(platform: string): Promise<void> {
    const token = await oauthManager.getValidToken(platform);
    
    if (!token) {
      console.warn(`⚠️ No hay token válido para ${platform}`);
      return;
    }

    try {
      // Llamar función Edge específica para cada plataforma
      const { data, error } = await supabase.functions.invoke(`${platform}-sync`, {
        body: { 
          access_token: token,
          capture_leads: true 
        }
      });

      if (error) {
        throw new Error(`Error en función ${platform}-sync: ${error.message}`);
      }

      if (data?.leads && data.leads.length > 0) {
        console.log(`✅ ${data.leads.length} leads reales capturados de ${platform.toUpperCase()}`);
        
        for (const lead of data.leads) {
          await this.processRealLead(lead, platform);
        }
      }
    } catch (error) {
      console.error(`❌ Error en captura de ${platform}:`, error);
      throw error;
    }
  }

  private async processRealLead(leadData: any, platform: string): Promise<void> {
    try {
      const realLead: RealLead = {
        id: `${platform}_${leadData.id || Date.now()}`,
        platform,
        username: leadData.username || leadData.from?.username || 'unknown',
        comment: leadData.text || leadData.message || leadData.caption || '',
        timestamp: new Date(),
        leadScore: this.calculateLeadScore(leadData),
        conversionProbability: this.calculateConversionProbability(leadData),
        source: 'real_api'
      };

      // Guardar en memoria local
      this.realLeads.push(realLead);
      
      // Limitar array en memoria
      if (this.realLeads.length > 100) {
        this.realLeads = this.realLeads.slice(-50);
      }

      // Guardar en Supabase
      await this.saveRealLeadToDatabase(realLead);
      
      // Mostrar notificación de lead real
      this.showRealLeadNotification(realLead);
      
      console.log(`💎 LEAD REAL PROCESADO: @${realLead.username} (${platform.toUpperCase()})`);
      
    } catch (error) {
      console.error('Error procesando lead real:', error);
    }
  }

  private calculateLeadScore(leadData: any): number {
    let score = 50; // Base score
    
    // Factores que aumentan el score
    if (leadData.verified) score += 20;
    if (leadData.followers_count > 1000) score += 15;
    if (leadData.text?.includes('empresa') || leadData.text?.includes('negocio')) score += 25;
    if (leadData.engagement_rate > 0.05) score += 10;
    
    return Math.min(score, 100);
  }

  private calculateConversionProbability(leadData: any): number {
    let probability = 30; // Base probability
    
    if (leadData.verified) probability += 25;
    if (leadData.followers_count > 5000) probability += 20;
    if (leadData.business_account) probability += 30;
    if (leadData.text?.includes('contacto') || leadData.text?.includes('colaborar')) probability += 15;
    
    return Math.min(probability, 95);
  }

  private async saveRealLeadToDatabase(lead: RealLead): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads_premium')
        .insert([{
          type: `Lead real de ${lead.platform}: ${lead.comment}`,
          source: 'real_api',
          profile: {
            platform: lead.platform,
            username: lead.username,
            comment: lead.comment,
            timestamp: lead.timestamp.toISOString(),
            leadScore: lead.leadScore,
            conversionProbability: lead.conversionProbability
          },
          status: lead.leadScore > 80 ? 'hot' : 'warm',
          form_url: 'https://qrco.de/bg2hrs'
        }]);

      if (error) {
        console.error('Error guardando lead real en BD:', error);
      }
    } catch (error) {
      console.error('Error en saveRealLeadToDatabase:', error);
    }
  }

  private showRealLeadNotification(lead: RealLead): void {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 18px; border-radius: 12px; z-index: 10000; max-width: 380px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); border: 2px solid #ffd700;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <div style="width: 12px; height: 12px; background: #ffd700; border-radius: 50%; animation: pulse 1s infinite;"></div>
          <h3 style="margin: 0; font-size: 16px; font-weight: bold;">🎯 LEAD REAL CAPTURADO!</h3>
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
          <p style="margin: 0; font-size: 13px;"><strong>@${lead.username}</strong> (${lead.platform.toUpperCase()})</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">"${lead.comment.substring(0, 60)}..."</p>
          <div style="margin-top: 6px; display: flex; gap: 8px;">
            <span style="background: #059669; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Score: ${lead.leadScore}</span>
            <span style="background: #dc2626; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Conv: ${lead.conversionProbability}%</span>
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove();" style="background: white; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px; width: 100%;">
          CERRAR
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 12000);
  }

  // Métodos públicos
  async getLeads(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('leads_premium')
        .select('*')
        .eq('source', 'real_api')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error obteniendo leads reales:', error);
        return this.realLeads; // Fallback a leads en memoria
      }

      return data || this.realLeads;
    } catch (error) {
      console.error('Error en getLeads:', error);
      return this.realLeads;
    }
  }

  getLeadStats(): any {
    const totalLeads = this.realLeads.length;
    const hotLeads = this.realLeads.filter(l => l.leadScore > 80).length;
    const platforms = oauthManager.getAllConnectedPlatforms();
    
    const platformStats: any = {};
    platforms.forEach(platform => {
      const platformLeads = this.realLeads.filter(l => l.platform === platform);
      platformStats[platform] = {
        count: platformLeads.length,
        averageScore: platformLeads.length > 0 
          ? Math.round(platformLeads.reduce((sum, l) => sum + l.leadScore, 0) / platformLeads.length)
          : 0
      };
    });

    return {
      total: totalLeads,
      premium: hotLeads,
      averageScore: totalLeads > 0 
        ? Math.round(this.realLeads.reduce((sum, l) => sum + l.leadScore, 0) / totalLeads)
        : 0,
      conversionRate: totalLeads > 0 
        ? Math.round(this.realLeads.reduce((sum, l) => sum + l.conversionProbability, 0) / totalLeads)
        : 0,
      platforms: platformStats,
      realDataOnly: true,
      connectedPlatforms: platforms.length
    };
  }

  getSystemStatus(): any {
    return {
      capturing: this.isCapturing,
      connectedPlatforms: oauthManager.getAllConnectedPlatforms(),
      totalRealLeads: this.realLeads.length,
      systemHealth: autoErrorFixer.getInstance().getSystemHealth()
    };
  }
}

export const enhancedAyrshareLeadManager = EnhancedAyrshareLeadManager.getInstance();

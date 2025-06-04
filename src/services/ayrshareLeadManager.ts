
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
      const { data } = await supabase
        .from('ayrshare_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (data) {
        this.leads = data.map(this.transformSupabaseToLead);
        console.log(`📊 ${this.leads.length} leads cargados desde Ayrshare`);
      }
    } catch (error) {
      console.error('Error cargando leads de Ayrshare:', error);
    }
  }

  private transformSupabaseToLead(record: any): AyrshareLeadData {
    return {
      id: record.id,
      platform: record.platform,
      engagement: record.engagement || {},
      profile: record.profile || {},
      interaction: record.interaction || {},
      leadScore: record.lead_score || 0,
      conversionProbability: record.conversion_probability || 0,
      businessPotential: record.business_potential || 'medium',
      demographics: record.demographics || {}
    };
  }

  private async captureLeadsFromAyrshare(): Promise<void> {
    try {
      console.log('🔍 Capturando leads desde Ayrshare Analytics...');

      // Obtener analytics de todas las plataformas
      const platforms = ['instagram', 'facebook', 'linkedin', 'tiktok'];
      
      for (const platform of platforms) {
        await this.processPlatformAnalytics(platform);
      }
    } catch (error) {
      console.error('Error capturando leads de Ayrshare:', error);
    }
  }

  private async processPlatformAnalytics(platform: string): Promise<void> {
    try {
      const analytics = await AyrshareService.getAnalytics(platform);
      
      if (analytics && analytics.posts) {
        for (const post of analytics.posts) {
          await this.extractLeadsFromPost(post, platform);
        }
      }
    } catch (error) {
      console.error(`Error procesando analytics de ${platform}:`, error);
    }
  }

  private async extractLeadsFromPost(post: any, platform: string): Promise<void> {
    // Extraer leads de interacciones del post
    const interactions = post.interactions || [];
    
    for (const interaction of interactions) {
      if (this.isQualifiedLead(interaction)) {
        const leadData = await this.createLeadFromInteraction(interaction, platform, post);
        await this.saveLead(leadData);
      }
    }
  }

  private isQualifiedLead(interaction: any): boolean {
    // Criterios para calificar un lead
    const qualificationCriteria = {
      minFollowers: 100,
      minEngagementRate: 0.02,
      hasBusinessKeywords: false,
      isVerified: false,
      hasContactInfo: false
    };

    // Verificar seguidores
    if (interaction.profile?.followers < qualificationCriteria.minFollowers) {
      return false;
    }

    // Verificar palabras clave de negocio en bio
    const businessKeywords = [
      'entrepreneur', 'business', 'CEO', 'founder', 'startup', 'company',
      'emprendedor', 'negocio', 'empresa', 'empresario', 'coach',
      'consultant', 'freelancer', 'manager', 'director', 'owner'
    ];

    const bio = (interaction.profile?.bio || '').toLowerCase();
    qualificationCriteria.hasBusinessKeywords = businessKeywords.some(keyword => 
      bio.includes(keyword)
    );

    // Puntuar como lead calificado
    return (
      qualificationCriteria.hasBusinessKeywords ||
      interaction.profile?.verified ||
      interaction.profile?.followers > 1000 ||
      this.hasHighEngagement(interaction)
    );
  }

  private hasHighEngagement(interaction: any): boolean {
    const engagement = interaction.engagement || {};
    const totalEngagement = (engagement.likes || 0) + (engagement.comments || 0) + (engagement.shares || 0);
    const followers = interaction.profile?.followers || 1;
    
    return (totalEngagement / followers) > 0.05; // 5% engagement rate
  }

  private async createLeadFromInteraction(interaction: any, platform: string, post: any): Promise<AyrshareLeadData> {
    const leadScore = this.calculateLeadScore(interaction);
    const conversionProbability = this.calculateConversionProbability(interaction);
    
    return {
      id: `${platform}_${interaction.id}_${Date.now()}`,
      platform,
      engagement: interaction.engagement || {},
      profile: {
        username: interaction.profile?.username || '',
        fullName: interaction.profile?.fullName || '',
        followers: interaction.profile?.followers || 0,
        verified: interaction.profile?.verified || false,
        bio: interaction.profile?.bio || '',
        location: interaction.profile?.location
      },
      interaction: {
        type: interaction.type,
        timestamp: new Date(interaction.timestamp),
        content: interaction.content
      },
      leadScore,
      conversionProbability,
      businessPotential: this.assessBusinessPotential(interaction),
      demographics: {
        estimatedAge: this.estimateAge(interaction.profile),
        interests: this.extractInterests(interaction.profile?.bio || ''),
        activityLevel: this.assessActivityLevel(interaction),
        engagementQuality: this.assessEngagementQuality(interaction)
      }
    };
  }

  private calculateLeadScore(interaction: any): number {
    let score = 0;
    
    // Puntos por seguidores
    const followers = interaction.profile?.followers || 0;
    if (followers > 10000) score += 30;
    else if (followers > 5000) score += 20;
    else if (followers > 1000) score += 15;
    else if (followers > 500) score += 10;
    else if (followers > 100) score += 5;

    // Puntos por verificación
    if (interaction.profile?.verified) score += 25;

    // Puntos por palabras clave de negocio
    const businessKeywords = ['CEO', 'entrepreneur', 'business', 'company', 'startup'];
    const bio = (interaction.profile?.bio || '').toLowerCase();
    const businessKeywordCount = businessKeywords.filter(keyword => 
      bio.includes(keyword.toLowerCase())
    ).length;
    score += businessKeywordCount * 10;

    // Puntos por engagement
    const engagementRate = this.calculateEngagementRate(interaction);
    if (engagementRate > 0.1) score += 20;
    else if (engagementRate > 0.05) score += 15;
    else if (engagementRate > 0.02) score += 10;

    // Puntos por tipo de interacción
    switch (interaction.type) {
      case 'comment': score += 15; break;
      case 'share': score += 20; break;
      case 'dm': score += 25; break;
      case 'follow': score += 10; break;
      case 'like': score += 5; break;
    }

    return Math.min(100, score);
  }

  private calculateConversionProbability(interaction: any): number {
    const leadScore = this.calculateLeadScore(interaction);
    const businessPotential = this.assessBusinessPotential(interaction);
    
    let probability = leadScore * 0.6; // Base del lead score
    
    // Ajustar por potencial de negocio
    switch (businessPotential) {
      case 'premium': probability += 30; break;
      case 'high': probability += 20; break;
      case 'medium': probability += 10; break;
      case 'low': probability += 0; break;
    }

    // Ajustar por tipo de interacción
    if (interaction.type === 'dm') probability += 15;
    if (interaction.type === 'comment') probability += 10;

    return Math.min(100, probability);
  }

  private assessBusinessPotential(interaction: any): 'low' | 'medium' | 'high' | 'premium' {
    const followers = interaction.profile?.followers || 0;
    const bio = (interaction.profile?.bio || '').toLowerCase();
    const isVerified = interaction.profile?.verified;

    // Premium: Verified + Business keywords + High followers
    if (isVerified && followers > 10000 && this.hasBusinessKeywords(bio)) {
      return 'premium';
    }

    // High: Business keywords + Good followers OR Verified
    if ((this.hasBusinessKeywords(bio) && followers > 5000) || isVerified) {
      return 'high';
    }

    // Medium: Some business indicators
    if (this.hasBusinessKeywords(bio) || followers > 1000) {
      return 'medium';
    }

    return 'low';
  }

  private hasBusinessKeywords(bio: string): boolean {
    const keywords = [
      'ceo', 'entrepreneur', 'business', 'company', 'startup', 'founder',
      'emprendedor', 'empresa', 'negocio', 'empresario', 'coach',
      'consultant', 'manager', 'director', 'owner', 'freelancer'
    ];
    
    return keywords.some(keyword => bio.includes(keyword));
  }

  private calculateEngagementRate(interaction: any): number {
    const engagement = interaction.engagement || {};
    const totalEngagement = (engagement.likes || 0) + (engagement.comments || 0) + (engagement.shares || 0);
    const followers = interaction.profile?.followers || 1;
    
    return totalEngagement / followers;
  }

  private estimateAge(profile: any): number {
    // Algoritmo básico para estimar edad basado en patrones
    const bio = (profile?.bio || '').toLowerCase();
    
    if (bio.includes('gen z') || bio.includes('student')) return 22;
    if (bio.includes('millennial') || bio.includes('startup')) return 30;
    if (bio.includes('ceo') || bio.includes('director')) return 40;
    if (bio.includes('senior') || bio.includes('veteran')) return 50;
    
    return 35; // Default
  }

  private extractInterests(bio: string): string[] {
    const interestKeywords = [
      'fitness', 'health', 'wellness', 'business', 'technology', 'travel',
      'food', 'fashion', 'sports', 'music', 'art', 'photography',
      'bienestar', 'salud', 'tecnología', 'viajes', 'deporte', 'música'
    ];
    
    return interestKeywords.filter(interest => 
      bio.toLowerCase().includes(interest)
    );
  }

  private assessActivityLevel(interaction: any): 'low' | 'medium' | 'high' {
    const engagement = interaction.engagement || {};
    const totalActivity = (engagement.likes || 0) + (engagement.comments || 0) + (engagement.shares || 0);
    
    if (totalActivity > 100) return 'high';
    if (totalActivity > 20) return 'medium';
    return 'low';
  }

  private assessEngagementQuality(interaction: any): number {
    const engagementRate = this.calculateEngagementRate(interaction);
    return Math.min(100, engagementRate * 1000); // Convertir a porcentaje
  }

  private async saveLead(leadData: AyrshareLeadData): Promise<void> {
    try {
      // Verificar si el lead ya existe
      const existingLeadIndex = this.leads.findIndex(lead => 
        lead.profile.username === leadData.profile.username && 
        lead.platform === leadData.platform
      );

      if (existingLeadIndex !== -1) {
        // Actualizar lead existente
        this.leads[existingLeadIndex] = { ...this.leads[existingLeadIndex], ...leadData };
      } else {
        // Agregar nuevo lead
        this.leads.push(leadData);
      }

      // Guardar en Supabase
      await supabase
        .from('ayrshare_leads')
        .upsert({
          id: leadData.id,
          platform: leadData.platform,
          engagement: leadData.engagement,
          profile: leadData.profile,
          interaction: leadData.interaction,
          lead_score: leadData.leadScore,
          conversion_probability: leadData.conversionProbability,
          business_potential: leadData.businessPotential,
          demographics: leadData.demographics,
          updated_at: new Date().toISOString()
        });

      console.log(`✅ Lead guardado: ${leadData.profile.username} (${leadData.leadScore}/100)`);
      
      // Notificar si es un lead de alta calidad
      if (leadData.leadScore >= 80) {
        this.notifyHighQualityLead(leadData);
      }
      
    } catch (error) {
      console.error('Error guardando lead:', error);
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
    // Sincronizar analytics cada 5 minutos
    setInterval(() => {
      this.syncAnalyticsData();
    }, 300000);
  }

  private async syncAnalyticsData(): Promise<void> {
    try {
      const analytics = await AyrshareService.getAnalytics();
      this.analyticsCache.set('latest', {
        data: analytics,
        timestamp: Date.now()
      });

      console.log('📊 Analytics sincronizados con Ayrshare');
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
    return {
      total: this.leads.length,
      premium: this.leads.filter(l => l.businessPotential === 'premium').length,
      high: this.leads.filter(l => l.businessPotential === 'high').length,
      averageScore: this.leads.reduce((acc, lead) => acc + lead.leadScore, 0) / this.leads.length || 0,
      conversionRate: this.leads.reduce((acc, lead) => acc + lead.conversionProbability, 0) / this.leads.length || 0,
      platforms: this.getLeadsByPlatformStats()
    };
  }

  private getLeadsByPlatformStats(): any {
    const platforms = ['instagram', 'facebook', 'linkedin', 'tiktok'];
    const stats: any = {};
    
    platforms.forEach(platform => {
      const platformLeads = this.getLeadsByPlatform(platform);
      stats[platform] = {
        count: platformLeads.length,
        averageScore: platformLeads.reduce((acc, lead) => acc + lead.leadScore, 0) / platformLeads.length || 0
      };
    });
    
    return stats;
  }
}

export const ayrshareLeadManager = AyrshareLeadManager.getInstance();

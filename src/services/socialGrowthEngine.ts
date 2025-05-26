
export interface GrowthMetrics {
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
}

export interface SocialNetwork {
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  profile: string;
  autoMode24_7: boolean;
  verified: boolean;
  growthMetrics: GrowthMetrics;
  lastUpdate: string;
  connectionTime: string;
}

export class AggressiveGrowthEngine {
  private static conservativeGrowthMultipliers = {
    Facebook: { followers: 0.5, engagement: 0.8, leads: 1.0 },
    Instagram: { followers: 0.7, engagement: 1.0, leads: 0.9 },
    LinkedIn: { followers: 0.3, engagement: 0.6, leads: 1.2 },
    TikTok: { followers: 1.0, engagement: 1.5, leads: 0.8 }
  };

  static generateConservativeGrowth(networkName: string, currentMetrics: GrowthMetrics): GrowthMetrics {
    const multiplier = this.conservativeGrowthMultipliers[networkName as keyof typeof this.conservativeGrowthMultipliers] || 
                     { followers: 0.5, engagement: 0.8, leads: 1.0 };

    // Crecimiento MÍNIMO y realista - rangos bajos
    const conservativeGrowth = {
      followersGained: Math.floor((Math.random() * 3 + 1) * multiplier.followers), // 1-3 seguidores máximo
      engagementRate: Math.min(8, currentMetrics.engagementRate + (Math.random() * 0.2 * multiplier.engagement)), // Máximo 8%
      leadsGenerated: Math.floor((Math.random() * 2 + 1) * multiplier.leads), // 1-2 leads máximo
      postsCreated: Math.floor(Math.random() * 2 + 1), // 1-2 posts
      commentsResponded: Math.floor(Math.random() * 5 + 2), // 2-6 comentarios
      storiesPosted: Math.floor(Math.random() * 2 + 1), // 1-2 stories
      reachIncreased: Math.floor((Math.random() * 50 + 20) * multiplier.engagement), // 20-70 alcance
      impressions: Math.floor((Math.random() * 100 + 50) * multiplier.engagement), // 50-150 impresiones
      saves: Math.floor((Math.random() * 5 + 2) * multiplier.engagement), // 2-7 guardados
      shares: Math.floor((Math.random() * 3 + 1) * multiplier.engagement), // 1-4 compartidos
      profileVisits: Math.floor((Math.random() * 10 + 5) * multiplier.followers), // 5-15 visitas
      websiteClicks: Math.floor((Math.random() * 3 + 1) * multiplier.leads) // 1-4 clics
    };

    console.log(`📊 Crecimiento CONSERVADOR REALISTA para ${networkName}:`, conservativeGrowth);
    
    return {
      followersGained: currentMetrics.followersGained + conservativeGrowth.followersGained,
      engagementRate: conservativeGrowth.engagementRate,
      leadsGenerated: currentMetrics.leadsGenerated + conservativeGrowth.leadsGenerated,
      postsCreated: currentMetrics.postsCreated + conservativeGrowth.postsCreated,
      commentsResponded: currentMetrics.commentsResponded + conservativeGrowth.commentsResponded,
      storiesPosted: currentMetrics.storiesPosted + conservativeGrowth.storiesPosted,
      reachIncreased: currentMetrics.reachIncreased + conservativeGrowth.reachIncreased,
      impressions: currentMetrics.impressions + conservativeGrowth.impressions,
      saves: currentMetrics.saves + conservativeGrowth.saves,
      shares: currentMetrics.shares + conservativeGrowth.shares,
      profileVisits: currentMetrics.profileVisits + conservativeGrowth.profileVisits,
      websiteClicks: currentMetrics.websiteClicks + conservativeGrowth.websiteClicks
    };
  }

  static generateRealisticContent(networkName: string): string[] {
    const realContentStrategies = {
      Instagram: [
        "📝 SIMULACIÓN: Post programado sobre SuperPatch para alivio del dolor - (Para publicación real necesitas Instagram Graph API)",
        "💬 SIMULACIÓN: Respuesta automática a comentarios redirigiendo a WhatsApp +34654669289",
        "📱 SIMULACIÓN: Story destacando testimonios reales de SuperPatch",
        "🔄 NOTA: Para automatización real necesitas conectar APIs oficiales de Instagram"
      ],
      Facebook: [
        "📝 SIMULACIÓN: Post sobre beneficios de SuperPatch vs medicamentos tradicionales",
        "💬 SIMULACIÓN: Respuestas automáticas en comentarios dirigiendo a WhatsApp empresarial",
        "📊 SIMULACIÓN: Contenido viral sobre casos de éxito con SuperPatch",
        "🔄 NOTA: Para automatización real necesitas Facebook Graph API y permisos"
      ],
      LinkedIn: [
        "💼 SIMULACIÓN: Post B2B sobre oportunidades de distribución SuperPatch",
        "🤝 SIMULACIÓN: Conexiones con profesionales del sector wellness",
        "📈 SIMULACIÓN: Artículo sobre ROI en el negocio de productos para el dolor",
        "🔄 NOTA: Para automatización real necesitas LinkedIn API"
      ],
      TikTok: [
        "🎵 SIMULACIÓN: Video trending sobre SuperPatch con hashtags #DolorCronico #SuperPatch",
        "⚡ SIMULACIÓN: Respuesta a comentarios con info de contacto WhatsApp",
        "🔥 SIMULACIÓN: Challenge viral mostrando efectividad de SuperPatch",
        "🔄 NOTA: TikTok no permite automatización completa - requiere publicación manual"
      ]
    };

    const networkContent = realContentStrategies[networkName as keyof typeof realContentStrategies] || realContentStrategies.Instagram;
    return networkContent.slice(0, 2 + Math.floor(Math.random() * 2));
  }

  static generateWhatsAppLeadNotification(): string[] {
    const leadNotifications = [
      "🔔 LEAD POTENCIAL: Usuario interesado en SuperPatch desde Instagram - Contactar WhatsApp +34654669289",
      "💰 OPORTUNIDAD: Empresario pregunta por distribución SuperPatch - WhatsApp +34654669289",
      "🎯 LEAD CALIFICADO: Cliente con dolor crónico busca solución - Contacto directo WhatsApp",
      "💼 B2B LEAD: Fisioterapeuta interesado en SuperPatch para clínica - WhatsApp +34654669289"
    ];
    
    return [leadNotifications[Math.floor(Math.random() * leadNotifications.length)]];
  }
}

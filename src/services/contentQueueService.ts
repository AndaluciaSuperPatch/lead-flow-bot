
interface QueuedContent {
  id: string;
  text: string;
  platforms: string[];
  mediaUrls?: string[];
  scheduledAt: Date;
  status: 'pending' | 'published' | 'failed';
  priority: 'low' | 'medium' | 'high';
  hashtags: string[];
  targetAudience: string;
  contentType: 'promotion' | 'educational' | 'engagement' | 'sales';
}

interface AutomationSchedule {
  platform: string;
  times: string[];
  days: string[];
  frequency: number;
}

export class ContentQueueService {
  private static queue: QueuedContent[] = [];
  private static isProcessing = false;
  private static schedules: AutomationSchedule[] = [
    {
      platform: 'instagramApi',
      times: ['08:00', '12:00', '17:00', '19:00', '21:00'],
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      frequency: 3
    },
    {
      platform: 'facebook',
      times: ['09:00', '13:00', '15:00', '18:00', '20:00'],
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      frequency: 2
    },
    {
      platform: 'tiktok',
      times: ['06:00', '10:00', '14:00', '19:00', '22:00'],
      days: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      frequency: 2
    },
    {
      platform: 'linkedin',
      times: ['08:00', '10:00', '12:00', '14:00', '17:00'],
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      frequency: 1
    }
  ];

  static addToQueue(content: Omit<QueuedContent, 'id' | 'status'>): string {
    const id = crypto.randomUUID();
    const queuedContent: QueuedContent = {
      ...content,
      id,
      status: 'pending'
    };
    
    this.queue.push(queuedContent);
    this.sortQueueByPriority();
    console.log('📝 Contenido añadido a la cola:', queuedContent);
    
    return id;
  }

  static getQueue(): QueuedContent[] {
    return [...this.queue];
  }

  static removeFromQueue(id: string): boolean {
    const index = this.queue.findIndex(item => item.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  static updateContentStatus(id: string, status: QueuedContent['status']): void {
    const content = this.queue.find(item => item.id === id);
    if (content) {
      content.status = status;
    }
  }

  private static sortQueueByPriority(): void {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    this.queue.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
    });
  }

  static startAutomationEngine(): void {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log('🚀 Motor de automatización iniciado');

    // Procesar cola cada 30 segundos
    setInterval(() => {
      this.processQueue();
    }, 30000);

    // Generar contenido automático cada hora
    setInterval(() => {
      this.generateAutomaticContent();
    }, 3600000);
  }

  private static async processQueue(): Promise<void> {
    const now = new Date();
    const readyContent = this.queue.filter(
      content => content.status === 'pending' && content.scheduledAt <= now
    );

    for (const content of readyContent) {
      try {
        await this.publishContent(content);
        content.status = 'published';
        console.log('✅ Contenido publicado automáticamente:', content.id);
      } catch (error) {
        content.status = 'failed';
        console.error('❌ Error en publicación automática:', error);
      }
    }
  }

  private static async publishContent(content: QueuedContent): Promise<void> {
    const { AyrshareService } = await import('./ayrshareService');
    
    await AyrshareService.publishPost({
      post: content.text + "\n\n📱 Contacto directo: +34654669289",
      platforms: content.platforms,
      mediaUrls: content.mediaUrls,
      hashtags: content.hashtags
    });
  }

  private static generateAutomaticContent(): void {
    const templates = [
      {
        text: "🔥 ¡Descubre el poder de SuperPatch! \n\n✨ Tecnología revolucionaria para el bienestar\n💪 Resultados comprobados científicamente\n🌟 Miles de testimonios reales",
        hashtags: ['#SuperPatch', '#BienestarNatural', '#TecnologíaWearable', '#VidaSinDolor'],
        contentType: 'promotion' as const,
        targetAudience: 'general'
      },
      {
        text: "💼 ¿Buscas una oportunidad de negocio REAL? \n\n🚀 Únete a la revolución del wellness\n💰 Ingresos residuales garantizados\n📈 Crecimiento exponencial asegurado",
        hashtags: ['#OportunidadNegocio', '#EmprendimientoWellness', '#ÉxitoFinanciero', '#LibertadEconomica'],
        contentType: 'sales' as const,
        targetAudience: 'entrepreneurs'
      },
      {
        text: "🎯 TESTIMONIO REAL: 'SuperPatch cambió mi vida completamente' \n\n✅ Adiós al dolor crónico\n✅ Más energía y vitalidad\n✅ Calidad de vida superior",
        hashtags: ['#TestimonioReal', '#CambioDeVida', '#SuperPatch', '#TransformaciónPersonal'],
        contentType: 'engagement' as const,
        targetAudience: 'health_conscious'
      }
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const platforms = ['instagramApi', 'facebook', 'tiktok', 'linkedin'];
    const scheduledAt = new Date(Date.now() + Math.random() * 3600000 * 24); // Próximas 24 horas

    this.addToQueue({
      text: template.text,
      platforms,
      scheduledAt,
      priority: 'medium',
      hashtags: template.hashtags,
      targetAudience: template.targetAudience,
      contentType: template.contentType
    });
  }

  static getOptimalScheduleForPlatform(platform: string): AutomationSchedule | undefined {
    return this.schedules.find(s => s.platform === platform);
  }

  static getQueueStats() {
    const total = this.queue.length;
    const pending = this.queue.filter(c => c.status === 'pending').length;
    const published = this.queue.filter(c => c.status === 'published').length;
    const failed = this.queue.filter(c => c.status === 'failed').length;

    return { total, pending, published, failed };
  }
}

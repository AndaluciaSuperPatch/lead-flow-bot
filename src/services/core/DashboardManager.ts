
interface Metrics {
  conversions: number;
  activeBots: number;
  revenue: number;
  leads: number;
  engagement: number;
  socialReach: number;
}

interface Performance {
  daily: Metrics;
  weekly: Metrics;
  monthly: Metrics;
  realTime: any;
}

export class DashboardManager {
  private metrics: Performance = {
    daily: { conversions: 0, activeBots: 0, revenue: 0, leads: 0, engagement: 0, socialReach: 0 },
    weekly: { conversions: 0, activeBots: 0, revenue: 0, leads: 0, engagement: 0, socialReach: 0 },
    monthly: { conversions: 0, activeBots: 0, revenue: 0, leads: 0, engagement: 0, socialReach: 0 },
    realTime: {}
  };
  
  private monitoringInterval?: NodeJS.Timeout;
  private listeners: Array<(metrics: Performance) => void> = [];

  monitorPerformance(): void {
    console.log('📊 Iniciando monitoreo de rendimiento...');
    
    // Actualizar métricas cada 5 segundos
    this.monitoringInterval = setInterval(() => {
      this.updateMetrics();
      this.notifyListeners();
    }, 5000);

    // Simular datos iniciales
    this.generateMockData();
  }

  private updateMetrics(): void {
    // Simulación de métricas en tiempo real
    this.metrics.realTime = {
      timestamp: new Date(),
      activeUsers: Math.floor(Math.random() * 50) + 20,
      currentRevenue: this.metrics.daily.revenue + Math.random() * 100,
      botActivity: this.generateBotActivity(),
      socialMetrics: this.generateSocialMetrics()
    };

    // Actualizar métricas diarias incrementalmente
    if (Math.random() > 0.7) { // 30% probabilidad cada 5 segundos
      this.metrics.daily.conversions += Math.floor(Math.random() * 3);
      this.metrics.daily.revenue += Math.random() * 200;
      this.metrics.daily.leads += Math.floor(Math.random() * 5);
    }
  }

  private generateBotActivity() {
    return {
      instagram: {
        actions: Math.floor(Math.random() * 100) + 50,
        success: Math.floor(Math.random() * 20) + 80, // 80-100% success
        lastAction: new Date(Date.now() - Math.random() * 300000) // Últimos 5 min
      },
      whatsapp: {
        messages: Math.floor(Math.random() * 30) + 10,
        responses: Math.floor(Math.random() * 25) + 8,
        conversions: Math.floor(Math.random() * 5) + 1
      },
      tiktok: {
        interactions: Math.floor(Math.random() * 200) + 100,
        reach: Math.floor(Math.random() * 1000) + 500
      },
      linkedin: {
        connections: Math.floor(Math.random() * 20) + 10,
        messages: Math.floor(Math.random() * 15) + 5
      }
    };
  }

  private generateSocialMetrics() {
    return {
      totalReach: Math.floor(Math.random() * 5000) + 2000,
      engagement: Math.floor(Math.random() * 1000) + 500,
      shares: Math.floor(Math.random() * 100) + 50,
      comments: Math.floor(Math.random() * 200) + 100,
      mentions: Math.floor(Math.random() * 50) + 20
    };
  }

  private generateMockData(): void {
    // Datos diarios
    this.metrics.daily = {
      conversions: Math.floor(Math.random() * 15) + 5,
      activeBots: 4,
      revenue: Math.floor(Math.random() * 2000) + 1000,
      leads: Math.floor(Math.random() * 50) + 20,
      engagement: Math.floor(Math.random() * 500) + 300,
      socialReach: Math.floor(Math.random() * 3000) + 1500
    };

    // Datos semanales
    this.metrics.weekly = {
      conversions: this.metrics.daily.conversions * 7 + Math.floor(Math.random() * 20),
      activeBots: 4,
      revenue: this.metrics.daily.revenue * 7 + Math.floor(Math.random() * 5000),
      leads: this.metrics.daily.leads * 7 + Math.floor(Math.random() * 100),
      engagement: this.metrics.daily.engagement * 7,
      socialReach: this.metrics.daily.socialReach * 7
    };

    // Datos mensuales
    this.metrics.monthly = {
      conversions: this.metrics.weekly.conversions * 4 + Math.floor(Math.random() * 50),
      activeBots: 4,
      revenue: this.metrics.weekly.revenue * 4 + Math.floor(Math.random() * 10000),
      leads: this.metrics.weekly.leads * 4 + Math.floor(Math.random() * 200),
      engagement: this.metrics.weekly.engagement * 4,
      socialReach: this.metrics.weekly.socialReach * 4
    };
  }

  getMetrics(): Performance {
    return { ...this.metrics };
  }

  getRealtimeMetrics(): any {
    return this.metrics.realTime;
  }

  onMetricsUpdate(callback: (metrics: Performance) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback(this.metrics);
      } catch (error) {
        console.error('Error notificando listener:', error);
      }
    });
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
      console.log('⏹️ Monitoreo de rendimiento detenido');
    }
  }

  generateReport(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const data = this.metrics[period];
    const roi = data.revenue > 0 ? ((data.revenue - (data.leads * 10)) / (data.leads * 10)) * 100 : 0;
    
    return {
      period,
      timestamp: new Date(),
      metrics: data,
      calculated: {
        conversionRate: data.leads > 0 ? (data.conversions / data.leads) * 100 : 0,
        avgRevenuePerLead: data.leads > 0 ? data.revenue / data.leads : 0,
        roi: Math.round(roi * 100) / 100,
        engagementRate: data.socialReach > 0 ? (data.engagement / data.socialReach) * 100 : 0
      },
      recommendations: this.generateRecommendations(data)
    };
  }

  private generateRecommendations(data: Metrics): string[] {
    const recommendations: string[] = [];
    
    if (data.conversions < 10) {
      recommendations.push('Optimizar bots para mejor conversión');
    }
    
    if (data.engagement < 300) {
      recommendations.push('Incrementar frecuencia de publicaciones');
    }
    
    if (data.leads < 20) {
      recommendations.push('Expandir targeting de audiencia');
    }
    
    if (data.revenue < 1500) {
      recommendations.push('Implementar estrategias de upselling');
    }
    
    return recommendations;
  }
}

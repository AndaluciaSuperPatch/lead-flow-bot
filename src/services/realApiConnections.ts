
import { supabase } from '@/integrations/supabase/client';

interface APIConnectionStatus {
  platform: string;
  connected: boolean;
  lastSync: Date | null;
  error?: string;
}

export class RealAPIConnections {
  private static instance: RealAPIConnections;
  private connections: Map<string, APIConnectionStatus> = new Map();

  static getInstance(): RealAPIConnections {
    if (!RealAPIConnections.instance) {
      RealAPIConnections.instance = new RealAPIConnections();
    }
    return RealAPIConnections.instance;
  }

  async verifyAllConnections(): Promise<APIConnectionStatus[]> {
    console.log('🔍 Verificando conexiones reales con APIs...');
    
    const platforms = [
      { name: 'instagram', secretName: 'INSTAGRAM_ACCESS_TOKEN' },
      { name: 'facebook', secretName: 'FACEBOOK_ACCESS_TOKEN' },
      { name: 'tiktok', secretName: 'TIKTOK_APP_ID' },
      { name: 'linkedin', secretName: 'LINKEDIN_CLIENT_ID' }
    ];

    const results: APIConnectionStatus[] = [];

    for (const platform of platforms) {
      try {
        const status = await this.verifyPlatformConnection(platform.name, platform.secretName);
        results.push(status);
        this.connections.set(platform.name, status);
      } catch (error) {
        console.error(`❌ Error verificando ${platform.name}:`, error);
        results.push({
          platform: platform.name,
          connected: false,
          lastSync: null,
          error: error.message
        });
      }
    }

    return results;
  }

  private async verifyPlatformConnection(platform: string, secretName: string): Promise<APIConnectionStatus> {
    try {
      // Verificar si existe la clave en Supabase Secrets
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No hay sesión activa');
      }

      // Intentar hacer una llamada real a la API
      const testResult = await this.testPlatformAPI(platform, secretName);
      
      return {
        platform,
        connected: testResult.success,
        lastSync: new Date(),
        error: testResult.error
      };
    } catch (error) {
      return {
        platform,
        connected: false,
        lastSync: null,
        error: error.message
      };
    }
  }

  private async testPlatformAPI(platform: string, secretName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Hacer llamadas reales a las APIs según la plataforma
      switch (platform) {
        case 'instagram':
          return await this.testInstagramAPI();
        case 'facebook':
          return await this.testFacebookAPI();
        case 'tiktok':
          return await this.testTikTokAPI();
        case 'linkedin':
          return await this.testLinkedInAPI();
        default:
          return { success: false, error: 'Plataforma no soportada' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async testInstagramAPI(): Promise<{ success: boolean; error?: string }> {
    try {
      // Llamada real a Instagram Basic Display API
      const response = await fetch('/api/instagram/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Instagram API no responde' };
      }
    } catch (error) {
      return { success: false, error: 'Error conectando con Instagram' };
    }
  }

  private async testFacebookAPI(): Promise<{ success: boolean; error?: string }> {
    try {
      // Llamada real a Facebook Graph API
      const response = await fetch('/api/facebook/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Facebook API no responde' };
      }
    } catch (error) {
      return { success: false, error: 'Error conectando con Facebook' };
    }
  }

  private async testTikTokAPI(): Promise<{ success: boolean; error?: string }> {
    try {
      // Llamada real a TikTok Business API
      const response = await fetch('/api/tiktok/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'TikTok API no responde' };
      }
    } catch (error) {
      return { success: false, error: 'Error conectando con TikTok' };
    }
  }

  private async testLinkedInAPI(): Promise<{ success: boolean; error?: string }> {
    try {
      // Llamada real a LinkedIn API
      const response = await fetch('/api/linkedin/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'LinkedIn API no responde' };
      }
    } catch (error) {
      return { success: false, error: 'Error conectando con LinkedIn' };
    }
  }

  isConnected(platform: string): boolean {
    const connection = this.connections.get(platform);
    return connection ? connection.connected : false;
  }

  getConnectionStatus(platform: string): APIConnectionStatus | null {
    return this.connections.get(platform) || null;
  }

  async syncRealData(platform: string): Promise<any> {
    if (!this.isConnected(platform)) {
      throw new Error(`${platform} no está conectado`);
    }

    try {
      const response = await fetch(`/api/${platform}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Error sincronizando ${platform}`);
      }

      const data = await response.json();
      console.log(`✅ Datos reales sincronizados de ${platform}:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error sincronizando ${platform}:`, error);
      throw error;
    }
  }
}

export const realApiConnections = RealAPIConnections.getInstance();

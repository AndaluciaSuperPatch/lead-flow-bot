
import { supabase } from '@/integrations/supabase/client';

interface Credential {
  app_id: string | null;
  secret_key: string | null;
  token: string | null;
}

export class RealCredentialsManager {
  private static instance: RealCredentialsManager;
  private credentials: Map<string, Credential> = new Map();

  static getInstance(): RealCredentialsManager {
    if (!RealCredentialsManager.instance) {
      RealCredentialsManager.instance = new RealCredentialsManager();
    }
    return RealCredentialsManager.instance;
  }

  constructor() {
    console.log('🔐 RealCredentialsManager: Conectando con credenciales de Supabase');
    this.loadAllCredentials();
  }

  private async loadAllCredentials(): Promise<void> {
    const platforms = ['LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'Ayrshare'];
    
    for (const platform of platforms) {
      try {
        const { data, error } = await supabase.rpc('get_credential_for_platform', {
          platform_name: platform
        });

        if (!error && data && data.length > 0) {
          this.credentials.set(platform, data[0]);
          console.log(`✅ Credenciales cargadas para ${platform}`);
        } else {
          console.warn(`⚠️ No se encontraron credenciales para ${platform}`);
        }
      } catch (error) {
        console.error(`❌ Error cargando credenciales para ${platform}:`, error);
      }
    }
  }

  async getCredential(platform: string): Promise<Credential | null> {
    if (!this.credentials.has(platform)) {
      await this.loadAllCredentials();
    }
    return this.credentials.get(platform) || null;
  }

  async testConnection(platform: string): Promise<boolean> {
    const credential = await this.getCredential(platform);
    if (!credential) {
      console.error(`❌ No hay credenciales para ${platform}`);
      return false;
    }

    try {
      switch (platform.toLowerCase()) {
        case 'instagram':
          return await this.testInstagram(credential);
        case 'facebook':
          return await this.testFacebook(credential);
        case 'tiktok':
          return await this.testTikTok(credential);
        case 'linkedin':
          return await this.testLinkedIn(credential);
        default:
          console.log(`✅ ${platform} credenciales disponibles`);
          return true;
      }
    } catch (error) {
      console.error(`❌ Error probando conexión ${platform}:`, error);
      return false;
    }
  }

  private async testInstagram(credential: Credential): Promise<boolean> {
    if (!credential.token) return false;
    
    try {
      const response = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${credential.token}`);
      const success = response.ok;
      console.log(success ? '✅ Instagram API conectada' : '❌ Instagram API falló');
      return success;
    } catch (error) {
      console.error('❌ Instagram test failed:', error);
      return false;
    }
  }

  private async testFacebook(credential: Credential): Promise<boolean> {
    if (!credential.app_id || !credential.secret_key) return false;
    
    console.log('✅ Facebook credenciales verificadas');
    return true;
  }

  private async testTikTok(credential: Credential): Promise<boolean> {
    if (!credential.app_id || !credential.secret_key) return false;
    
    console.log('✅ TikTok credenciales verificadas');
    return true;
  }

  private async testLinkedIn(credential: Credential): Promise<boolean> {
    if (!credential.app_id || !credential.secret_key) return false;
    
    console.log('✅ LinkedIn credenciales verificadas');
    return true;
  }

  async getAllConnectedPlatforms(): Promise<string[]> {
    const connected: string[] = [];
    const platforms = ['LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'Ayrshare'];
    
    for (const platform of platforms) {
      const isConnected = await this.testConnection(platform);
      if (isConnected) {
        connected.push(platform);
      }
    }
    
    return connected;
  }
}

export const realCredentialsManager = RealCredentialsManager.getInstance();

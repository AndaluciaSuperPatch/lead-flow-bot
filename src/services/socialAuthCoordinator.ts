
import { tiktokAuth, TikTokAuthConfig } from './tiktokAuthService';
import { facebookAuth, FacebookAuthConfig } from './facebookAuthService';
import { linkedinAuth, LinkedInAuthConfig } from './linkedinAuthService';

export interface SocialPlatformConfig {
  platform: 'tiktok' | 'facebook' | 'linkedin';
  config: TikTokAuthConfig | FacebookAuthConfig | LinkedInAuthConfig;
}

export interface PlatformStatus {
  platform: string;
  connected: boolean;
  hasValidToken: boolean;
  lastSync: string;
  error?: string;
}

export class SocialAuthCoordinator {
  private platforms: Map<string, any> = new Map();
  private statusCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    console.log('🌐 Social Auth Coordinator inicializado');
    
    // Registrar servicios
    this.platforms.set('tiktok', tiktokAuth);
    this.platforms.set('facebook', facebookAuth);
    this.platforms.set('linkedin', linkedinAuth);
    
    // Iniciar monitoreo automático
    this.startStatusMonitoring();
  }

  async initializePlatform(config: SocialPlatformConfig): Promise<string | boolean> {
    const service = this.platforms.get(config.platform);
    
    if (!service) {
      throw new Error(`Plataforma ${config.platform} no soportada`);
    }

    try {
      console.log(`🚀 Inicializando ${config.platform}...`);
      
      const result = await service.initialize(config.config);
      
      // TikTok retorna boolean, otros retornan URL
      if (typeof result === 'boolean') {
        console.log(`✅ ${config.platform} inicializado exitosamente`);
        return result;
      } else {
        console.log(`🔗 ${config.platform} requiere autorización: ${result}`);
        return result;
      }
    } catch (error) {
      console.error(`❌ Error inicializando ${config.platform}:`, error);
      throw error;
    }
  }

  async handlePlatformCallback(platform: string, code: string, state?: string): Promise<boolean> {
    const service = this.platforms.get(platform);
    
    if (!service || !service.handleCallback) {
      throw new Error(`Callback no soportado para ${platform}`);
    }

    try {
      console.log(`🔄 Procesando callback para ${platform}...`);
      const success = await service.handleCallback(code, state);
      
      if (success) {
        console.log(`✅ ${platform} conectado exitosamente`);
      }
      
      return success;
    } catch (error) {
      console.error(`❌ Error en callback de ${platform}:`, error);
      throw error;
    }
  }

  getAllPlatformStatuses(): PlatformStatus[] {
    const statuses: PlatformStatus[] = [];
    
    for (const [platformName, service] of this.platforms) {
      try {
        const status = service.getTokenStatus();
        
        statuses.push({
          platform: platformName,
          connected: status.hasToken,
          hasValidToken: status.isValid,
          lastSync: status.expiresAt || new Date().toISOString()
        });
      } catch (error) {
        statuses.push({
          platform: platformName,
          connected: false,
          hasValidToken: false,
          lastSync: new Date().toISOString(),
          error: error.message
        });
      }
    }
    
    return statuses;
  }

  getPlatformToken(platform: string): string | null {
    const service = this.platforms.get(platform);
    
    if (!service || !service.getAccessToken) {
      return null;
    }

    return service.getAccessToken();
  }

  async refreshAllTokens(): Promise<void> {
    console.log('🔄 Renovando todos los tokens...');
    
    const promises = Array.from(this.platforms.entries()).map(async ([name, service]) => {
      try {
        if (service.refreshToken) {
          await service.refreshToken();
          console.log(`✅ Token ${name} renovado`);
        }
      } catch (error) {
        console.error(`❌ Error renovando ${name}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  private startStatusMonitoring(): void {
    // Verificar estado cada 30 segundos
    this.statusCheckInterval = setInterval(() => {
      const statuses = this.getAllPlatformStatuses();
      
      // Log de estado general
      const connected = statuses.filter(s => s.hasValidToken).length;
      const total = statuses.length;
      
      console.log(`📊 Estado de plataformas: ${connected}/${total} conectadas`);
      
      // Alertar sobre tokens que expiran pronto
      statuses.forEach(status => {
        if (status.hasValidToken && status.lastSync) {
          const expiryTime = new Date(status.lastSync).getTime();
          const timeUntilExpiry = expiryTime - Date.now();
          
          // Alertar si expira en menos de 10 minutos
          if (timeUntilExpiry < 600000) {
            console.warn(`⚠️ Token de ${status.platform} expira pronto`);
          }
        }
      });
    }, 30000);
  }

  async disconnectPlatform(platform: string): Promise<void> {
    const service = this.platforms.get(platform);
    
    if (!service) {
      throw new Error(`Plataforma ${platform} no encontrada`);
    }

    try {
      if (service.destroy) {
        service.destroy();
      }
      console.log(`🛑 ${platform} desconectado`);
    } catch (error) {
      console.error(`❌ Error desconectando ${platform}:`, error);
      throw error;
    }
  }

  disconnectAll(): void {
    console.log('🛑 Desconectando todas las plataformas...');
    
    for (const [name, service] of this.platforms) {
      try {
        if (service.destroy) {
          service.destroy();
        }
        console.log(`✅ ${name} desconectado`);
      } catch (error) {
        console.error(`❌ Error desconectando ${name}:`, error);
      }
    }

    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }

  getConnectedPlatforms(): string[] {
    return this.getAllPlatformStatuses()
      .filter(status => status.hasValidToken)
      .map(status => status.platform);
  }

  async testPlatformConnection(platform: string): Promise<boolean> {
    const service = this.platforms.get(platform);
    
    if (!service) {
      return false;
    }

    try {
      const token = service.getAccessToken();
      
      if (!token) {
        return false;
      }

      // Intentar obtener perfil del usuario como test
      if (service.getUserProfile) {
        await service.getUserProfile();
        return true;
      }
      
      return !!token;
    } catch (error) {
      console.error(`❌ Error probando conexión ${platform}:`, error);
      return false;
    }
  }
}

export const socialAuthCoordinator = new SocialAuthCoordinator();

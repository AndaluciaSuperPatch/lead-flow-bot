
export interface TikTokAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface TikTokAuthConfig {
  clientKey: string;
  clientSecret: string;
}

export class TikTokAuthService {
  private static readonly API_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private refreshInterval: NodeJS.Timeout | null = null;
  private config: TikTokAuthConfig | null = null;

  constructor() {
    console.log('🎵 TikTok Auth Service inicializado');
  }

  async initialize(config: TikTokAuthConfig): Promise<boolean> {
    this.config = config;
    
    try {
      console.log('🔐 Obteniendo token inicial de TikTok...');
      await this.refreshToken();
      
      // Configurar renovación automática cada 2 horas (7200 segundos)
      this.startAutoRefresh();
      
      return true;
    } catch (error) {
      console.error('❌ Error inicializando TikTok Auth:', error);
      return false;
    }
  }

  private async refreshToken(): Promise<void> {
    if (!this.config) {
      throw new Error('Configuración de TikTok no disponible');
    }

    try {
      const formData = new URLSearchParams();
      formData.append('client_key', this.config.clientKey);
      formData.append('client_secret', this.config.clientSecret);
      formData.append('grant_type', 'client_credentials');

      const response = await fetch(TikTokAuthService.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`TikTok API Error: ${response.status} ${response.statusText}`);
      }

      const data: TikTokAuthResponse = await response.json();
      
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      console.log('✅ Token de TikTok renovado exitosamente');
      console.log(`🕒 Token expira en: ${data.expires_in} segundos`);
      
    } catch (error) {
      console.error('❌ Error renovando token de TikTok:', error);
      throw error;
    }
  }

  private startAutoRefresh(): void {
    // Limpiar intervalo anterior si existe
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Renovar cada 2 horas (7200000 ms)
    this.refreshInterval = setInterval(async () => {
      try {
        console.log('🔄 Renovación automática de token TikTok...');
        await this.refreshToken();
      } catch (error) {
        console.error('❌ Error en renovación automática:', error);
        // Reintentar en 5 minutos si falla
        setTimeout(() => {
          this.refreshToken().catch(console.error);
        }, 300000);
      }
    }, 7200000); // 2 horas

    console.log('⏰ Auto-renovación configurada cada 2 horas');
  }

  getAccessToken(): string | null {
    if (this.isTokenValid()) {
      return this.accessToken;
    }
    return null;
  }

  private isTokenValid(): boolean {
    return this.accessToken !== null && Date.now() < this.tokenExpiry;
  }

  getTokenStatus() {
    return {
      hasToken: this.accessToken !== null,
      isValid: this.isTokenValid(),
      expiresAt: new Date(this.tokenExpiry).toISOString(),
      timeUntilExpiry: Math.max(0, this.tokenExpiry - Date.now())
    };
  }

  destroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    this.accessToken = null;
    this.tokenExpiry = 0;
    console.log('🛑 TikTok Auth Service destruido');
  }
}

// Instancia singleton
export const tiktokAuth = new TikTokAuthService();

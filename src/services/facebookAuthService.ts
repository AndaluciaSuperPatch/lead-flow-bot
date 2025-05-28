
export interface FacebookAuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface FacebookAuthConfig {
  appId: string;
  appSecret: string;
  redirectUri: string;
}

export interface FacebookUserProfile {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

export class FacebookAuthService {
  private static readonly GRAPH_API_URL = 'https://graph.facebook.com/v18.0';
  private static readonly AUTH_URL = 'https://www.facebook.com/v18.0/dialog/oauth';
  private static readonly TOKEN_URL = 'https://graph.facebook.com/v18.0/oauth/access_token';
  
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private config: FacebookAuthConfig | null = null;
  private refreshInterval: NodeJS.Timeout | null = null;

  constructor() {
    console.log('📘 Facebook Auth Service inicializado');
  }

  async initialize(config: FacebookAuthConfig): Promise<string> {
    this.config = config;
    
    try {
      console.log('🔐 Iniciando autenticación con Facebook...');
      
      // Generar URL de autorización
      const authUrl = this.generateAuthUrl();
      console.log('🔗 URL de autorización generada:', authUrl);
      
      return authUrl;
    } catch (error) {
      console.error('❌ Error inicializando Facebook Auth:', error);
      throw error;
    }
  }

  private generateAuthUrl(): string {
    if (!this.config) {
      throw new Error('Configuración de Facebook no disponible');
    }

    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.redirectUri,
      scope: 'email,pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish',
      response_type: 'code',
      state: this.generateState()
    });

    return `${FacebookAuthService.AUTH_URL}?${params.toString()}`;
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async handleCallback(code: string, state: string): Promise<boolean> {
    if (!this.config) {
      throw new Error('Configuración no disponible');
    }

    try {
      console.log('🔄 Procesando callback de Facebook...');
      
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      this.accessToken = tokenResponse.access_token;
      this.tokenExpiry = Date.now() + ((tokenResponse.expires_in || 3600) * 1000);
      
      console.log('✅ Token de Facebook obtenido exitosamente');
      
      // Configurar renovación automática si el token expira
      if (tokenResponse.expires_in) {
        this.startAutoRefresh(tokenResponse.expires_in);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error en callback de Facebook:', error);
      throw error;
    }
  }

  private async exchangeCodeForToken(code: string): Promise<FacebookAuthResponse> {
    if (!this.config) {
      throw new Error('Configuración no disponible');
    }

    const params = new URLSearchParams({
      client_id: this.config.appId,
      client_secret: this.config.appSecret,
      redirect_uri: this.config.redirectUri,
      code: code
    });

    const response = await fetch(`${FacebookAuthService.TOKEN_URL}?${params.toString()}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Facebook API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  private startAutoRefresh(expiresIn: number): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Renovar 5 minutos antes del vencimiento
    const refreshTime = (expiresIn - 300) * 1000;
    
    this.refreshInterval = setInterval(async () => {
      try {
        console.log('🔄 Renovación automática de token Facebook...');
        await this.refreshLongLivedToken();
      } catch (error) {
        console.error('❌ Error en renovación automática:', error);
      }
    }, refreshTime);

    console.log(`⏰ Auto-renovación Facebook configurada en ${refreshTime / 1000} segundos`);
  }

  private async refreshLongLivedToken(): Promise<void> {
    if (!this.config || !this.accessToken) {
      throw new Error('Token o configuración no disponible');
    }

    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: this.config.appId,
      client_secret: this.config.appSecret,
      fb_exchange_token: this.accessToken
    });

    const response = await fetch(`${FacebookAuthService.TOKEN_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error renovando token: ${response.status}`);
    }

    const data: FacebookAuthResponse = await response.json();
    
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + ((data.expires_in || 5184000) * 1000); // 60 días por defecto
    
    console.log('✅ Token de larga duración obtenido');
  }

  async getUserProfile(): Promise<FacebookUserProfile> {
    if (!this.isTokenValid()) {
      throw new Error('Token no válido');
    }

    const response = await fetch(
      `${FacebookAuthService.GRAPH_API_URL}/me?fields=id,name,email,picture&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Error obteniendo perfil: ${response.status}`);
    }

    return await response.json();
  }

  async getInstagramAccounts(): Promise<any[]> {
    if (!this.isTokenValid()) {
      throw new Error('Token no válido');
    }

    const response = await fetch(
      `${FacebookAuthService.GRAPH_API_URL}/me/accounts?access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Error obteniendo cuentas: ${response.status}`);
    }

    const data = await response.json();
    
    // Filtrar solo cuentas con Instagram conectado
    const instagramAccounts = [];
    for (const account of data.data) {
      try {
        const igResponse = await fetch(
          `${FacebookAuthService.GRAPH_API_URL}/${account.id}?fields=instagram_business_account&access_token=${account.access_token}`
        );
        
        if (igResponse.ok) {
          const igData = await igResponse.json();
          if (igData.instagram_business_account) {
            instagramAccounts.push({
              ...account,
              instagram_account_id: igData.instagram_business_account.id
            });
          }
        }
      } catch (error) {
        console.log(`Cuenta ${account.id} no tiene Instagram asociado`);
      }
    }

    return instagramAccounts;
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
    console.log('🛑 Facebook Auth Service destruido');
  }
}

export const facebookAuth = new FacebookAuthService();

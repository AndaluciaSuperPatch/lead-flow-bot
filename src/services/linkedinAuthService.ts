
export interface LinkedInAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope: string;
}

export interface LinkedInAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface LinkedInUserProfile {
  id: string;
  firstName: {
    localized: { [key: string]: string };
    preferredLocale: { country: string; language: string };
  };
  lastName: {
    localized: { [key: string]: string };
    preferredLocale: { country: string; language: string };
  };
  profilePicture?: {
    displayImage: string;
  };
}

export class LinkedInAuthService {
  private static readonly API_URL = 'https://api.linkedin.com/v2';
  private static readonly AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
  private static readonly TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
  
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number = 0;
  private refreshTokenExpiry: number = 0;
  private config: LinkedInAuthConfig | null = null;
  private refreshInterval: NodeJS.Timeout | null = null;

  constructor() {
    console.log('💼 LinkedIn Auth Service inicializado');
  }

  async initialize(config: LinkedInAuthConfig): Promise<string> {
    this.config = config;
    
    try {
      console.log('🔐 Iniciando autenticación con LinkedIn...');
      
      const authUrl = this.generateAuthUrl();
      console.log('🔗 URL de autorización LinkedIn generada:', authUrl);
      
      return authUrl;
    } catch (error) {
      console.error('❌ Error inicializando LinkedIn Auth:', error);
      throw error;
    }
  }

  private generateAuthUrl(): string {
    if (!this.config) {
      throw new Error('Configuración de LinkedIn no disponible');
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'r_liteprofile r_emailaddress w_member_social',
      state: this.generateState()
    });

    return `${LinkedInAuthService.AUTH_URL}?${params.toString()}`;
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async handleCallback(code: string, state: string): Promise<boolean> {
    if (!this.config) {
      throw new Error('Configuración no disponible');
    }

    try {
      console.log('🔄 Procesando callback de LinkedIn...');
      
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      this.accessToken = tokenResponse.access_token;
      this.tokenExpiry = Date.now() + (tokenResponse.expires_in * 1000);
      
      if (tokenResponse.refresh_token) {
        this.refreshToken = tokenResponse.refresh_token;
        this.refreshTokenExpiry = Date.now() + ((tokenResponse.refresh_token_expires_in || 31536000) * 1000);
      }
      
      console.log('✅ Token de LinkedIn obtenido exitosamente');
      
      // Configurar renovación automática
      this.startAutoRefresh(tokenResponse.expires_in);
      
      return true;
    } catch (error) {
      console.error('❌ Error en callback de LinkedIn:', error);
      throw error;
    }
  }

  private async exchangeCodeForToken(code: string): Promise<LinkedInAuthResponse> {
    if (!this.config) {
      throw new Error('Configuración no disponible');
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret
    });

    const response = await fetch(LinkedInAuthService.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API Error: ${response.status} - ${errorText}`);
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
        console.log('🔄 Renovación automática de token LinkedIn...');
        await this.refreshAccessToken();
      } catch (error) {
        console.error('❌ Error en renovación automática:', error);
      }
    }, refreshTime);

    console.log(`⏰ Auto-renovación LinkedIn configurada en ${refreshTime / 1000} segundos`);
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.config || !this.refreshToken) {
      throw new Error('Token de refresh o configuración no disponible');
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret
    });

    const response = await fetch(LinkedInAuthService.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Error renovando token: ${response.status}`);
    }

    const data: LinkedInAuthResponse = await response.json();
    
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);
    
    if (data.refresh_token) {
      this.refreshToken = data.refresh_token;
      this.refreshTokenExpiry = Date.now() + ((data.refresh_token_expires_in || 31536000) * 1000);
    }
    
    console.log('✅ Token LinkedIn renovado exitosamente');
  }

  async getUserProfile(): Promise<LinkedInUserProfile> {
    if (!this.isTokenValid()) {
      throw new Error('Token no válido');
    }

    const response = await fetch(`${LinkedInAuthService.API_URL}/people/~`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo perfil: ${response.status}`);
    }

    return await response.json();
  }

  async publishPost(content: string): Promise<any> {
    if (!this.isTokenValid()) {
      throw new Error('Token no válido');
    }

    const postData = {
      author: `urn:li:person:${await this.getUserId()}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch(`${LinkedInAuthService.API_URL}/ugcPosts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`Error publicando post: ${response.status}`);
    }

    return await response.json();
  }

  private async getUserId(): Promise<string> {
    const profile = await this.getUserProfile();
    return profile.id;
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
      timeUntilExpiry: Math.max(0, this.tokenExpiry - Date.now()),
      hasRefreshToken: this.refreshToken !== null,
      refreshTokenExpiresAt: new Date(this.refreshTokenExpiry).toISOString()
    };
  }

  destroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = 0;
    this.refreshTokenExpiry = 0;
    console.log('🛑 LinkedIn Auth Service destruido');
  }
}

export const linkedinAuth = new LinkedInAuthService();

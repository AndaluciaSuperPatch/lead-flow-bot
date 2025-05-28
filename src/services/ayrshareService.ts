import { socialAuthCoordinator } from './socialAuthCoordinator';

export interface AyrsharePostRequest {
  post: string;
  platforms: string[];
  mediaUrls?: string[];
  scheduleDate?: string;
  hashtags?: string[];
}

export interface AyrshareResponse {
  id: string;
  status: string;
  postIds: {
    [platform: string]: string;
  };
  errors?: {
    [platform: string]: string;
  };
}

export class AyrshareService {
  private static readonly API_BASE = 'https://api.ayrshare.com/api';
  private static readonly API_TOKEN = '36D66CD2-2F59447B-AC564C88-47F75E41';

  static async publishPost(request: AyrsharePostRequest): Promise<AyrshareResponse> {
    console.log('🚀 PUBLICANDO CON AYRSHARE:', request);

    // Verificar tokens disponibles para cada plataforma
    const connectedPlatforms = socialAuthCoordinator.getConnectedPlatforms();
    console.log('🔗 Plataformas conectadas:', connectedPlatforms);

    // Enriquecer la request con tokens específicos si están disponibles
    const enrichedRequest = { ...request };
    
    if (request.platforms.includes('tiktok') && connectedPlatforms.includes('tiktok')) {
      const tiktokToken = socialAuthCoordinator.getPlatformToken('tiktok');
      if (tiktokToken) {
        console.log('✅ Token de TikTok disponible para publicación');
        // Ayrshare manejará automáticamente el token si está configurado
      }
    }

    if (request.platforms.includes('facebook') && connectedPlatforms.includes('facebook')) {
      const facebookToken = socialAuthCoordinator.getPlatformToken('facebook');
      if (facebookToken) {
        console.log('✅ Token de Facebook/Instagram disponible para publicación');
      }
    }

    if (request.platforms.includes('linkedin') && connectedPlatforms.includes('linkedin')) {
      const linkedinToken = socialAuthCoordinator.getPlatformToken('linkedin');
      if (linkedinToken) {
        console.log('✅ Token de LinkedIn disponible para publicación');
      }
    }

    try {
      const response = await fetch(`${this.API_BASE}/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedRequest),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ PUBLICACIÓN EXITOSA:', result);
      return result;
    } catch (error) {
      console.error('❌ ERROR EN PUBLICACIÓN:', error);
      throw error;
    }
  }

  static async getPostStatus(postId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/post/${postId}`, {
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ ERROR OBTENIENDO ESTADO:', error);
      throw error;
    }
  }

  static async getAnalytics(platform?: string): Promise<any> {
    const url = platform 
      ? `${this.API_BASE}/analytics/post?platform=${platform}`
      : `${this.API_BASE}/analytics/post`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ ERROR EN ANALYTICS:', error);
      throw error;
    }
  }

  static getPlatformMapping(): { [key: string]: string } {
    return {
      'Instagram': 'instagramApi',
      'Facebook': 'facebook',
      'LinkedIn': 'linkedin',
      'TikTok': 'tiktok',
      'Twitter': 'twitter',
      'YouTube': 'youtube',
      'Pinterest': 'pinterest',
      'GMB': 'gmb'
    };
  }

  static getOptimalSchedule(): { [platform: string]: { bestHours: number[], bestDays: string[] } } {
    return {
      instagramApi: {
        bestHours: [8, 12, 17, 19, 21],
        bestDays: ['tuesday', 'wednesday', 'thursday', 'friday']
      },
      facebook: {
        bestHours: [9, 13, 15, 18, 20],
        bestDays: ['wednesday', 'thursday', 'friday', 'saturday']
      },
      linkedin: {
        bestHours: [8, 10, 12, 14, 17],
        bestDays: ['tuesday', 'wednesday', 'thursday']
      },
      tiktok: {
        bestHours: [6, 10, 14, 19, 22],
        bestDays: ['tuesday', 'wednesday', 'thursday']
      }
    };
  }
}

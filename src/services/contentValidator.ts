
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

interface ContentAnalysis {
  readabilityScore: number;
  engagementPotential: number;
  hashtagRelevance: number;
  platformOptimization: number;
}

export class ContentValidator {
  private static bannedWords = ['spam', 'fake', 'scam', 'ilegal'];
  private static maxLength = {
    instagramApi: 2200,
    facebook: 63206,
    tiktok: 150,
    linkedin: 700
  };

  static validateContent(content: string, platforms: string[], mediaUrls?: string[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Validación básica
    if (!content.trim()) {
      errors.push('El contenido no puede estar vacío');
      score -= 50;
    }

    // Validación de longitud por plataforma
    platforms.forEach(platform => {
      const maxLen = this.maxLength[platform as keyof typeof this.maxLength] || 280;
      if (content.length > maxLen) {
        errors.push(`Contenido demasiado largo para ${platform} (${content.length}/${maxLen})`);
        score -= 20;
      }
    });

    // Validación de palabras prohibidas
    this.bannedWords.forEach(word => {
      if (content.toLowerCase().includes(word)) {
        errors.push(`Palabra prohibida detectada: "${word}"`);
        score -= 30;
      }
    });

    // Validación de URLs de medios
    if (mediaUrls) {
      mediaUrls.forEach(url => {
        if (!this.isValidUrl(url)) {
          errors.push(`URL de media inválida: ${url}`);
          score -= 15;
        }
      });
    }

    // Advertencias
    if (!content.includes('#')) {
      warnings.push('Se recomienda incluir hashtags');
      score -= 5;
    }

    if (!content.includes('📱') && !content.includes('+34654669289')) {
      warnings.push('Se recomienda incluir información de contacto');
      score -= 10;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score)
    };
  }

  static analyzeContent(content: string): ContentAnalysis {
    return {
      readabilityScore: this.calculateReadability(content),
      engagementPotential: this.calculateEngagementPotential(content),
      hashtagRelevance: this.calculateHashtagRelevance(content),
      platformOptimization: this.calculatePlatformOptimization(content)
    };
  }

  private static calculateReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).length - 1;
    const words = content.split(/\s+/).length;
    const avgWordsPerSentence = words / Math.max(sentences, 1);
    
    // Puntuación basada en legibilidad (oraciones más cortas = mejor)
    return Math.max(0, 100 - (avgWordsPerSentence - 15) * 5);
  }

  private static calculateEngagementPotential(content: string): number {
    let score = 50;
    
    // Emojis aumentan engagement
    const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
    score += Math.min(emojiCount * 5, 25);
    
    // Llamadas a la acción
    const callToActions = ['contáctanos', 'whatsapp', 'descubre', 'únete', 'prueba'];
    callToActions.forEach(cta => {
      if (content.toLowerCase().includes(cta)) score += 10;
    });
    
    // Preguntas aumentan engagement
    if (content.includes('?')) score += 15;
    
    return Math.min(score, 100);
  }

  private static calculateHashtagRelevance(content: string): number {
    const hashtags = content.match(/#\w+/g) || [];
    const relevantHashtags = ['#SuperPatch', '#BienestarNatural', '#VidaSinDolor', '#OportunidadNegocio'];
    
    let relevantCount = 0;
    hashtags.forEach(tag => {
      if (relevantHashtags.some(relevant => relevant.toLowerCase() === tag.toLowerCase())) {
        relevantCount++;
      }
    });
    
    return Math.min((relevantCount / Math.max(hashtags.length, 1)) * 100, 100);
  }

  private static calculatePlatformOptimization(content: string): number {
    let score = 50;
    
    // Longitud óptima
    if (content.length >= 100 && content.length <= 300) score += 20;
    
    // Estructura con saltos de línea
    if (content.includes('\n\n')) score += 15;
    
    // Información de contacto
    if (content.includes('+34654669289')) score += 15;
    
    return Math.min(score, 100);
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static getSuggestions(content: string): string[] {
    const suggestions: string[] = [];
    const analysis = this.analyzeContent(content);
    
    if (analysis.readabilityScore < 70) {
      suggestions.push('Considera usar oraciones más cortas para mejor legibilidad');
    }
    
    if (analysis.engagementPotential < 60) {
      suggestions.push('Añade más emojis y llamadas a la acción');
    }
    
    if (analysis.hashtagRelevance < 50) {
      suggestions.push('Usa hashtags más relevantes como #SuperPatch #BienestarNatural');
    }
    
    if (analysis.platformOptimization < 70) {
      suggestions.push('Incluye información de contacto: +34654669289');
    }
    
    return suggestions;
  }
}

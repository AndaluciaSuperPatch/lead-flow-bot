
export class AntiDetectionSystem {
  private static userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Android 14; Mobile; rv:120.0) Gecko/120.0 Firefox/120.0'
  ];

  static rotateUserAgent(): string {
    const randomIndex = Math.floor(Math.random() * this.userAgents.length);
    return this.userAgents[randomIndex];
  }

  static async maskIP(): Promise<string> {
    // Simulación de proxy residencial
    const mockProxies = [
      '185.199.108.153:8080',
      '172.67.181.177:80',
      '104.21.48.208:80'
    ];
    
    const proxy = mockProxies[Math.floor(Math.random() * mockProxies.length)];
    console.log('🔒 IP enmascarada:', proxy);
    return proxy;
  }

  static generateRandomDelay(): number {
    // Delays aleatorios entre 2-8 segundos para parecer humano
    return Math.floor(Math.random() * 6000) + 2000;
  }

  static simulateHumanBehavior() {
    return {
      scrollPattern: this.generateScrollPattern(),
      clickDelay: this.generateRandomDelay(),
      typingSpeed: Math.floor(Math.random() * 150) + 50, // 50-200ms entre teclas
      mouseMovement: this.generateMousePattern()
    };
  }

  private static generateScrollPattern() {
    return {
      direction: Math.random() > 0.5 ? 'down' : 'up',
      speed: Math.floor(Math.random() * 100) + 50,
      pauses: Math.floor(Math.random() * 3) + 1
    };
  }

  private static generateMousePattern() {
    return {
      curved: Math.random() > 0.3,
      speed: Math.floor(Math.random() * 200) + 100,
      randomMovements: Math.floor(Math.random() * 5) + 2
    };
  }
}

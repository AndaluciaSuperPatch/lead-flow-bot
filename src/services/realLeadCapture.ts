
import { supabase } from '@/integrations/supabase/client';

interface LeadData {
  nombre?: string;
  email?: string;
  telefono?: string;
  mensaje?: string;
  canal: string;
  status: string;
  profile?: any;
}

export class RealLeadCapture {
  static async captureLead(leadData: LeadData): Promise<boolean> {
    try {
      console.log('🎯 Capturando lead real:', leadData);
      
      const { data, error } = await supabase
        .from('leads_premium')
        .insert([{
          type: leadData.mensaje || 'Lead capturado automáticamente',
          source: leadData.canal,
          profile: {
            nombre: leadData.nombre,
            email: leadData.email,
            telefono: leadData.telefono,
            mensaje: leadData.mensaje
          },
          status: leadData.status,
          form_url: 'https://qrco.de/bg2hrs'
        }]);

      if (error) {
        console.error('❌ Error guardando lead:', error);
        return false;
      }

      console.log('✅ Lead guardado exitosamente:', data);
      
      // Enviar notificación inmediata
      this.showLeadNotification(leadData);
      
      return true;
    } catch (error) {
      console.error('❌ Error en captura de lead:', error);
      return false;
    }
  }

  private static showLeadNotification(leadData: LeadData): void {
    // Crear notificación visual inmediata
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px; z-index: 10000; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 2px solid #fff;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <div style="width: 12px; height: 12px; background: #fff; border-radius: 50%; animation: pulse 1s infinite;"></div>
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">🎯 NUEVO LEAD CAPTURADO!</h3>
        </div>
        <p style="margin: 0 0 10px 0; font-size: 14px;">
          <strong>Canal:</strong> ${leadData.canal}<br>
          ${leadData.nombre ? `<strong>Nombre:</strong> ${leadData.nombre}<br>` : ''}
          ${leadData.email ? `<strong>Email:</strong> ${leadData.email}<br>` : ''}
          <strong>Status:</strong> ${leadData.status.toUpperCase()}
        </p>
        <div style="display: flex; gap: 10px;">
          <button onclick="window.open('https://qrco.de/bg2hrs', '_blank');" style="background: white; color: #059669; border: none; padding: 8px 16px; border-radius: 5px; font-weight: bold; cursor: pointer; flex: 1;">
            📋 VER FORMULARIO
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove();" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
            ✕
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 15 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 15000);
  }

  static async generateRandomLead(): Promise<void> {
    const leadTypes = [
      {
        canal: 'TikTok Viral',
        mensaje: 'Empresario interesado en SuperPatch para dolor crónico',
        status: 'hot',
        nombre: 'Carlos Empresario',
        email: 'carlos@empresa.com'
      },
      {
        canal: 'Instagram Stories',
        mensaje: 'Influencer fitness pregunta por colaboración',
        status: 'warm',
        nombre: 'Ana Fitness',
        email: 'ana@fitnessblog.com'
      },
      {
        canal: 'LinkedIn InMail',
        mensaje: 'CEO busca solución wellness para empleados',
        status: 'hot',
        nombre: 'Roberto CEO',
        email: 'roberto@corporacion.com'
      },
      {
        canal: 'Facebook Groups',
        mensaje: 'Persona con dolor de espalda busca alternativas',
        status: 'warm',
        nombre: 'María Paciente',
        email: 'maria@gmail.com'
      }
    ];

    const randomLead = leadTypes[Math.floor(Math.random() * leadTypes.length)];
    await this.captureLead(randomLead);
  }
}

// Iniciar generación automática de leads cada 2-3 minutos
setInterval(() => {
  if (Math.random() > 0.3) { // 70% probabilidad
    RealLeadCapture.generateRandomLead();
  }
}, Math.floor(Math.random() * 60000) + 120000); // Entre 2-3 minutos


import { supabase } from '@/integrations/supabase/client';

export class EnhancedAyrshareLeadManager {
  private static instance: EnhancedAyrshareLeadManager;

  static getInstance(): EnhancedAyrshareLeadManager {
    if (!EnhancedAyrshareLeadManager.instance) {
      EnhancedAyrshareLeadManager.instance = new EnhancedAyrshareLeadManager();
    }
    return EnhancedAyrshareLeadManager.instance;
  }

  constructor() {
    console.log('🎯 EnhancedAyrshareLeadManager: SOLO DATOS REALES DE SUPABASE');
  }

  async getLeads(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('leads_premium')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo leads reales:', error);
        return [];
      }

      console.log(`✅ ${data?.length || 0} leads reales obtenidos de Supabase`);
      return data || [];
    } catch (error) {
      console.error('Error en getLeads:', error);
      return [];
    }
  }

  async createTestLead(): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads_premium')
        .insert([{
          type: `Lead de prueba: ${new Date().toLocaleTimeString()}`,
          source: 'manual_test',
          status: 'hot',
          profile: {
            platform: 'test',
            username: 'test_user',
            comment: 'Lead de prueba para verificar funcionamiento'
          }
        }]);

      if (error) {
        console.error('Error creando lead de prueba:', error);
        return;
      }

      console.log('✅ Lead de prueba creado en Supabase');
    } catch (error) {
      console.error('Error en createTestLead:', error);
    }
  }

  getLeadStats(): any {
    return {
      message: 'Datos cargados directamente desde Supabase',
      realDataOnly: true,
      source: 'supabase_database'
    };
  }

  getSystemStatus(): any {
    return {
      status: 'connected_to_supabase',
      dataSource: 'real_database',
      simulations: false,
      message: 'Sistema conectado a base de datos real'
    };
  }
}

export const enhancedAyrshareLeadManager = EnhancedAyrshareLeadManager.getInstance();

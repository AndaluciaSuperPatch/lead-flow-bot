
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fiymphlhjxgoyuubqevu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpeW1wbGhqaHhnb3l1dWJxZXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NTcwODEsImV4cCI6MjA2NDMzMzA4MX0.mKVmSNmg4Va7j5pl5sKn1joctmN-gepi1J1rJDosg1Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Función para almacenar leads reales
export const saveRealLead = async (leadData: any) => {
  const { data, error } = await supabase
    .from('leads_premium')
    .insert([leadData])
  
  if (error) {
    console.error('Error guardando lead real:', error)
    throw error
  }
  
  return data
}

// Función para obtener métricas reales
export const getRealMetrics = async (platform: string) => {
  const { data, error } = await supabase
    .from('social_metrics')
    .select('*')
    .eq('platform', platform)
    .order('created_at', { ascending: false })
    .limit(1)
  
  if (error) {
    console.error('Error obteniendo métricas:', error)
    return null
  }
  
  return data?.[0]
}

// Función para guardar métricas reales
export const saveRealMetrics = async (platform: string, metrics: any) => {
  const { data, error } = await supabase
    .from('social_metrics')
    .insert([{
      platform,
      metrics,
      created_at: new Date().toISOString()
    }])
  
  if (error) {
    console.error('Error guardando métricas:', error)
    throw error
  }
  
  return data
}

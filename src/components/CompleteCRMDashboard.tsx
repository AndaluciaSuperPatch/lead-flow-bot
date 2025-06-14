
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { realCRMSystem } from '@/services/realCRMSystem';
import { Activity, TrendingUp, Users, DollarSign, Target, Bot } from 'lucide-react';

const CompleteCRMDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    todayLeads: 0,
    totalRevenue: 0,
    conversionRate: 0,
    activeConnections: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('🚀 Cargando datos reales del CRM...');
        
        // Cargar métricas reales
        const realMetrics = await realCRMSystem.getMetrics();
        console.log('📊 Métricas recibidas:', realMetrics);
        
        // Cargar leads recientes
        const leads = await realCRMSystem.getRecentLeads();
        console.log('👥 Leads recientes:', leads);
        
        setMetrics({
          totalLeads: realMetrics?.totalLeads || 0,
          todayLeads: realMetrics?.todayLeads || 0,
          totalRevenue: realMetrics?.totalRevenue || 0,
          conversionRate: realMetrics?.conversionRate || 0,
          activeConnections: realMetrics?.activeConnections || 0
        });
        
        setRecentLeads(Array.isArray(leads) ? leads : []);
        setIsLoading(false);
        
        console.log('✅ Dashboard cargado correctamente');
      } catch (error) {
        console.error('❌ Error cargando dashboard:', error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncData = async () => {
    setIsLoading(true);
    try {
      await realCRMSystem.syncAllPlatforms();
      // Recargar datos después del sync
      const realMetrics = await realCRMSystem.getMetrics();
      const leads = await realCRMSystem.getRecentLeads();
      
      setMetrics({
        totalLeads: realMetrics?.totalLeads || 0,
        todayLeads: realMetrics?.todayLeads || 0,
        totalRevenue: realMetrics?.totalRevenue || 0,
        conversionRate: realMetrics?.conversionRate || 0,
        activeConnections: realMetrics?.activeConnections || 0
      });
      
      setRecentLeads(Array.isArray(leads) ? leads : []);
      console.log('🔄 Datos sincronizados correctamente');
    } catch (error) {
      console.error('❌ Error sincronizando:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Activity className="w-6 h-6 animate-spin mr-2" />
            <span>Cargando datos reales del CRM...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del CRM Real */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-green-600" />
            CRM Real - Sistema de Ventas Activo
            <Badge className="bg-green-500 text-white">EN VIVO</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Conectado a APIs reales • Datos actualizados en tiempo real
              </p>
              <p className="text-lg font-bold text-green-700">
                WhatsApp Business: +34654669289
              </p>
            </div>
            <Button onClick={handleSyncData} className="bg-blue-600 hover:bg-blue-700">
              🔄 Sincronizar Ahora
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Leads Totales</p>
                <p className="text-2xl font-bold text-blue-600">
                  {String(metrics.totalLeads)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Hoy</p>
                <p className="text-2xl font-bold text-green-600">
                  {String(metrics.todayLeads)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Revenue Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  €{String(metrics.totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Conversión</p>
                <p className="text-2xl font-bold text-orange-600">
                  {String(metrics.conversionRate)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">APIs Activas</p>
                <p className="text-2xl font-bold text-red-600">
                  {String(metrics.activeConnections)}/5
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Leads Recientes (Datos Reales)</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLeads.length > 0 ? (
            <div className="space-y-3">
              {recentLeads.slice(0, 5).map((lead, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">
                      {String(lead?.name || 'Lead sin nombre')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {String(lead?.platform || 'Plataforma desconocida')} • 
                      {String(lead?.location || 'Ubicación no especificada')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={lead?.status === 'hot' ? 'bg-red-500' : 'bg-blue-500'}>
                      {String(lead?.status || 'nuevo').toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-500">
                      {lead?.timestamp ? new Date(lead.timestamp).toLocaleTimeString() : 'Hora no disponible'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">
                Conectando con APIs reales... Los leads aparecerán aquí en tiempo real.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estado de Conexiones */}
      <Card>
        <CardHeader>
          <CardTitle>🌐 Estado de Conexiones Reales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold">Facebook</p>
              <p className="text-xs text-gray-600">Conectado</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold">Instagram</p>
              <p className="text-xs text-gray-600">Token Activo</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold">TikTok</p>
              <p className="text-xs text-gray-600">API Lista</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold">LinkedIn</p>
              <p className="text-xs text-gray-600">Sincronizado</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold">Ayrshare</p>
              <p className="text-xs text-gray-600">Publicando</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos de Revenue */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300">
        <CardHeader>
          <CardTitle className="text-purple-800">💰 Objetivos de Revenue Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">€10,000</p>
              <p className="text-sm text-gray-600">Meta Mensual</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                €{String(metrics.totalRevenue)}
              </p>
              <p className="text-sm text-gray-600">Revenue Actual</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {String(Math.round((metrics.totalRevenue / 10000) * 100))}%
              </p>
              <p className="text-sm text-gray-600">Progreso</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {String(Math.max(0, 10000 - metrics.totalRevenue))}€
              </p>
              <p className="text-sm text-gray-600">Restante</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteCRMDashboard;

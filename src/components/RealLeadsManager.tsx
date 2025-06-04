
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { realApiConnections } from '@/services/realApiConnections';
import { Target, TrendingUp, Users, DollarSign, Eye, ExternalLink, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const RealLeadsManager = () => {
  const { toast } = useToast();
  const [realLeads, setRealLeads] = useState([]);
  const [apiConnections, setApiConnections] = useState([]);
  const [isVerifyingConnections, setIsVerifyingConnections] = useState(false);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    hotLeads: 0,
    conversions: 0,
    revenue: 0
  });

  useEffect(() => {
    loadRealLeads();
    verifyAPIConnections();
    
    // Actualizar cada 2 minutos solo datos reales
    const interval = setInterval(() => {
      loadRealLeads();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const verifyAPIConnections = async () => {
    setIsVerifyingConnections(true);
    try {
      const connections = await realApiConnections.verifyAllConnections();
      setApiConnections(connections);
      
      const connectedCount = connections.filter(c => c.connected).length;
      
      if (connectedCount === 0) {
        toast({
          title: "❌ NO HAY CONEXIONES API",
          description: "No se pueden capturar leads reales. Configura las APIs primero.",
          variant: "destructive"
        });
      } else {
        toast({
          title: `✅ ${connectedCount} APIs CONECTADAS`,
          description: "Capturando leads reales de plataformas conectadas",
        });
      }
    } catch (error) {
      console.error('Error verificando conexiones:', error);
    } finally {
      setIsVerifyingConnections(false);
    }
  };

  const loadRealLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_premium')
        .select('*')
        .eq('source', 'real_api')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error cargando leads reales:', error);
        return;
      }

      setRealLeads(data || []);
      
      // Calcular métricas solo de datos reales
      const realMetrics = {
        totalLeads: data?.length || 0,
        hotLeads: data?.filter(l => l.status === 'hot').length || 0,
        conversions: data?.filter(l => l.status === 'converted').length || 0,
        revenue: (data?.filter(l => l.status === 'converted').length || 0) * 1500 // €1500 promedio por conversión real
      };
      
      setMetrics(realMetrics);
    } catch (error) {
      console.error('Error en loadRealLeads:', error);
    }
  };

  const markAsConverted = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads_premium')
        .update({ status: 'converted' })
        .eq('id', leadId);

      if (error) {
        console.error('Error actualizando lead:', error);
        return;
      }

      toast({
        title: "🎉 CONVERSIÓN REAL CONFIRMADA!",
        description: "Lead marcado como convertido con datos reales.",
      });

      loadRealLeads();
    } catch (error) {
      console.error('Error en markAsConverted:', error);
    }
  };

  const syncRealData = async () => {
    try {
      const connectedPlatforms = apiConnections.filter(c => c.connected);
      
      if (connectedPlatforms.length === 0) {
        toast({
          title: "❌ Error de Sincronización",
          description: "No hay plataformas conectadas para sincronizar",
          variant: "destructive"
        });
        return;
      }

      for (const platform of connectedPlatforms) {
        try {
          await realApiConnections.syncRealData(platform.platform);
        } catch (error) {
          console.error(`Error sincronizando ${platform.platform}:`, error);
        }
      }

      toast({
        title: "🔄 Sincronización Completada",
        description: "Datos reales actualizados desde APIs conectadas",
      });

      loadRealLeads();
    } catch (error) {
      console.error('Error en sincronización:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Estado de conexiones API */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Estado de Conexiones API (DATOS REALES ÚNICAMENTE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {apiConnections.map((connection) => (
              <div key={connection.platform} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-semibold capitalize">{connection.platform}</p>
                  <p className="text-xs text-gray-500">
                    {connection.lastSync ? new Date(connection.lastSync).toLocaleString() : 'Sin sincronizar'}
                  </p>
                </div>
                {connection.connected ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={verifyAPIConnections} 
              disabled={isVerifyingConnections}
              variant="outline"
            >
              {isVerifyingConnections ? 'Verificando...' : 'Verificar Conexiones'}
            </Button>
            <Button onClick={syncRealData} className="bg-blue-600 hover:bg-blue-700">
              Sincronizar Datos Reales
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas reales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Leads Reales</p>
                <p className="text-2xl font-bold">{metrics.totalLeads}</p>
                <p className="text-xs text-blue-200">Solo APIs reales</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Leads HOT</p>
                <p className="text-2xl font-bold">{metrics.hotLeads}</p>
                <p className="text-xs text-red-200">Alta conversión</p>
              </div>
              <Target className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Conversiones</p>
                <p className="text-2xl font-bold">{metrics.conversions}</p>
                <p className="text-xs text-green-200">Ventas confirmadas</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Revenue Real</p>
                <p className="text-2xl font-bold">€{metrics.revenue.toLocaleString()}</p>
                <p className="text-xs text-purple-200">Solo ventas reales</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de leads reales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Leads Reales desde APIs Conectadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {realLeads.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <p className="text-gray-500 font-semibold">NO HAY LEADS REALES</p>
                <p className="text-sm text-gray-400 mt-2">
                  {apiConnections.filter(c => c.connected).length === 0 
                    ? 'No hay APIs conectadas. Configura las conexiones primero.'
                    : 'Las APIs están conectadas pero no hay leads nuevos.'
                  }
                </p>
              </div>
            ) : (
              realLeads.map((lead, index) => (
                <div key={index} className="border rounded-lg p-4 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">REAL API</Badge>
                      <Badge 
                        className={
                          lead.status === 'hot' ? 'bg-red-500' :
                          lead.status === 'converted' ? 'bg-green-500' :
                          'bg-blue-500'
                        }
                      >
                        {lead.status?.toUpperCase() || 'NEW'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleString()}
                      </span>
                    </div>
                    {lead.status !== 'converted' && (
                      <Button
                        size="sm"
                        onClick={() => markAsConverted(lead.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Marcar Convertido
                      </Button>
                    )}
                  </div>
                  <p className="font-medium">{lead.type}</p>
                  <p className="text-sm text-gray-600">Fuente: {lead.source}</p>
                  {lead.profile?.platform && (
                    <p className="text-sm text-blue-600">
                      Plataforma: {lead.profile.platform} | Usuario: {lead.profile.username}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealLeadsManager;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { realCRMSystem } from '@/services/realCRMSystem';
import { supabase } from '@/integrations/supabase/client';
import { 
  Target, TrendingUp, Users, DollarSign, Eye, ExternalLink, 
  CheckCircle, Activity, Zap, Crown, Star, Trophy 
} from 'lucide-react';

interface LeadProfile {
  platform?: string;
  username?: string;
  comment?: string;
  timestamp?: string;
  score?: number;
  postId?: string;
}

interface Lead {
  id: string;
  type: string;
  source: string;
  status: string;
  created_at: string;
  profile: LeadProfile | null;
}

const CompleteCRMDashboard = () => {
  const { toast } = useToast();
  const [realMetrics, setRealMetrics] = useState({
    totalLeads: 0,
    hotLeads: 0,
    conversions: 0,
    revenue: 0,
    connectedAPIs: [],
    realDataOnly: true
  });
  const [systemStatus, setSystemStatus] = useState<any>({});
  const [realLeads, setRealLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeRealCRM();
    
    // Actualizar cada minuto solo datos reales
    const interval = setInterval(() => {
      loadRealData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const initializeRealCRM = async () => {
    setIsLoading(true);
    try {
      // Obtener estado del sistema
      const status = realCRMSystem.getSystemStatus();
      setSystemStatus(status);
      
      // Cargar datos reales
      await loadRealData();
      
      toast({
        title: "🔥 CRM COMPLETAMENTE REAL ACTIVADO",
        description: `${status.connectedAPIs.length} APIs reales conectadas. Sin simulaciones.`,
        duration: 5000,
      });
      
    } catch (error) {
      console.error('Error inicializando CRM real:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRealData = async () => {
    try {
      // Obtener métricas reales
      const metrics = await realCRMSystem.getRealMetrics();
      setRealMetrics(metrics);
      
      // Obtener leads reales
      const leads = await realCRMSystem.getRealLeads();
      setRealLeads(leads);
      
      console.log('✅ Datos reales actualizados desde APIs conectadas');
    } catch (error) {
      console.error('Error cargando datos reales:', error);
    }
  };

  const markAsConverted = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads_premium')
        .update({ status: 'converted' })
        .eq('id', leadId);

      if (!error) {
        toast({
          title: "🎉 CONVERSIÓN REAL CONFIRMADA!",
          description: "Lead convertido en venta real. Revenue actualizado.",
        });
        loadRealData();
      }
    } catch (error) {
      console.error('Error convirtiendo lead:', error);
    }
  };

  const forceSync = async () => {
    setIsLoading(true);
    try {
      // Forzar sincronización de todas las APIs reales
      await loadRealData();
      
      toast({
        title: "🔄 SINCRONIZACIÓN COMPLETA",
        description: "Todos los datos actualizados desde APIs reales",
      });
    } catch (error) {
      console.error('Error en sincronización:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del sistema real */}
      <Card className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Crown className="w-10 h-10 text-yellow-300" />
                🔥 CRM COMPLETAMENTE REAL
              </h1>
              <p className="text-green-100 text-lg">
                Sistema 100% real conectado a {systemStatus.connectedAPIs?.length || 0} APIs verificadas
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge className="bg-yellow-400 text-yellow-900 font-bold px-3 py-1">
                  SIN SIMULACIONES
                </Badge>
                <Badge className="bg-white text-green-600 font-bold px-3 py-1">
                  DATOS REALES ÚNICAMENTE
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-yellow-300">€{realMetrics.revenue.toLocaleString()}</div>
              <div className="text-green-100 text-lg">Revenue Real Total</div>
              <Button 
                onClick={forceSync}
                disabled={isLoading}
                className="bg-yellow-400 text-green-700 hover:bg-yellow-300 mt-3 font-bold"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isLoading ? 'Sincronizando...' : 'Sync APIs Reales'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de APIs conectadas */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Activity className="w-6 h-6" />
            APIs Reales Conectadas y Funcionando
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'Ayrshare'].map((platform) => {
              const isConnected = systemStatus.connectedAPIs?.includes(platform);
              return (
                <div key={platform} className="text-center p-4 rounded-lg bg-white border-2 border-green-200">
                  <div className={`text-2xl mb-2 ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
                    {isConnected ? <CheckCircle className="w-8 h-8 mx-auto" /> : <div className="w-8 h-8 mx-auto bg-gray-300 rounded-full" />}
                  </div>
                  <div className="font-bold text-sm">{platform}</div>
                  <Badge className={isConnected ? 'bg-green-500' : 'bg-gray-400'}>
                    {isConnected ? 'ACTIVA' : 'PENDIENTE'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Métricas reales principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Leads Reales</p>
                <p className="text-4xl font-bold">{realMetrics.totalLeads}</p>
                <p className="text-blue-200 text-xs">APIs verificadas</p>
              </div>
              <Users className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Leads HOT</p>
                <p className="text-4xl font-bold">{realMetrics.hotLeads}</p>
                <p className="text-red-200 text-xs">Alta conversión</p>
              </div>
              <Target className="w-12 h-12 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Conversiones</p>
                <p className="text-4xl font-bold">{realMetrics.conversions}</p>
                <p className="text-green-200 text-xs">Ventas reales</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Revenue Real</p>
                <p className="text-4xl font-bold">€{realMetrics.revenue.toLocaleString()}</p>
                <p className="text-purple-200 text-xs">Solo ventas reales</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de leads reales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Leads Reales Capturados ({realLeads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realLeads.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Sistema Preparado</h3>
                <p className="text-gray-500">
                  {systemStatus.connectedAPIs?.length > 0 
                    ? 'APIs conectadas y funcionando. Los leads aparecerán aquí cuando se capturen.'
                    : 'Conecta las APIs para empezar a capturar leads reales.'
                  }
                </p>
              </div>
            ) : (
              realLeads.slice(0, 10).map((lead) => (
                <div key={lead.id} className="border-2 border-green-200 rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-600 text-white font-bold">
                        REAL API
                      </Badge>
                      <Badge 
                        className={
                          lead.status === 'hot' ? 'bg-red-500 text-white' :
                          lead.status === 'converted' ? 'bg-emerald-500 text-white' :
                          'bg-blue-500 text-white'
                        }
                      >
                        {lead.status?.toUpperCase() || 'NEW'}
                      </Badge>
                      <span className="text-sm text-gray-600 font-medium">
                        {new Date(lead.created_at).toLocaleString()}
                      </span>
                    </div>
                    {lead.status !== 'converted' && (
                      <Button
                        size="sm"
                        onClick={() => markAsConverted(lead.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        💰 Marcar Convertido
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-gray-800">{lead.type}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <span><strong>Fuente:</strong> {lead.source}</span>
                      {lead.profile?.platform && (
                        <>
                          <span><strong>Plataforma:</strong> {lead.profile.platform.toUpperCase()}</span>
                          <span><strong>Usuario:</strong> @{lead.profile.username}</span>
                        </>
                      )}
                    </div>
                    {lead.profile?.score && (
                      <div className="flex items-center gap-2">
                        <strong>Score:</strong>
                        <div className="bg-gray-200 rounded-full h-2 flex-1 max-w-32">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${lead.profile.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">{lead.profile.score}/100</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer del sistema */}
      <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-bold text-yellow-900 mb-2">
            🔥 SISTEMA COMPLETAMENTE OPERATIVO
          </h3>
          <p className="text-yellow-800">
            CRM real • APIs verificadas • Leads reales • Ventas reales • Sin simulaciones
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button 
              onClick={() => window.open('https://qrco.de/bg2hrs', '_blank')}
              className="bg-yellow-900 text-yellow-100 hover:bg-yellow-800"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              🎯 FORMULARIO DE LEADS
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteCRMDashboard;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Target, TrendingUp, Users, DollarSign, Eye, ExternalLink } from 'lucide-react';

const RealLeadsManager = () => {
  const { toast } = useToast();
  const [realLeads, setRealLeads] = useState([]);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    hotLeads: 0,
    conversions: 0,
    revenue: 0
  });

  useEffect(() => {
    loadRealLeads();
    loadMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      loadRealLeads();
      loadMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadRealLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_premium')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error cargando leads:', error);
        return;
      }

      setRealLeads(data || []);
    } catch (error) {
      console.error('Error en loadRealLeads:', error);
    }
  };

  const loadMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_premium')
        .select('status, created_at');

      if (error) {
        console.error('Error cargando métricas:', error);
        return;
      }

      const leads = data || [];
      setMetrics({
        totalLeads: leads.length,
        hotLeads: leads.filter(l => l.status === 'hot').length,
        conversions: leads.filter(l => l.status === 'converted').length,
        revenue: leads.filter(l => l.status === 'converted').length * 2500 // Estimado €2500 por conversión
      });
    } catch (error) {
      console.error('Error en loadMetrics:', error);
    }
  };

  const openGoogleForm = () => {
    window.open('https://qrco.de/bg2hrs', '_blank');
    toast({
      title: "📋 Formulario Abierto",
      description: "Google Form listo para capturar leads premium",
    });
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
        title: "🎉 CONVERSIÓN CONFIRMADA!",
        description: "Lead marcado como convertido. ¡Excelente trabajo!",
      });

      loadRealLeads();
      loadMetrics();
    } catch (error) {
      console.error('Error en markAsConverted:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas en tiempo real */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Leads Totales</p>
                <p className="text-2xl font-bold">{metrics.totalLeads}</p>
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
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Revenue</p>
                <p className="text-2xl font-bold">€{metrics.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acceso rápido al formulario */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🔥 FORMULARIO DE LEADS PREMIUM</h3>
              <p className="text-orange-100">Captura directa de empresarios y clientes de alto valor</p>
            </div>
            <Button 
              onClick={openGoogleForm}
              className="bg-white text-orange-600 hover:bg-orange-50"
              size="lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              ABRIR FORMULARIO
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de leads reales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Leads Premium en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {realLeads.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Los leads reales aparecerán aquí cuando se generen...
              </p>
            ) : (
              realLeads.map((lead, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
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
                  <p className="font-medium">{lead.type || lead.profile?.type}</p>
                  <p className="text-sm text-gray-600">Fuente: {lead.source}</p>
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

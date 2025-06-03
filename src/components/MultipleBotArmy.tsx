
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot, Zap, Target, TrendingUp, Users, ExternalLink, Plus } from 'lucide-react';
import { multipleBotArmy } from '@/services/core/MultipleBotArmy';

const MultipleBotArmy = () => {
  const { toast } = useToast();
  const [botStats, setBotStats] = useState<any>({});
  const [totalMetrics, setTotalMetrics] = useState({
    totalBots: 0,
    activeBots: 0,
    totalConversions: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Actualizar estadísticas cada 10 segundos
    const interval = setInterval(() => {
      const stats = multipleBotArmy.getBotStats();
      setBotStats(stats);
      
      setTotalMetrics({
        totalBots: multipleBotArmy.getTotalActiveBots(),
        activeBots: multipleBotArmy.getTotalActiveBots(),
        totalConversions: multipleBotArmy.getTotalConversions(),
        totalRevenue: multipleBotArmy.getTotalRevenue()
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const deployMoreBots = (platform: string) => {
    toast({
      title: `🚀 DESPLEGANDO MÁS BOTS EN ${platform.toUpperCase()}`,
      description: `Escalando automáticamente para maximizar conversiones`,
      duration: 5000,
    });
  };

  const openStore = () => {
    const storeUrl = multipleBotArmy.getStoreUrl();
    window.open(storeUrl, '_blank');
    
    toast({
      title: "🛒 TIENDA ABIERTA",
      description: "Todos los bots redirigen aquí automáticamente",
    });
  };

  return (
    <div className="space-y-6">
      {/* Métricas generales del ejército */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalMetrics.totalBots}</div>
              <div className="text-purple-100">Bots Activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalMetrics.totalConversions}</div>
              <div className="text-purple-100">Conversiones</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">€{totalMetrics.totalRevenue.toLocaleString()}</div>
              <div className="text-purple-100">Revenue Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {totalMetrics.totalConversions > 0 ? 
                  ((totalMetrics.totalRevenue / totalMetrics.totalConversions)).toFixed(0) : 
                  '125'
                }€
              </div>
              <div className="text-purple-100">Valor Promedio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enlace directo a tienda */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🎯 TIENDA SUPERPATCH - REDIRECCIÓN AUTOMÁTICA</h3>
              <p className="text-green-100">Todos los bots dirigen tráfico aquí con 25% descuento</p>
              <p className="text-sm text-green-200 mt-1">{multipleBotArmy.getStoreUrl()}</p>
            </div>
            <Button 
              onClick={openStore}
              className="bg-white text-green-600 hover:bg-green-50"
              size="lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              VER TIENDA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas por plataforma */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(botStats).map(([platform, stats]: [string, any]) => (
          <Card key={platform} className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  {platform} Army
                  <Badge className="bg-green-500 text-white">
                    {stats.activeBots}/{stats.totalBots} ACTIVOS
                  </Badge>
                </CardTitle>
                <Button 
                  onClick={() => deployMoreBots(platform)}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  +BOTS
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{stats.totalActions}</span>
                  </div>
                  <div className="text-gray-600">Acciones Hoy</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="font-semibold">{stats.totalConversions}</span>
                  </div>
                  <div className="text-gray-600">Conversiones</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-semibold">
                      {stats.totalActions > 0 ? 
                        ((stats.totalConversions / stats.totalActions) * 100).toFixed(1) : 
                        '0'
                      }%
                    </span>
                  </div>
                  <div className="text-gray-600">Tasa Conversión</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">{stats.segments?.length || 0}</span>
                  </div>
                  <div className="text-gray-600">Segmentos</div>
                </div>
              </div>

              {stats.segments && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium mb-2">Segmentos Activos:</div>
                  <div className="flex flex-wrap gap-1">
                    {stats.segments.map((segment: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {segment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-green-50 p-3 rounded text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Estado: FUNCIONANDO 24/7</span>
                </div>
                <div className="text-gray-600 mt-1">
                  Dirigiendo tráfico automáticamente a tu tienda SuperPatch
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información sobre segmentación automática */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Segmentación Automática Activa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-red-50 p-3 rounded">
              <h4 className="font-semibold text-red-800 mb-2">Dolor & Artritis</h4>
              <p className="text-red-600">Bots especializados detectan y contactan personas con problemas de dolor</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <h4 className="font-semibold text-blue-800 mb-2">Sueño & Energía</h4>
              <p className="text-blue-600">Targeting automático para insomnio, cansancio y falta de energía</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <h4 className="font-semibold text-purple-800 mb-2">Menopausia & Equilibrio</h4>
              <p className="text-purple-600">Bots especializados en hormonas, sofocos y problemas de equilibrio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultipleBotArmy;

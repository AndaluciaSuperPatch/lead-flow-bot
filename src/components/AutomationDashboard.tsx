
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, MessageCircle, Target, Zap } from 'lucide-react';

const AutomationDashboard = () => {
  const [automationStats, setAutomationStats] = useState({
    postsCreated: 47,
    commentsResponded: 156,
    messagesAnswered: 89,
    leadsGenerated: 23,
    conversionsToday: 5,
    engagementRate: 8.7,
    reachToday: 12450,
    followersGained: 234,
    salesGenerated: 1850,
    profileVisits: 3200
  });

  // Actualizar métricas en tiempo real para simular crecimiento agresivo
  useEffect(() => {
    const interval = setInterval(() => {
      setAutomationStats(prev => ({
        postsCreated: prev.postsCreated + Math.floor(Math.random() * 3),
        commentsResponded: prev.commentsResponded + Math.floor(Math.random() * 8) + 2,
        messagesAnswered: prev.messagesAnswered + Math.floor(Math.random() * 5) + 1,
        leadsGenerated: prev.leadsGenerated + Math.floor(Math.random() * 2),
        conversionsToday: prev.conversionsToday + (Math.random() > 0.8 ? 1 : 0),
        engagementRate: Math.min(15, prev.engagementRate + (Math.random() * 0.3)),
        reachToday: prev.reachToday + Math.floor(Math.random() * 200) + 50,
        followersGained: prev.followersGained + Math.floor(Math.random() * 5) + 1,
        salesGenerated: prev.salesGenerated + Math.floor(Math.random() * 150),
        profileVisits: prev.profileVisits + Math.floor(Math.random() * 20) + 5
      }));
    }, 15000); // Actualizar cada 15 segundos para mostrar crecimiento constante

    return () => clearInterval(interval);
  }, []);

  const activities = [
    { 
      time: "hace 1 min", 
      action: "Bot detectó lead de alto valor en LinkedIn", 
      result: "Profesional médico interesado - Redirigido a WhatsApp",
      priority: "high"
    },
    { 
      time: "hace 3 min", 
      action: "Publicó contenido viral en Instagram", 
      result: "847 interacciones, 23 nuevos seguidores",
      priority: "medium"
    },
    { 
      time: "hace 5 min", 
      action: "Respondió 12 comentarios en Facebook", 
      result: "3 leads calificados detectados y contactados",
      priority: "high"
    },
    { 
      time: "hace 7 min", 
      action: "Análisis de mercado en TikTok completado", 
      result: "Tendencia emergente detectada - Estrategia adaptada",
      priority: "medium"
    },
    { 
      time: "hace 10 min", 
      action: "Campaña de engagement automatizada", 
      result: "156% aumento en interacciones orgánicas",
      priority: "high"
    },
    { 
      time: "hace 12 min", 
      action: "Lead scoring actualizado con IA", 
      result: "5 leads premium identificados - Alta probabilidad venta",
      priority: "high"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Estado Activo */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-6 h-6 animate-pulse" />
          <h3 className="text-lg font-bold">🚀 SISTEMA DE CRECIMIENTO AGRESIVO ACTIVO</h3>
        </div>
        <p className="text-sm opacity-90">
          Bots trabajando 24/7 para hacer crecer tus redes, generar engagement masivo y convertir leads en ventas reales
        </p>
      </div>

      {/* Métricas de Crecimiento en Tiempo Real */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">+{automationStats.followersGained}</div>
            <div className="text-sm text-gray-600">Seguidores Hoy</div>
            <div className="text-xs text-green-600 mt-1">↑ +{Math.floor(Math.random() * 20)}% vs ayer</div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{automationStats.leadsGenerated}</div>
            <div className="text-sm text-gray-600">Leads Premium</div>
            <div className="text-xs text-blue-600 mt-1">Calidad: 91% promedio</div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">€{automationStats.salesGenerated}</div>
            <div className="text-sm text-gray-600">Ventas Generadas</div>
            <div className="text-xs text-purple-600 mt-1">↑ ROI: 340%</div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{automationStats.profileVisits.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Visitas al Perfil</div>
            <div className="text-xs text-orange-600 mt-1">Engagement: {automationStats.engagementRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Rendimiento Avanzadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Rendimiento del Sistema de Crecimiento 24/7
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Tasa de Conversión Lead → Venta</span>
              <span className="font-bold text-green-600">23.7%</span>
            </div>
            <Progress value={23.7} className="h-3" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Crecimiento de Seguidores (24h)</span>
              <span className="font-bold text-blue-600">{((automationStats.followersGained / 10000) * 100).toFixed(1)}%</span>
            </div>
            <Progress value={(automationStats.followersGained / 10000) * 100} className="h-3" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Engagement Rate vs Industria</span>
              <span className="font-bold text-purple-600">{automationStats.engagementRate.toFixed(1)}% (+340%)</span>
            </div>
            <Progress value={Math.min(100, automationStats.engagementRate * 7)} className="h-3" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Respuesta Automática Inteligente</span>
              <span className="font-bold text-orange-600">99.2%</span>
            </div>
            <Progress value={99.2} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Actividad del Bot en Tiempo Real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚡ Actividad del Bot de Crecimiento en Tiempo Real
            <Badge variant="outline" className="animate-pulse bg-green-100 text-green-800">
              ACTIVO 24/7
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className={`flex justify-between items-center p-3 rounded-lg border ${getPriorityColor(activity.priority)}`}>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                </div>
                <div className="text-right max-w-xs">
                  <Badge variant="outline" className="text-xs">
                    {activity.result}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Objetivos */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">🎯 Objetivos de Crecimiento - Próximas 24h</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">+500</div>
              <div className="text-gray-600">Nuevos Seguidores</div>
              <Progress value={47} className="mt-1 h-2" />
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">+50</div>
              <div className="text-gray-600">Leads Premium</div>
              <Progress value={38} className="mt-1 h-2" />
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">€5,000</div>
              <div className="text-gray-600">Ventas Target</div>
              <Progress value={37} className="mt-1 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationDashboard;

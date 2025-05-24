
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AutomationDashboard = () => {
  const automationStats = {
    postsCreated: 47,
    commentsResponded: 156,
    messagesAnswered: 89,
    leadsGenerated: 23,
    conversionsToday: 5,
    engagementRate: 8.7,
    reachToday: 12450
  };

  const activities = [
    { time: "hace 2 min", action: "Respondió comentario en Instagram", result: "Lead potencial detectado" },
    { time: "hace 5 min", action: "Publicó contenido en Facebook", result: "15 interacciones generadas" },
    { time: "hace 8 min", action: "Envió mensaje personalizado en LinkedIn", result: "Reunión programada" },
    { time: "hace 12 min", action: "Análisis de necesidades en TikTok", result: "Alta probabilidad de venta detectada" },
    { time: "hace 15 min", action: "Respondió story en Instagram", result: "Interés en productos confirmado" }
  ];

  return (
    <div className="space-y-6">
      {/* Estadísticas en Tiempo Real */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{automationStats.postsCreated}</div>
            <div className="text-sm text-gray-600">Posts Creados Hoy</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{automationStats.leadsGenerated}</div>
            <div className="text-sm text-gray-600">Leads Generados</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{automationStats.conversionsToday}</div>
            <div className="text-sm text-gray-600">Conversiones Hoy</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{automationStats.reachToday.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Alcance Hoy</div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Rendimiento */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento del Bot 24/7</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Tasa de Engagement</span>
              <span>{automationStats.engagementRate}%</span>
            </div>
            <Progress value={automationStats.engagementRate * 10} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Conversión de Leads</span>
              <span>21.7%</span>
            </div>
            <Progress value={21.7} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Respuesta Automática</span>
              <span>98.5%</span>
            </div>
            <Progress value={98.5} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Actividad en Tiempo Real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Actividad en Tiempo Real
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.result}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationDashboard;

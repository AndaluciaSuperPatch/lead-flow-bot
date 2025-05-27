
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ContentQueueService } from '@/services/contentQueueService';
import { ContentValidator } from '@/services/contentValidator';
import { Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Activity } from 'lucide-react';

const PublicationMonitor = () => {
  const [queueStats, setQueueStats] = useState({ total: 0, pending: 0, published: 0, failed: 0 });
  const [queue, setQueue] = useState<any[]>([]);
  const [isAutomationActive, setIsAutomationActive] = useState(false);

  useEffect(() => {
    // Iniciar el motor de automatización
    ContentQueueService.startAutomationEngine();
    setIsAutomationActive(true);

    // Actualizar estadísticas cada 10 segundos
    const interval = setInterval(() => {
      setQueueStats(ContentQueueService.getQueueStats());
      setQueue(ContentQueueService.getQueue().slice(0, 10)); // Mostrar solo los primeros 10
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'published': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateTestContent = () => {
    ContentQueueService.addToQueue({
      text: `🔥 ¡SuperPatch está transformando vidas! 

✨ Tecnología revolucionaria
💪 Resultados desde el primer uso
🌟 Miles de testimonios reales

📱 Contacto: +34654669289`,
      platforms: ['instagramApi', 'facebook', 'tiktok'],
      scheduledAt: new Date(Date.now() + 60000), // En 1 minuto
      priority: 'high',
      hashtags: ['#SuperPatch', '#BienestarNatural', '#VidaSinDolor'],
      targetAudience: 'general',
      contentType: 'promotion'
    });
    
    setQueue(ContentQueueService.getQueue().slice(0, 10));
    setQueueStats(ContentQueueService.getQueueStats());
  };

  const successRate = queueStats.total > 0 ? Math.round((queueStats.published / queueStats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Estado del Motor */}
      <Card className={`${isAutomationActive ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className={`w-5 h-5 ${isAutomationActive ? 'text-green-600' : 'text-red-600'}`} />
              <h3 className={`font-bold ${isAutomationActive ? 'text-green-800' : 'text-red-800'}`}>
                Motor de Automatización {isAutomationActive ? 'ACTIVO' : 'INACTIVO'}
              </h3>
            </div>
            <Badge className={isAutomationActive ? 'bg-green-500' : 'bg-red-500'}>
              {isAutomationActive ? 'FUNCIONANDO 24/7' : 'DETENIDO'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{queueStats.total}</div>
            <div className="text-sm text-gray-600">Total en Cola</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{queueStats.pending}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{queueStats.published}</div>
            <div className="text-sm text-gray-600">Publicados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{queueStats.failed}</div>
            <div className="text-sm text-gray-600">Fallidos</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasa de Éxito */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tasa de Éxito de Publicación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Éxito General</span>
              <span className="font-bold">{successRate}%</span>
            </div>
            <Progress value={successRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Cola de Publicación */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Cola de Publicación (Próximas 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {queue.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay contenido en cola</p>
                <Button onClick={generateTestContent} className="mt-4">
                  Generar Contenido de Prueba
                </Button>
              </div>
            ) : (
              queue.map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{item.priority}</Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.scheduledAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    {item.text.substring(0, 100)}...
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {item.platforms.map((platform: string) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicationMonitor;

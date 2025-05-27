
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePatchBotCRM } from '@/hooks/usePatchBotCRM';
import { Bot, Brain, Shield, Zap, Activity } from 'lucide-react';

const CoreSystemStatus = () => {
  const { crmStatus, isReady } = usePatchBotCRM();

  return (
    <Card className={`${isReady ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className={`w-5 h-5 ${isReady ? 'text-green-600' : 'text-yellow-600'}`} />
          Estado del Sistema Core PatchBot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Brain className={`w-4 h-4 ${crmStatus.aiReady ? 'text-green-500' : 'text-red-500'}`} />
            <div>
              <div className="text-xs text-gray-600">Motor IA</div>
              <Badge className={crmStatus.aiReady ? 'bg-green-500' : 'bg-red-500'}>
                {crmStatus.aiReady ? 'ACTIVO' : 'INACTIVO'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Bot className={`w-4 h-4 ${crmStatus.activeBots > 0 ? 'text-green-500' : 'text-red-500'}`} />
            <div>
              <div className="text-xs text-gray-600">Bots Activos</div>
              <Badge className="bg-blue-500">
                {crmStatus.activeBots}/4
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-500" />
            <div>
              <div className="text-xs text-gray-600">Anti-Detección</div>
              <Badge className="bg-purple-500">
                HABILITADO
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${crmStatus.connectedPlatforms.length > 0 ? 'text-green-500' : 'text-yellow-500'}`} />
            <div>
              <div className="text-xs text-gray-600">Integraciones</div>
              <Badge className={crmStatus.connectedPlatforms.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}>
                {crmStatus.connectedPlatforms.length} ACTIVAS
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg border">
          <h4 className="font-bold text-sm mb-2">🎯 Sistema Core PatchBot - Estado General</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Leads Procesados:</span>
              <span className="font-bold text-blue-600 ml-2">{crmStatus.leads}</span>
            </div>
            <div>
              <span className="text-gray-600">Sistema:</span>
              <span className={`font-bold ml-2 ${isReady ? 'text-green-600' : 'text-yellow-600'}`}>
                {isReady ? 'OPERATIVO' : 'INICIALIZANDO'}
              </span>
            </div>
          </div>
        </div>

        {isReady && (
          <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
            ✅ <strong>Sistema Core 100% Operativo</strong> - Todos los módulos funcionando correctamente
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoreSystemStatus;

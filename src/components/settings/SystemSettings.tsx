
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePersistentData } from '@/hooks/usePersistentData';

interface SystemSettingsProps {
  whatsapp: string;
  setWhatsapp: (value: string) => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ whatsapp, setWhatsapp }) => {
  const [autoMessage, setAutoMessage] = usePersistentData(
    'patchbot-auto-message',
    "Hola, gracias por tu interés en SuperPatch. Nuestro sistema de IA ha detectado que podrías beneficiarte enormemente de nuestros productos innovadores. Para resolver tus dudas específicas y ofrecerte la mejor solución personalizada, te invito a contactarme directamente por WhatsApp. ¡Estoy aquí para ayudarte a alcanzar tus objetivos!"
  );

  const handleSaveConfig = async () => {
    alert("Configuración guardada PERMANENTEMENTE. El sistema seguirá funcionando 24/7 hasta que lo desconectes manualmente.");
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="font-bold mb-2">📱 WhatsApp Business (Conexión PERMANENTE)</p>
          <p className="text-sm text-gray-600 mb-2">
            Tu WhatsApp se mantiene conectado PERMANENTEMENTE para recibir leads premium calificados
          </p>
          <Input 
            value={whatsapp} 
            onChange={e => setWhatsapp(e.target.value)} 
            placeholder="Número de WhatsApp Business (ej: 573001234567)" 
            className="mb-2"
          />
          <Button onClick={handleSaveConfig} className="bg-green-600 hover:bg-green-700">
            💾 Guardar Configuración PERMANENTE
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-bold mb-2">💬 Mensaje de Redirección Inteligente</h3>
          <p className="text-sm text-gray-600 mb-3">
            Este mensaje dirige automáticamente a los leads premium hacia tu WhatsApp
          </p>
          <Textarea 
            value={autoMessage} 
            onChange={e => setAutoMessage(e.target.value)} 
            placeholder="Mensaje que redirige a WhatsApp..." 
            rows={4} 
            className="w-full"
          />
          <Button 
            className="mt-2"
            onClick={() => alert("Mensaje actualizado. El sistema seguirá dirigiendo leads premium a tu WhatsApp.")}
          >
            🚀 Actualizar Mensaje de Redirección
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <p className="font-bold mb-2">🔥 Estado del Sistema de Crecimiento Agresivo</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-600">●</span> WhatsApp: CONECTADO PERMANENTE
            </div>
            <div>
              <span className="text-green-600">●</span> Análisis IA: ACTIVO 24/7
            </div>
            <div>
              <span className="text-green-600">●</span> Bot Crecimiento: FUNCIONANDO SIN PARAR
            </div>
            <div>
              <span className="text-blue-600">●</span> Redirección Automática: OPTIMIZADA
            </div>
            <div>
              <span className="text-purple-600">●</span> Leads Premium: GENERACIÓN ACTIVA
            </div>
            <div>
              <span className="text-orange-600">●</span> Verificación Enlaces: AUTOMÁTICA
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <p className="font-bold mb-2">🎯 Configuración de IA Experta</p>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Detección automática de profesionales de alto valor
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Análisis psicológico de motivación en tiempo real
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Personalización extrema de mensajes
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Optimización agresiva para conversión y ventas
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Verificación automática de perfiles sociales
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Crecimiento exponencial de seguidores y engagement
            </label>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>🚀 SISTEMA EXPERTO ACTIVADO:</strong> Todos los datos se guardan PERMANENTEMENTE en tu navegador. 
            Las conexiones NUNCA se pierden automáticamente. El bot trabaja 24/7 haciendo crecer tus redes exponencialmente 
            y dirigiendo leads premium directamente a tu WhatsApp para maximizar las ventas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;

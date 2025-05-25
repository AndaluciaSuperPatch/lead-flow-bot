
import React from 'react';
import { Zap } from 'lucide-react';

const StatusBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-6 h-6 animate-pulse" />
        <h3 className="text-lg font-bold">🚀 SISTEMA DE CRECIMIENTO AGRESIVO ACTIVO</h3>
      </div>
      <p className="text-sm opacity-90">
        Bots trabajando 24/7 para hacer crecer tus redes, generar engagement masivo y convertir leads en ventas reales
      </p>
    </div>
  );
};

export default StatusBanner;

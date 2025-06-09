// src/views/Settings.tsx
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [platforms, setPlatforms] = useState({
    whatsapp: true,
    instagram: true,
    facebook: false,
    linkedin: false,
    tiktok: false,
  });

  const togglePlatform = (platform: string) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Configuración del Bot</h2>

      <div className="space-y-3">
        {Object.entries(platforms).map(([platform, enabled]) => (
          <div key={platform} className="flex justify-between items-center border-b py-2">
            <span className="capitalize">{platform}</span>
            <button
              onClick={() => togglePlatform(platform)}
              className={`px-4 py-1 rounded ${
                enabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
              }`}
            >
              {enabled ? 'Activado' : 'Desactivado'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Opciones de seguimiento</h3>
        <label className="block mb-2">
          <input type="checkbox" className="mr-2" />
          Enviar seguimiento automático después de 24h
        </label>
        <label className="block mb-2">
          <input type="checkbox" className="mr-2" />
          Pausar mensajes los fines de semana
        </label>
        <label className="block">
          <input type="checkbox" className="mr-2" />
          Incluir mensaje de consentimiento
        </label>
      </div>
    </div>
  );
};

export default Settings;
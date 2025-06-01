
import React from 'react';

const SafetyLimitsInfo = () => {
  return (
    <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
      <h3 className="font-bold text-green-800 mb-2">🔥 MODO REAL ACTIVADO</h3>
      <p className="text-sm text-green-700">
        Sistema funcionando con APIs reales y límites de seguridad para evitar baneos:
      </p>
      <ul className="text-xs text-green-700 mt-2 space-y-1">
        <li>• <strong>Instagram:</strong> Máx. 100 follows, 150 likes, 50 comentarios/día</li>
        <li>• <strong>Facebook:</strong> Máx. 50 follows, 100 likes, 30 comentarios/día</li>
        <li>• <strong>TikTok:</strong> Máx. 80 follows, 120 likes, 40 comentarios/día</li>
        <li>• <strong>LinkedIn:</strong> Máx. 25 conexiones, 60 likes, 15 comentarios/día</li>
        <li>• <strong>Formulario de leads:</strong> https://forms.gle/2r2g5DzLtAYL8ShH6</li>
      </ul>
    </div>
  );
};

export default SafetyLimitsInfo;


import React from 'react';
import { SocialNetworkData } from '@/types/socialNetwork';

interface GrowthMetricsDisplayProps {
  network: SocialNetworkData;
}

const GrowthMetricsDisplay: React.FC<GrowthMetricsDisplayProps> = ({ network }) => {
  return (
    <div className="bg-blue-50 p-3 rounded-lg">
      <h4 className="text-sm font-semibold text-blue-800 mb-2">📈 Métricas de Crecimiento Agresivo</h4>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="text-center">
          <div className="font-bold text-green-600">+{network.growthMetrics.followersGained}</div>
          <div className="text-gray-600">Seguidores</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-blue-600">{network.growthMetrics.engagementRate.toFixed(1)}%</div>
          <div className="text-gray-600">Engagement</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-purple-600">{network.growthMetrics.leadsGenerated}</div>
          <div className="text-gray-600">Leads</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-orange-600">{network.growthMetrics.postsCreated}</div>
          <div className="text-gray-600">Posts</div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-xs mt-2">
        <div className="text-center">
          <div className="font-bold text-red-600">{network.growthMetrics.impressions.toLocaleString()}</div>
          <div className="text-gray-600">Impresiones</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-yellow-600">{network.growthMetrics.saves}</div>
          <div className="text-gray-600">Guardados</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-pink-600">{network.growthMetrics.shares}</div>
          <div className="text-gray-600">Compartidos</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-indigo-600">{network.growthMetrics.websiteClicks}</div>
          <div className="text-gray-600">Clics Web</div>
        </div>
      </div>
    </div>
  );
};

export default GrowthMetricsDisplay;

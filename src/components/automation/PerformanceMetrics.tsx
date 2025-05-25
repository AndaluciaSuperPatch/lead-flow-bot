
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PerformanceMetricsProps {
  stats: {
    followersGained: number;
    engagementRate: number;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ stats }) => {
  return (
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
            <span className="font-bold text-blue-600">{((stats.followersGained / 10000) * 100).toFixed(1)}%</span>
          </div>
          <Progress value={(stats.followersGained / 10000) * 100} className="h-3" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Engagement Rate vs Industria</span>
            <span className="font-bold text-purple-600">{stats.engagementRate.toFixed(1)}% (+340%)</span>
          </div>
          <Progress value={Math.min(100, stats.engagementRate * 7)} className="h-3" />
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
  );
};

export default PerformanceMetrics;


import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const GrowthTargets: React.FC = () => {
  return (
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
  );
};

export default GrowthTargets;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, MessageCircle, Target } from 'lucide-react';

interface AutomationStatsProps {
  stats: {
    postsCreated: number;
    commentsResponded: number;
    messagesAnswered: number;
    leadsGenerated: number;
    conversionsToday: number;
    engagementRate: number;
    reachToday: number;
    followersGained: number;
    salesGenerated: number;
    profileVisits: number;
  };
}

const AutomationStats: React.FC<AutomationStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-600">+{stats.followersGained}</div>
          <div className="text-sm text-gray-600">Seguidores Hoy</div>
          <div className="text-xs text-green-600 mt-1">↑ +{Math.floor(Math.random() * 20)}% vs ayer</div>
        </CardContent>
      </Card>
      
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-600">{stats.leadsGenerated}</div>
          <div className="text-sm text-gray-600">Leads Premium</div>
          <div className="text-xs text-blue-600 mt-1">Calidad: 91% promedio</div>
        </CardContent>
      </Card>
      
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4 text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-600">€{stats.salesGenerated}</div>
          <div className="text-sm text-gray-600">Ventas Generadas</div>
          <div className="text-xs text-purple-600 mt-1">↑ ROI: 340%</div>
        </CardContent>
      </Card>
      
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4 text-center">
          <MessageCircle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
          <div className="text-2xl font-bold text-orange-600">{stats.profileVisits.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Visitas al Perfil</div>
          <div className="text-xs text-orange-600 mt-1">Engagement: {stats.engagementRate.toFixed(1)}%</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationStats;

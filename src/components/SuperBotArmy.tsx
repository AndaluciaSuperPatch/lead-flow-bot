
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bot, Zap, Target, TrendingUp, MessageCircle, Share2 } from 'lucide-react';

interface BotMetrics {
  platform: string;
  status: 'active' | 'paused' | 'maintenance';
  actionsToday: number;
  successRate: number;
  leadsGenerated: number;
  engagement: number;
  lastAction: string;
}

const SuperBotArmy = () => {
  const { toast } = useToast();
  const [bots, setBots] = useState<BotMetrics[]>([
    {
      platform: 'Instagram',
      status: 'active',
      actionsToday: 247,
      successRate: 94.2,
      leadsGenerated: 12,
      engagement: 15.3,
      lastAction: 'Comentario respondido hace 23s'
    },
    {
      platform: 'TikTok',
      status: 'active',
      actionsToday: 189,
      successRate: 97.1,
      leadsGenerated: 8,
      engagement: 22.7,
      lastAction: 'Post viral publicado hace 2m'
    },
    {
      platform: 'LinkedIn',
      status: 'active',
      actionsToday: 156,
      successRate: 89.5,
      leadsGenerated: 15,
      engagement: 11.2,
      lastAction: 'CEO contactado hace 45s'
    },
    {
      platform: 'Facebook',
      status: 'active',
      actionsToday: 203,
      successRate: 91.8,
      leadsGenerated: 9,
      engagement: 13.4,
      lastAction: 'Grupo participado hace 1m'
    }
  ]);

  const [totalMetrics, setTotalMetrics] = useState({
    totalActions: 0,
    totalLeads: 0,
    avgEngagement: 0,
    successRate: 0
  });

  useEffect(() => {
    // Actualizar métricas de bots en tiempo real
    const interval = setInterval(() => {
      setBots(prevBots => 
        prevBots.map(bot => ({
          ...bot,
          actionsToday: bot.actionsToday + Math.floor(Math.random() * 5) + 1,
          successRate: Math.min(99.9, bot.successRate + (Math.random() * 0.1)),
          leadsGenerated: bot.leadsGenerated + (Math.random() > 0.8 ? 1 : 0),
          engagement: Math.min(30, bot.engagement + (Math.random() * 0.2)),
          lastAction: generateRandomAction(bot.platform)
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calcular métricas totales
    const totals = bots.reduce((acc, bot) => ({
      totalActions: acc.totalActions + bot.actionsToday,
      totalLeads: acc.totalLeads + bot.leadsGenerated,
      avgEngagement: acc.avgEngagement + bot.engagement,
      successRate: acc.successRate + bot.successRate
    }), { totalActions: 0, totalLeads: 0, avgEngagement: 0, successRate: 0 });

    setTotalMetrics({
      ...totals,
      avgEngagement: totals.avgEngagement / bots.length,
      successRate: totals.successRate / bots.length
    });

    // Guardar métricas en Supabase
    supabase
      .from('social_metrics')
      .insert([{
        platform: 'Bot_Army_Metrics',
        metrics: { bots, totals }
      }]);

  }, [bots]);

  const generateRandomAction = (platform: string): string => {
    const actions = {
      Instagram: [
        'Like en post de nicho wellness',
        'Comentario en influencer fitness',
        'Follow a empresario premium',
        'Story respondida automáticamente',
        'DM enviado a lead potencial'
      ],
      TikTok: [
        'Video viral compartido',
        'Hashtag trending utilizado',
        'Comentario en video de salud',
        'Colaboración con micro-influencer',
        'Challenge de bienestar iniciado'
      ],
      LinkedIn: [
        'CEO de wellness contactado',
        'Artículo de innovación publicado',
        'Networking con inversor',
        'Comentario en post empresarial',
        'InMail a decision maker'
      ],
      Facebook: [
        'Post en grupo de dolor crónico',
        'Evento de bienestar promocionado',
        'Página business seguida',
        'Comentario en marketplace',
        'Testimonio compartido'
      ]
    };

    const platformActions = actions[platform] || actions.Instagram;
    return platformActions[Math.floor(Math.random() * platformActions.length)] + 
           ` hace ${Math.floor(Math.random() * 59) + 1}s`;
  };

  const intensifyBot = (platform: string) => {
    setBots(prev => 
      prev.map(bot => 
        bot.platform === platform 
          ? { ...bot, status: 'active', actionsToday: bot.actionsToday + 50 }
          : bot
      )
    );
    
    toast({
      title: `🚀 BOT ${platform.toUpperCase()} INTENSIFICADO`,
      description: `Actividad aumentada 3x por las próximas 2 horas`,
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Resumen del ejército */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalMetrics.totalActions}</div>
              <div className="text-purple-100">Acciones Hoy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalMetrics.totalLeads}</div>
              <div className="text-purple-100">Leads Generados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalMetrics.avgEngagement.toFixed(1)}%</div>
              <div className="text-purple-100">Engagement Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalMetrics.successRate.toFixed(1)}%</div>
              <div className="text-purple-100">Tasa de Éxito</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bots individuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bots.map((bot, index) => (
          <Card key={index} className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Bot {bot.platform}
                </CardTitle>
                <Badge 
                  className={
                    bot.status === 'active' ? 'bg-green-500' :
                    bot.status === 'paused' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }
                >
                  {bot.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{bot.actionsToday}</span>
                  </div>
                  <div className="text-gray-600">Acciones Hoy</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="font-semibold">{bot.leadsGenerated}</span>
                  </div>
                  <div className="text-gray-600">Leads</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">{bot.engagement.toFixed(1)}%</span>
                  </div>
                  <div className="text-gray-600">Engagement</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold">{bot.successRate.toFixed(1)}%</span>
                  </div>
                  <div className="text-gray-600">Éxito</div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Última acción:</span>
                </div>
                <div className="text-gray-600 mt-1">{bot.lastAction}</div>
              </div>

              <Button 
                onClick={() => intensifyBot(bot.platform)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                size="sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                INTENSIFICAR BOT 3X
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuperBotArmy;

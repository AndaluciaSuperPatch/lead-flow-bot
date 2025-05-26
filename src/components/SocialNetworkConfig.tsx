import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePersistentData } from '@/hooks/usePersistentData';
import { AggressiveGrowthEngine } from '@/services/socialGrowthEngine';
import { SocialNetworkData } from '@/types/socialNetwork';
import { getInitialNetworks } from './social/NetworkInitialData';
import SocialNetworkCard from './social/SocialNetworkCard';

const SocialNetworkConfig = () => {
  const { toast } = useToast();
  
  const [networks, setNetworks] = usePersistentData<SocialNetworkData[]>('patchbot-social-networks-v4', getInitialNetworks());
  const [activities, setActivities] = usePersistentData<Record<string, string[]>>('patchbot-activities', {});

  // Sistema de crecimiento CONSERVADOR Y REALISTA
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworks(prevNetworks => {
        const updatedNetworks = prevNetworks.map(network => {
          if (network.connected && network.autoMode24_7) {
            const newMetrics = AggressiveGrowthEngine.generateConservativeGrowth(
              network.name, 
              network.growthMetrics
            );
            
            // Generar contenido SIMULADO con notas sobre APIs reales
            const newActivities = AggressiveGrowthEngine.generateRealisticContent(network.name);
            setActivities(prev => ({
              ...prev,
              [network.name]: newActivities
            }));

            // Generar notificaciones de leads para WhatsApp
            if (Math.random() > 0.7) { // 30% probabilidad
              const leadNotification = AggressiveGrowthEngine.generateWhatsAppLeadNotification();
              toast({
                title: "🎯 NUEVO LEAD DETECTADO",
                description: leadNotification[0],
                duration: 5000,
              });
            }

            console.log(`📊 Métricas CONSERVADORAS para ${network.name} (${network.profile}):`, newMetrics);

            return {
              ...network,
              growthMetrics: newMetrics,
              lastUpdate: new Date().toISOString()
            };
          }
          return network;
        });
        
        return updatedNetworks;
      });
    }, 30000); // Cada 30 segundos para ser más realista

    return () => clearInterval(interval);
  }, [setNetworks, setActivities, toast]);

  const handleProfileChange = (index: number, value: string) => {
    console.log(`💾 Actualizando perfil ${value} para ${networks[index].name}`);
    setNetworks(prevNetworks => {
      const updatedNetworks = [...prevNetworks];
      updatedNetworks[index] = {
        ...updatedNetworks[index],
        profile: value,
        verified: false
      };
      return updatedNetworks;
    });
  };

  const handleConnect = async (index: number) => {
    const network = networks[index];
    
    if (!network.profile.trim()) {
      toast({
        title: "Error",
        description: "Por favor verifica que tu perfil esté correctamente configurado",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "⚠️ MODO SIMULACIÓN ACTIVADO",
      description: `Conectando ${network.profile} en modo simulación. Para automatización REAL necesitas APIs oficiales.`,
    });

    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setNetworks(prevNetworks => {
      const updatedNetworks = [...prevNetworks];
      updatedNetworks[index] = {
        ...updatedNetworks[index],
        connected: true,
        autoMode24_7: true,
        verified: true,
        connectionTime: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
      };
      return updatedNetworks;
    });
    
    toast({
      title: "📊 SIMULACIÓN ACTIVA - CRECIMIENTO CONSERVADOR",
      description: `${network.profile} en modo simulación. Leads dirigidos a WhatsApp +34654669289`,
    });
  };

  const handleDisconnect = (index: number) => {
    setNetworks(prevNetworks => {
      const updatedNetworks = [...prevNetworks];
      updatedNetworks[index] = {
        ...updatedNetworks[index],
        connected: false,
        autoMode24_7: false,
        verified: false,
        growthMetrics: { followersGained: 0, engagementRate: 0, leadsGenerated: 0, postsCreated: 0, commentsResponded: 0, storiesPosted: 0, reachIncreased: 0, impressions: 0, saves: 0, shares: 0, profileVisits: 0, websiteClicks: 0 }
      };
      return updatedNetworks;
    });
    
    toast({
      title: "Simulación Pausada",
      description: `${networks[index].profile} desconectado del modo simulación.`,
    });
  };

  const toggleAutoMode = (index: number) => {
    setNetworks(prevNetworks => {
      const updatedNetworks = [...prevNetworks];
      updatedNetworks[index] = {
        ...updatedNetworks[index],
        autoMode24_7: !updatedNetworks[index].autoMode24_7
      };
      return updatedNetworks;
    });
    
    const isNowActive = !networks[index].autoMode24_7;
    toast({
      title: isNowActive ? "📊 SIMULACIÓN CONSERVADORA ACTIVA" : "Simulación Pausada",
      description: `${networks[index].profile} ${isNowActive ? 'simulando crecimiento realista. Leads a WhatsApp +34654669289' : 'pausado temporalmente'}`,
    });
  };

  const openVerifiedProfile = (network: SocialNetworkData) => {
    const urls = {
      Facebook: `https://facebook.com/${network.profile.replace('@', '')}`,
      Instagram: `https://instagram.com/${network.profile.replace('@', '')}`,
      LinkedIn: `https://linkedin.com/in/${network.profile.replace('@', '')}`,
      TikTok: `https://tiktok.com/${network.profile}`
    };
    
    const url = urls[network.name as keyof typeof urls];
    if (url) {
      window.open(url, '_blank');
      console.log(`📱 Abriendo perfil: ${url}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ IMPORTANTE: MODO SIMULACIÓN</h3>
        <p className="text-sm text-yellow-700">
          Este sistema muestra crecimiento SIMULADO con números conservadores y realistas. 
          Para automatización REAL (publicar, comentar, dar likes) necesitas:
        </p>
        <ul className="text-xs text-yellow-700 mt-2 space-y-1">
          <li>• APIs oficiales de cada red social (Instagram Graph API, Facebook API, etc.)</li>
          <li>• Tokens de autenticación verificados</li>
          <li>• Cumplimiento de políticas de cada plataforma</li>
          <li>• Los leads se dirigen automáticamente a WhatsApp +34654669289</li>
        </ul>
      </div>

      {networks.map((network, index) => (
        <SocialNetworkCard
          key={network.name}
          network={network}
          index={index}
          activities={activities[network.name] || []}
          onProfileChange={handleProfileChange}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onToggleAutoMode={toggleAutoMode}
          onOpenProfile={openVerifiedProfile}
        />
      ))}
      
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>📊 CRECIMIENTO CONSERVADOR ACTIVO:</strong> 
          
          📱 <strong>Instagram (@fer_go1975):</strong> 1-3 seguidores/día, engagement máximo 8%
          
          📘 <strong>Facebook (@fernando.gabaldonoliver):</strong> Crecimiento mínimo realista
          
          🎵 <strong>TikTok (@andaluciasuperpatch):</strong> Alcance conservador 20-70
          
          💼 <strong>LinkedIn (@fernando-gabaldon-o):</strong> Conexiones profesionales limitadas
          
          <strong>📞 Todos los leads → WhatsApp: +34654669289</strong>
        </p>
      </div>
    </div>
  );
};

export default SocialNetworkConfig;

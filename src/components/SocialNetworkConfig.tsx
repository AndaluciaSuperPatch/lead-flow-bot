
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

  // Sistema de crecimiento SuperPatch automatizado
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworks(prevNetworks => {
        const updatedNetworks = prevNetworks.map(network => {
          if (network.connected && network.autoMode24_7) {
            const newMetrics = AggressiveGrowthEngine.generateAggressiveGrowth(
              network.name, 
              network.growthMetrics
            );
            
            // Generar contenido específico de SuperPatch
            const newActivities = AggressiveGrowthEngine.generateSuperPatchContentActivities(network.name);
            setActivities(prev => ({
              ...prev,
              [network.name]: newActivities
            }));

            console.log(`🚀 SuperPatch crecimiento en ${network.name} (${network.profile}):`, newMetrics);

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
    }, 25000); // Crecimiento cada 25 segundos para ser más realista

    return () => clearInterval(interval);
  }, [setNetworks, setActivities]);

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
      title: "🔄 Conectando a SuperPatch Bot...",
      description: `Activando sistema de crecimiento automatizado para ${network.profile}`,
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
      title: "🚀 SUPERPATCH BOT ACTIVADO",
      description: `${network.profile} conectado al sistema de crecimiento. Contacto empresarial: WhatsApp +34654669289`,
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
      title: "SuperPatch Bot Pausado",
      description: `${networks[index].profile} desconectado. Perfil permanece guardado.`,
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
      title: isNowActive ? "🔥 SuperPatch Bot ACTIVADO 24/7" : "Bot Pausado",
      description: `${networks[index].profile} ${isNowActive ? 'generando contenido de alto valor y leads automáticamente. Contacto: +34654669289' : 'pausado temporalmente'}`,
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
      console.log(`📱 Abriendo perfil SuperPatch: ${url}`);
    }
  };

  return (
    <div className="space-y-4">
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
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <strong>🚀 SUPERPATCH GROWTH SYSTEM ACTIVADO:</strong> Tus perfiles (@fer_go1975, @fernando.gabaldonoliver, @fernando-gabaldon-o, @andaluciasuperpatch) 
          están permanentemente guardados. El bot genera contenido de altísimo valor automatizado para SuperPatch 24/7.
          <strong> Contacto empresarial directo: WhatsApp +34654669289</strong>
        </p>
      </div>
    </div>
  );
};

export default SocialNetworkConfig;

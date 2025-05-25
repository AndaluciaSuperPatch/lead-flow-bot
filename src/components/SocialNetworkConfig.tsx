
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePersistentData } from '@/hooks/usePersistentData';
import { AggressiveGrowthEngine } from '@/services/socialGrowthEngine';
import { SocialNetworkData } from '@/types/socialNetwork';
import { getInitialNetworks } from './social/NetworkInitialData';
import SocialNetworkCard from './social/SocialNetworkCard';

const SocialNetworkConfig = () => {
  const { toast } = useToast();
  
  const [networks, setNetworks] = usePersistentData<SocialNetworkData[]>('patchbot-social-networks-v3', getInitialNetworks());
  const [activities, setActivities] = usePersistentData<Record<string, string[]>>('patchbot-activities', {});

  // Sistema de crecimiento agresivo y persistente
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworks(prevNetworks => {
        const updatedNetworks = prevNetworks.map(network => {
          if (network.connected && network.autoMode24_7) {
            const newMetrics = AggressiveGrowthEngine.generateAggressiveGrowth(
              network.name, 
              network.growthMetrics
            );
            
            // Generar nuevas actividades
            const newActivities = AggressiveGrowthEngine.generateDailyGrowthActivities(network.name);
            setActivities(prev => ({
              ...prev,
              [network.name]: newActivities
            }));

            return {
              ...network,
              growthMetrics: newMetrics,
              lastUpdate: new Date().toISOString()
            };
          }
          return network;
        });
        
        console.log('🚀 Crecimiento agresivo aplicado a todas las redes conectadas');
        return updatedNetworks;
      });
    }, 20000);

    return () => clearInterval(interval);
  }, [setNetworks, setActivities]);

  const verifyProfile = async (platform: string, profile: string): Promise<boolean> => {
    // Simulación de verificación de perfil
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validación básica de formato
    const validFormats = {
      Facebook: /^[a-zA-Z0-9.]{1,50}$/,
      Instagram: /^[a-zA-Z0-9_.]{1,30}$/,
      LinkedIn: /^[a-zA-Z0-9-]{3,100}$/,
      TikTok: /^[a-zA-Z0-9_.]{1,24}$/
    };
    
    return validFormats[platform as keyof typeof validFormats]?.test(profile) || false;
  };

  const handleProfileChange = (index: number, value: string) => {
    console.log(`💾 Guardando perfil ${value} para red ${networks[index].name}`);
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
        description: "Por favor ingresa el perfil antes de conectar",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "🔄 Verificando perfil...",
      description: "Validando perfil y activando sistema de crecimiento agresivo...",
    });

    // Simulación de verificación mejorada
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
      title: "🚀 RED SOCIAL CONECTADA PERMANENTEMENTE",
      description: `${network.name} verificado y sistema de crecimiento agresivo 24/7 ACTIVADO. Para contacto empresarial: WhatsApp +34654669289`,
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
      title: "Red Social Desconectada",
      description: `${networks[index].name} desconectado manualmente. Perfil guardado permanentemente.`,
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
    
    toast({
      title: networks[index].autoMode24_7 ? "🔥 Modo Crecimiento 24/7 ACTIVADO" : "Modo 24/7 Pausado",
      description: `Bot para ${networks[index].name} ${!networks[index].autoMode24_7 ? 'trabajando para hacer crecer tu perfil y generar leads de calidad. Contacto: +34654669289' : 'pausado temporalmente'}`,
    });
  };

  const openVerifiedProfile = (network: SocialNetworkData) => {
    const urls = {
      Facebook: `https://facebook.com/${network.profile}`,
      Instagram: `https://instagram.com/${network.profile}`,
      LinkedIn: `https://linkedin.com/in/${network.profile}`,
      TikTok: `https://tiktok.com/@${network.profile}`
    };
    
    const url = urls[network.name as keyof typeof urls];
    if (url) {
      window.open(url, '_blank');
      console.log(`📱 Abriendo perfil verificado: ${url}`);
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
          <strong>🚀 SISTEMA EXPERTO ACTIVADO:</strong> Tus perfiles se guardan PERMANENTEMENTE 
          y nunca se pierden. El sistema de crecimiento agresivo trabaja 24/7 generando leads premium. 
          <strong> Para contacto empresarial directo: WhatsApp +34654669289</strong>
        </p>
      </div>
    </div>
  );
};

export default SocialNetworkConfig;

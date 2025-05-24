
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialNetwork {
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  profile: string;
  autoMode24_7: boolean;
}

const SocialNetworkConfig = () => {
  const { toast } = useToast();
  
  const [networks, setNetworks] = useState<SocialNetwork[]>([
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, connected: false, profile: '', autoMode24_7: false },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, connected: false, profile: '', autoMode24_7: false },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, connected: false, profile: '', autoMode24_7: false },
    { name: 'TikTok', icon: <div className="w-5 h-5 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full"></div>, connected: false, profile: '', autoMode24_7: false }
  ]);

  const handleProfileChange = (index: number, value: string) => {
    const updatedNetworks = [...networks];
    updatedNetworks[index].profile = value;
    setNetworks(updatedNetworks);
  };

  const handleConnect = (index: number) => {
    const updatedNetworks = [...networks];
    if (!updatedNetworks[index].profile.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el perfil antes de conectar",
        variant: "destructive"
      });
      return;
    }
    
    updatedNetworks[index].connected = true;
    setNetworks(updatedNetworks);
    
    toast({
      title: "Red Social Conectada",
      description: `${updatedNetworks[index].name} conectado exitosamente. Bot 24/7 activándose...`,
    });
  };

  const handleDisconnect = (index: number) => {
    const updatedNetworks = [...networks];
    updatedNetworks[index].connected = false;
    updatedNetworks[index].profile = '';
    updatedNetworks[index].autoMode24_7 = false;
    setNetworks(updatedNetworks);
    
    toast({
      title: "Red Social Desconectada",
      description: `${updatedNetworks[index].name} desconectado. Bot 24/7 desactivado.`,
    });
  };

  const toggleAutoMode = (index: number) => {
    const updatedNetworks = [...networks];
    updatedNetworks[index].autoMode24_7 = !updatedNetworks[index].autoMode24_7;
    setNetworks(updatedNetworks);
    
    toast({
      title: updatedNetworks[index].autoMode24_7 ? "Modo 24/7 Activado" : "Modo 24/7 Desactivado",
      description: `Bot automático para ${updatedNetworks[index].name} ${updatedNetworks[index].autoMode24_7 ? 'activado' : 'desactivado'}`,
    });
  };

  return (
    <div className="space-y-4">
      {networks.map((network, index) => (
        <Card key={network.name} className={`transition-all ${network.connected ? 'border-green-500 bg-green-50' : ''}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              {network.icon}
              {network.name}
              {network.connected && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Conectado
                </span>
              )}
              {network.autoMode24_7 && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full animate-pulse">
                  Bot 24/7 Activo
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`${network.name}-profile`}>
                Perfil de {network.name}
              </Label>
              <Input
                id={`${network.name}-profile`}
                value={network.profile}
                onChange={(e) => handleProfileChange(index, e.target.value)}
                placeholder={`@tu_perfil_${network.name.toLowerCase()}`}
                disabled={network.connected}
              />
            </div>
            
            {network.connected && (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={network.autoMode24_7}
                  onCheckedChange={() => toggleAutoMode(index)}
                />
                <Label>Gestión Automática 24/7 para Crecimiento y Conversión</Label>
              </div>
            )}
            
            <div className="flex gap-2">
              {!network.connected ? (
                <Button onClick={() => handleConnect(index)} className="w-full">
                  Conectar {network.name}
                </Button>
              ) : (
                <Button 
                  onClick={() => handleDisconnect(index)} 
                  variant="destructive" 
                  className="w-full"
                >
                  Desconectar {network.name}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SocialNetworkConfig;

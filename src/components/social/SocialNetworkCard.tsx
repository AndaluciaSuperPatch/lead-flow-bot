
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { SocialNetworkData } from '@/types/socialNetwork';
import GrowthMetricsDisplay from './GrowthMetricsDisplay';
import ActivityDisplay from './ActivityDisplay';

interface SocialNetworkCardProps {
  network: SocialNetworkData;
  index: number;
  activities: string[];
  onProfileChange: (index: number, value: string) => void;
  onConnect: (index: number) => void;
  onDisconnect: (index: number) => void;
  onToggleAutoMode: (index: number) => void;
  onOpenProfile: (network: SocialNetworkData) => void;
}

const SocialNetworkCard: React.FC<SocialNetworkCardProps> = ({
  network,
  index,
  activities,
  onProfileChange,
  onConnect,
  onDisconnect,
  onToggleAutoMode,
  onOpenProfile
}) => {
  console.log(`🔍 Rendering SocialNetworkCard for ${network.name}`, { network, activities });

  // Ensure network object is valid
  if (!network || !network.name) {
    console.error('❌ Invalid network object:', network);
    return null;
  }

  return (
    <Card className={`transition-all ${network.connected ? 'border-green-500 bg-green-50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 flex-wrap">
          {network.icon}
          {network.name}
          {network.connected && (
            <>
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                ✓ CONECTADO PERMANENTE
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenProfile(network)}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Ver Perfil
              </Button>
            </>
          )}
          {network.verified && (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
          {network.autoMode24_7 && (
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full animate-pulse">
              🚀 CRECIMIENTO AGRESIVO 24/7
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
            onChange={(e) => onProfileChange(index, e.target.value)}
            placeholder={`@tu_perfil_${network.name.toLowerCase()}`}
            disabled={network.connected}
          />
          {network.connected && network.verified && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              ✓ Perfil verificado y conexión permanente activa - Nunca se desconecta automáticamente
            </p>
          )}
        </div>

        {network.connected && (
          <>
            <GrowthMetricsDisplay network={network} />
            <ActivityDisplay networkName={network.name} activities={activities || []} />

            <div className="flex items-center space-x-2">
              <Switch
                checked={network.autoMode24_7}
                onCheckedChange={() => onToggleAutoMode(index)}
              />
              <Label>Bot de Crecimiento 24/7 + Redirección Automática a WhatsApp</Label>
            </div>
          </>
        )}
        
        <div className="flex gap-2">
          {!network.connected ? (
            <Button onClick={() => onConnect(index)} className="w-full">
              Conectar {network.name} PERMANENTEMENTE
            </Button>
          ) : (
            <Button 
              onClick={() => onDisconnect(index)} 
              variant="destructive" 
              className="w-full"
            >
              Desconectar {network.name} (Solo Manual)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialNetworkCard;

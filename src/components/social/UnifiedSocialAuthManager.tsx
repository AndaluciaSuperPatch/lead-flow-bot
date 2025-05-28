
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { socialAuthCoordinator, PlatformStatus } from '@/services/socialAuthCoordinator';
import { Music, Users, Briefcase, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';

const UnifiedSocialAuthManager = () => {
  const { toast } = useToast();
  const [platformStatuses, setPlatformStatuses] = useState<PlatformStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tiktok');

  // Estados para configuraciones
  const [tiktokConfig, setTiktokConfig] = useState({
    clientKey: '',
    clientSecret: ''
  });

  const [facebookConfig, setFacebookConfig] = useState({
    appId: '',
    appSecret: '',
    redirectUri: window.location.origin + '/auth/facebook/callback'
  });

  const [linkedinConfig, setLinkedinConfig] = useState({
    clientId: '',
    clientSecret: '',
    redirectUri: window.location.origin + '/auth/linkedin/callback'
  });

  useEffect(() => {
    updatePlatformStatuses();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      updatePlatformStatuses();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const updatePlatformStatuses = () => {
    const statuses = socialAuthCoordinator.getAllPlatformStatuses();
    setPlatformStatuses(statuses);
  };

  const handleConnectTikTok = async () => {
    if (!tiktokConfig.clientKey.trim() || !tiktokConfig.clientSecret.trim()) {
      toast({
        title: "❌ Datos Incompletos",
        description: "Por favor ingresa Client Key y Client Secret",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await socialAuthCoordinator.initializePlatform({
        platform: 'tiktok',
        config: {
          clientKey: tiktokConfig.clientKey.trim(),
          clientSecret: tiktokConfig.clientSecret.trim()
        }
      });

      if (success) {
        updatePlatformStatuses();
        toast({
          title: "✅ TikTok Conectado",
          description: "Autenticación configurada con renovación automática",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error TikTok",
        description: error.message || "Error conectando con TikTok",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectFacebook = async () => {
    if (!facebookConfig.appId.trim() || !facebookConfig.appSecret.trim()) {
      toast({
        title: "❌ Datos Incompletos",
        description: "Por favor ingresa App ID y App Secret",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const authUrl = await socialAuthCoordinator.initializePlatform({
        platform: 'facebook',
        config: facebookConfig
      }) as string;

      // Abrir ventana de autorización
      window.open(authUrl, 'facebook-auth', 'width=600,height=600');
      
      toast({
        title: "🔗 Facebook",
        description: "Ventana de autorización abierta. Completa el proceso de autenticación.",
      });
    } catch (error) {
      toast({
        title: "❌ Error Facebook",
        description: error.message || "Error iniciando autenticación",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    if (!linkedinConfig.clientId.trim() || !linkedinConfig.clientSecret.trim()) {
      toast({
        title: "❌ Datos Incompletos",
        description: "Por favor ingresa Client ID y Client Secret",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const authUrl = await socialAuthCoordinator.initializePlatform({
        platform: 'linkedin',
        config: linkedinConfig
      }) as string;

      // Abrir ventana de autorización
      window.open(authUrl, 'linkedin-auth', 'width=600,height=600');
      
      toast({
        title: "🔗 LinkedIn",
        description: "Ventana de autorización abierta. Completa el proceso de autenticación.",
      });
    } catch (error) {
      toast({
        title: "❌ Error LinkedIn",
        description: error.message || "Error iniciando autenticación",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (platform: string) => {
    try {
      await socialAuthCoordinator.disconnectPlatform(platform);
      updatePlatformStatuses();
      
      toast({
        title: `🛑 ${platform} Desconectado`,
        description: "Plataforma desconectada exitosamente",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: error.message || "Error desconectando plataforma",
        variant: "destructive"
      });
    }
  };

  const handleRefreshAll = async () => {
    setIsLoading(true);
    
    try {
      await socialAuthCoordinator.refreshAllTokens();
      updatePlatformStatuses();
      
      toast({
        title: "🔄 Tokens Renovados",
        description: "Todos los tokens han sido renovados",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Error renovando algunos tokens",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformStatus = (platform: string) => {
    return platformStatuses.find(p => p.platform === platform);
  };

  const formatTimeRemaining = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expirado';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Panel de Estado General */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Estado de Plataformas Sociales
            </span>
            <Button
              onClick={handleRefreshAll}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Renovar Todo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {['tiktok', 'facebook', 'linkedin'].map(platform => {
              const status = getPlatformStatus(platform);
              const isConnected = status?.hasValidToken || false;
              
              return (
                <div key={platform} className="flex items-center gap-2">
                  {platform === 'tiktok' && <Music className="w-4 h-4" />}
                  {platform === 'facebook' && <Users className="w-4 h-4" />}
                  {platform === 'linkedin' && <Briefcase className="w-4 h-4" />}
                  
                  <div>
                    <div className="font-medium capitalize">{platform}</div>
                    <Badge className={isConnected ? 'bg-green-500' : 'bg-gray-500'}>
                      {isConnected ? 'CONECTADO' : 'DESCONECTADO'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuración por Plataforma */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Plataformas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="tiktok">
                <Music className="w-4 h-4 mr-2" />
                TikTok
              </TabsTrigger>
              <TabsTrigger value="facebook">
                <Users className="w-4 h-4 mr-2" />
                Facebook/Instagram
              </TabsTrigger>
              <TabsTrigger value="linkedin">
                <Briefcase className="w-4 h-4 mr-2" />
                LinkedIn
              </TabsTrigger>
            </TabsList>

            {/* TikTok Tab */}
            <TabsContent value="tiktok" className="space-y-4">
              {!getPlatformStatus('tiktok')?.hasValidToken ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="tiktok-key">Client Key</Label>
                    <Input
                      id="tiktok-key"
                      value={tiktokConfig.clientKey}
                      onChange={(e) => setTiktokConfig({...tiktokConfig, clientKey: e.target.value})}
                      placeholder="Tu Client Key de TikTok"
                      className="font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tiktok-secret">Client Secret</Label>
                    <Input
                      id="tiktok-secret"
                      type="password"
                      value={tiktokConfig.clientSecret}
                      onChange={(e) => setTiktokConfig({...tiktokConfig, clientSecret: e.target.value})}
                      placeholder="Tu Client Secret de TikTok"
                      className="font-mono"
                    />
                  </div>

                  <Button 
                    onClick={handleConnectTikTok} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Music className="w-4 h-4 mr-2" />
                    )}
                    Conectar TikTok
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-700">TikTok Conectado</span>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-sm">
                      <strong>Tiempo restante:</strong> {formatTimeRemaining(getPlatformStatus('tiktok')?.lastSync || '')}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleDisconnect('tiktok')} 
                    variant="outline"
                    className="w-full border-red-300 text-red-600"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Desconectar TikTok
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Facebook Tab */}
            <TabsContent value="facebook" className="space-y-4">
              {!getPlatformStatus('facebook')?.hasValidToken ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="fb-appid">App ID</Label>
                    <Input
                      id="fb-appid"
                      value={facebookConfig.appId}
                      onChange={(e) => setFacebookConfig({...facebookConfig, appId: e.target.value})}
                      placeholder="Tu App ID de Facebook"
                      className="font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fb-secret">App Secret</Label>
                    <Input
                      id="fb-secret"
                      type="password"
                      value={facebookConfig.appSecret}
                      onChange={(e) => setFacebookConfig({...facebookConfig, appSecret: e.target.value})}
                      placeholder="Tu App Secret de Facebook"
                      className="font-mono"
                    />
                  </div>

                  <div>
                    <Label>Redirect URI</Label>
                    <Input
                      value={facebookConfig.redirectUri}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>

                  <Button 
                    onClick={handleConnectFacebook} 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Users className="w-4 h-4 mr-2" />
                    )}
                    Conectar Facebook/Instagram
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-700">Facebook/Instagram Conectado</span>
                  </div>

                  <Button 
                    onClick={() => handleDisconnect('facebook')} 
                    variant="outline"
                    className="w-full border-red-300 text-red-600"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Desconectar Facebook
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* LinkedIn Tab */}
            <TabsContent value="linkedin" className="space-y-4">
              {!getPlatformStatus('linkedin')?.hasValidToken ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="li-clientid">Client ID</Label>
                    <Input
                      id="li-clientid"
                      value={linkedinConfig.clientId}
                      onChange={(e) => setLinkedinConfig({...linkedinConfig, clientId: e.target.value})}
                      placeholder="Tu Client ID de LinkedIn"
                      className="font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="li-secret">Client Secret</Label>
                    <Input
                      id="li-secret"
                      type="password"
                      value={linkedinConfig.clientSecret}
                      onChange={(e) => setLinkedinConfig({...linkedinConfig, clientSecret: e.target.value})}
                      placeholder="Tu Client Secret de LinkedIn"
                      className="font-mono"
                    />
                  </div>

                  <div>
                    <Label>Redirect URI</Label>
                    <Input
                      value={linkedinConfig.redirectUri}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>

                  <Button 
                    onClick={handleConnectLinkedIn} 
                    disabled={isLoading}
                    className="w-full bg-blue-700 hover:bg-blue-800"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Briefcase className="w-4 h-4 mr-2" />
                    )}
                    Conectar LinkedIn
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-700">LinkedIn Conectado</span>
                  </div>

                  <Button 
                    onClick={() => handleDisconnect('linkedin')} 
                    variant="outline"
                    className="w-full border-red-300 text-red-600"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Desconectar LinkedIn
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Información y Documentación */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">📋 Información de Configuración</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <div><strong>TikTok:</strong> Requiere Client Credentials del TikTok Developer Portal</div>
          <div><strong>Facebook/Instagram:</strong> Requiere App configurada en Facebook Developers</div>
          <div><strong>LinkedIn:</strong> Requiere App configurada en LinkedIn Developer Portal</div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <strong>Características:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Renovación automática de tokens</li>
              <li>Manejo robusto de errores y reintentos</li>
              <li>Monitoreo en tiempo real del estado</li>
              <li>Cumplimiento con requisitos OAuth 2.0</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedSocialAuthManager;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { tiktokAuth } from '@/services/tiktokAuthService';
import { Music, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const TikTokAuthManager = () => {
  const { toast } = useToast();
  const [clientKey, setClientKey] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [tokenStatus, setTokenStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar estado inicial
    updateTokenStatus();
    
    // Actualizar estado cada 30 segundos
    const interval = setInterval(() => {
      updateTokenStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const updateTokenStatus = () => {
    const status = tiktokAuth.getTokenStatus();
    setTokenStatus(status);
    setIsConnected(status.isValid);
  };

  const handleConnect = async () => {
    if (!clientKey.trim() || !clientSecret.trim()) {
      toast({
        title: "❌ Datos Incompletos",
        description: "Por favor ingresa Client Key y Client Secret",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await tiktokAuth.initialize({
        clientKey: clientKey.trim(),
        clientSecret: clientSecret.trim()
      });

      if (success) {
        updateTokenStatus();
        toast({
          title: "✅ TikTok Conectado",
          description: "Autenticación configurada con renovación automática cada 2 horas",
        });
      } else {
        toast({
          title: "❌ Error de Conexión",
          description: "No se pudo conectar con TikTok API",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error conectando TikTok:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Error conectando con TikTok",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    tiktokAuth.destroy();
    setIsConnected(false);
    setTokenStatus(null);
    toast({
      title: "🛑 TikTok Desconectado",
      description: "Servicio de autenticación detenido",
    });
  };

  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds) return 'N/A';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className={`${isConnected ? 'bg-green-50 border-green-300' : 'bg-gray-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className={`w-5 h-5 ${isConnected ? 'text-green-600' : 'text-gray-600'}`} />
          Autenticación TikTok API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="space-y-3">
              <div>
                <Label htmlFor="clientKey">Client Key</Label>
                <Input
                  id="clientKey"
                  value={clientKey}
                  onChange={(e) => setClientKey(e.target.value)}
                  placeholder="Tu Client Key de TikTok"
                  className="font-mono"
                />
              </div>
              
              <div>
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Tu Client Secret de TikTok"
                  className="font-mono"
                />
              </div>
            </div>

            <Button 
              onClick={handleConnect} 
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Music className="w-4 h-4 mr-2" />
              )}
              Conectar con TikTok
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-green-700">TikTok API Conectado</span>
                <Badge className="bg-green-500">ACTIVO</Badge>
              </div>

              {tokenStatus && (
                <div className="bg-white p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado del Token:</span>
                    <Badge className={tokenStatus.isValid ? 'bg-green-500' : 'bg-red-500'}>
                      {tokenStatus.isValid ? 'VÁLIDO' : 'EXPIRADO'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tiempo restante:</span>
                    <span className="text-sm font-mono">
                      {formatTimeRemaining(tokenStatus.timeUntilExpiry)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-600">
                      Renovación automática cada 2 horas
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={handleDisconnect} 
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Desconectar TikTok
            </Button>
          </>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-semibold text-blue-800 mb-2">📋 Información</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• El token se renueva automáticamente cada 2 horas</li>
            <li>• Si falla la renovación, se reintenta en 5 minutos</li>
            <li>• El sistema funciona de forma completamente autónoma</li>
            <li>• Obtén tus credenciales en TikTok Developer Portal</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TikTokAuthManager;

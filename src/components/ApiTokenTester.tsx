
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader, Zap, AlertTriangle } from 'lucide-react';

const ApiTokenTester = () => {
  const { toast } = useToast();
  const [testToken, setTestToken] = useState('tPvS1vIrViwMOP37');
  const [isTestingAyrshare, setIsTestingAyrshare] = useState(false);
  const [isTestingGeneral, setIsTestingGeneral] = useState(false);
  const [ayrshareResult, setAyrshareResult] = useState(null);
  const [generalResult, setGeneralResult] = useState(null);

  const testAyrshareAPI = async () => {
    setIsTestingAyrshare(true);
    setAyrshareResult(null);

    try {
      console.log('🔍 Probando token con Ayrshare API:', testToken);
      
      const response = await fetch('https://api.ayrshare.com/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setAyrshareResult({
          success: true,
          status: response.status,
          data: data
        });
        
        toast({
          title: "✅ TOKEN VÁLIDO - AYRSHARE",
          description: `Token verificado correctamente con Ayrshare API`,
        });
      } else {
        setAyrshareResult({
          success: false,
          status: response.status,
          error: data.error || 'Error desconocido'
        });
        
        toast({
          title: "❌ TOKEN INVÁLIDO - AYRSHARE",
          description: `Error: ${data.error || 'Token no autorizado'}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Error probando Ayrshare:', error);
      setAyrshareResult({
        success: false,
        error: error.message
      });
      
      toast({
        title: "❌ ERROR DE CONEXIÓN",
        description: "No se pudo conectar con Ayrshare API",
        variant: "destructive"
      });
    } finally {
      setIsTestingAyrshare(false);
    }
  };

  const testGeneralAPI = async () => {
    setIsTestingGeneral(true);
    setGeneralResult(null);

    try {
      console.log('🔍 Probando token como API general:', testToken);
      
      // Intentar diferentes endpoints comunes
      const testEndpoints = [
        'https://api.openai.com/v1/models',
        'https://api.anthropic.com/v1/messages',
        'https://api.perplexity.ai/chat/completions'
      ];

      let foundValidEndpoint = false;

      for (const endpoint of testEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${testToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.status !== 401 && response.status !== 403) {
            const data = await response.json();
            setGeneralResult({
              success: true,
              endpoint: endpoint,
              status: response.status,
              data: data
            });
            foundValidEndpoint = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      if (!foundValidEndpoint) {
        setGeneralResult({
          success: false,
          error: 'Token no válido para endpoints conocidos'
        });
      }

    } catch (error) {
      console.error('❌ Error probando APIs generales:', error);
      setGeneralResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsTestingGeneral(false);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Probador de Token API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input del Token */}
        <div>
          <Label htmlFor="testToken" className="text-base font-semibold">
            Token API a Probar
          </Label>
          <Input
            id="testToken"
            value={testToken}
            onChange={(e) => setTestToken(e.target.value)}
            placeholder="Introduce el token API..."
            className="mt-2 font-mono text-sm"
          />
        </div>

        {/* Botones de Prueba */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            onClick={testAyrshareAPI} 
            disabled={isTestingAyrshare || !testToken}
            className="bg-green-600 hover:bg-green-700"
          >
            {isTestingAyrshare ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Probar con Ayrshare
          </Button>

          <Button 
            onClick={testGeneralAPI} 
            disabled={isTestingGeneral || !testToken}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isTestingGeneral ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2" />
            )}
            Probar APIs Generales
          </Button>
        </div>

        {/* Resultados Ayrshare */}
        {ayrshareResult && (
          <div className="border rounded-lg p-3 bg-white">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              {ayrshareResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              Resultado Ayrshare API
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Estado:</span>
                <Badge className={ayrshareResult.success ? 'bg-green-500' : 'bg-red-500'}>
                  {ayrshareResult.success ? 'VÁLIDO' : 'INVÁLIDO'}
                </Badge>
                {ayrshareResult.status && (
                  <Badge variant="outline">
                    HTTP {ayrshareResult.status}
                  </Badge>
                )}
              </div>
              
              {ayrshareResult.error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  <strong>Error:</strong> {ayrshareResult.error}
                </div>
              )}
              
              {ayrshareResult.data && (
                <div className="text-sm bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                  <strong>Respuesta:</strong>
                  <pre className="text-xs mt-1">
                    {JSON.stringify(ayrshareResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resultados API General */}
        {generalResult && (
          <div className="border rounded-lg p-3 bg-white">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              {generalResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              Resultado APIs Generales
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Estado:</span>
                <Badge className={generalResult.success ? 'bg-green-500' : 'bg-red-500'}>
                  {generalResult.success ? 'ENCONTRADO' : 'NO VÁLIDO'}
                </Badge>
              </div>
              
              {generalResult.endpoint && (
                <div className="text-sm">
                  <strong>Endpoint válido:</strong> {generalResult.endpoint}
                </div>
              )}
              
              {generalResult.error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  <strong>Error:</strong> {generalResult.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información del Token */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="font-semibold text-yellow-800 mb-2">📋 Información del Token</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <div><strong>Token:</strong> <code className="bg-white px-1 rounded">{testToken}</code></div>
            <div><strong>Longitud:</strong> {testToken.length} caracteres</div>
            <div><strong>Formato:</strong> {testToken.match(/^[A-Za-z0-9]+$/) ? 'Alfanumérico' : 'Contiene caracteres especiales'}</div>
          </div>
        </div>

        {/* Consejo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            <strong>💡 Consejo:</strong> Si el token es válido para Ayrshare, se integrará automáticamente 
            con el sistema de publicación existente. Si es para otra API, necesitaremos configurar 
            la integración específica.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTokenTester;

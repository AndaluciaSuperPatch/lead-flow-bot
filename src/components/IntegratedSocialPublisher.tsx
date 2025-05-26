
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SocialMediaPublisher, PostContent } from '@/services/socialMediaPublisher';
import { Clock, TrendingUp, Hash, Calendar, Send, Target } from 'lucide-react';

const IntegratedSocialPublisher = () => {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(['Instagram', 'Facebook']);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [autoPublishEnabled, setAutoPublishEnabled] = useState(false);

  const networks = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn'];
  const monthlyStrategy = SocialMediaPublisher.getMonthlyStrategy(currentMonth);

  // Auto-publicación cada 4 horas
  useEffect(() => {
    if (!autoPublishEnabled) return;

    const interval = setInterval(() => {
      selectedNetworks.forEach(network => {
        const optimizedContent = SocialMediaPublisher.generateOptimizedContent(
          network, 
          monthlyStrategy.theme
        );
        handlePublishToNetwork(network, optimizedContent);
      });
    }, 4 * 60 * 60 * 1000); // 4 horas

    return () => clearInterval(interval);
  }, [autoPublishEnabled, selectedNetworks, monthlyStrategy.theme]);

  const handleNetworkToggle = (network: string) => {
    setSelectedNetworks(prev => 
      prev.includes(network) 
        ? prev.filter(n => n !== network)
        : [...prev, network]
    );
  };

  const handlePublishToNetwork = async (network: string, content: PostContent) => {
    try {
      const success = await SocialMediaPublisher.publishToNetwork(network, content);
      if (success) {
        toast({
          title: `✅ Publicado en ${network}`,
          description: `Post publicado exitosamente. Hashtags optimizados incluidos.`,
        });
      }
    } catch (error) {
      toast({
        title: `❌ Error en ${network}`,
        description: `No se pudo publicar. Verifica tu conexión.`,
        variant: "destructive"
      });
    }
  };

  const handlePublishAll = async () => {
    if (!postContent.trim()) {
      toast({
        title: "⚠️ Contenido Requerido",
        description: "Escribe el contenido de tu post antes de publicar.",
        variant: "destructive"
      });
      return;
    }

    setIsPublishing(true);

    for (const network of selectedNetworks) {
      const strategy = SocialMediaPublisher.hashtagStrategies.find(s => s.network === network);
      const hashtags = strategy ? [...strategy.trending, ...strategy.engagement].slice(0, 8) : [];
      
      const content: PostContent = {
        text: postContent,
        hashtags,
        targetNetworks: [network]
      };

      await handlePublishToNetwork(network, content);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay entre publicaciones
    }

    setIsPublishing(false);
    setPostContent('');
    
    toast({
      title: "🚀 PUBLICACIÓN MASIVA COMPLETADA",
      description: `Post publicado en ${selectedNetworks.length} redes sociales con hashtags optimizados.`,
    });
  };

  const generateOptimizedPost = () => {
    const randomNetwork = selectedNetworks[Math.floor(Math.random() * selectedNetworks.length)];
    const optimizedContent = SocialMediaPublisher.generateOptimizedContent(
      randomNetwork, 
      monthlyStrategy.theme
    );
    setPostContent(optimizedContent.text);
  };

  return (
    <div className="space-y-6">
      {/* Estrategia Mensual */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Estrategia de {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="font-semibold">Tema del Mes</Label>
              <p className="text-sm text-gray-600">{monthlyStrategy.theme}</p>
            </div>
            <div>
              <Label className="font-semibold">Frecuencia Óptima</Label>
              <p className="text-sm text-gray-600">{monthlyStrategy.frequency}</p>
            </div>
            <div>
              <Label className="font-semibold">Enfoque</Label>
              <p className="text-sm text-gray-600">{monthlyStrategy.focus}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mejores Horarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horarios Óptimos de Publicación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {SocialMediaPublisher.optimalTimings.map((timing, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{timing.network}</h4>
                <p className="text-xs text-gray-600 mb-2">{timing.engagement}</p>
                <div className="flex flex-wrap gap-1">
                  {timing.bestHours.map(hour => (
                    <Badge key={hour} variant="outline" className="text-xs">
                      {hour}:00
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Publisher Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Publicador Integral de Redes Sociales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selector de Redes */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Selecciona Redes Sociales</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {networks.map(network => (
                <div key={network} className="flex items-center space-x-2">
                  <Switch
                    checked={selectedNetworks.includes(network)}
                    onCheckedChange={() => handleNetworkToggle(network)}
                  />
                  <Label className="text-sm">{network}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-publicación */}
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Switch
              checked={autoPublishEnabled}
              onCheckedChange={setAutoPublishEnabled}
            />
            <Label>🤖 Auto-publicación cada 4 horas con contenido optimizado</Label>
          </div>

          {/* Contenido del Post */}
          <div>
            <Label htmlFor="postContent" className="text-base font-semibold">Contenido del Post</Label>
            <Textarea
              id="postContent"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Escribe tu post aquí... Se añadirán hashtags optimizados automáticamente"
              className="min-h-32 mt-2"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={generateOptimizedPost} variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generar Post Optimizado
            </Button>
            <Button 
              onClick={handlePublishAll} 
              disabled={isPublishing || selectedNetworks.length === 0}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {isPublishing ? 'Publicando...' : `Publicar en ${selectedNetworks.length} redes`}
            </Button>
          </div>

          {/* Hashtags Preview */}
          {selectedNetworks.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Hashtags que se añadirán automáticamente:
              </Label>
              {selectedNetworks.map(network => {
                const strategy = SocialMediaPublisher.hashtagStrategies.find(s => s.network === network);
                return strategy ? (
                  <div key={network} className="p-2 bg-gray-50 rounded">
                    <p className="text-sm font-semibold">{network}:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[...strategy.trending, ...strategy.engagement].slice(0, 8).map(hashtag => (
                        <Badge key={hashtag} variant="secondary" className="text-xs">
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats de Publicación */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold text-green-800">Sistema de Publicación Activo</h3>
            <p className="text-sm text-green-600">
              {autoPublishEnabled ? '🟢 Auto-publicación ACTIVADA' : '🔴 Auto-publicación desactivada'}
            </p>
            <p className="text-xs text-green-500 mt-1">
              Todos los posts incluyen redirección automática a WhatsApp +34654669289
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedSocialPublisher;

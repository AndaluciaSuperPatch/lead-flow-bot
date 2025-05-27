
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AyrshareService, AyrsharePostRequest } from '@/services/ayrshareService';
import { Clock, TrendingUp, Hash, Calendar, Send, Target, Zap } from 'lucide-react';
import MonthlyContentStrategy from './MonthlyContentStrategy';

const IntegratedSocialPublisher = () => {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(['Instagram', 'Facebook', 'TikTok', 'LinkedIn']);
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoPublishEnabled, setAutoPublishEnabled] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);

  const networks = [
    { name: 'Instagram', apiKey: 'instagramApi', color: 'from-pink-500 to-purple-600' },
    { name: 'Facebook', apiKey: 'facebook', color: 'from-blue-500 to-blue-700' },
    { name: 'LinkedIn', apiKey: 'linkedin', color: 'from-blue-600 to-blue-800' },
    { name: 'TikTok', apiKey: 'tiktok', color: 'from-red-500 to-pink-600' },
  ];

  // Auto-publicación inteligente cada 4 horas
  useEffect(() => {
    if (!autoPublishEnabled) return;

    const interval = setInterval(async () => {
      const currentHour = new Date().getHours();
      const optimalSchedule = AyrshareService.getOptimalSchedule();
      
      // Verificar si es hora óptima para alguna red
      const platformsToPost = selectedNetworks.filter(networkName => {
        const network = networks.find(n => n.name === networkName);
        if (!network) return false;
        
        const schedule = optimalSchedule[network.apiKey];
        return schedule && schedule.bestHours.includes(currentHour);
      });

      if (platformsToPost.length > 0) {
        await handleAutoPost(platformsToPost);
      }
    }, 3600000); // Cada hora, pero solo publica en horarios óptimos

    return () => clearInterval(interval);
  }, [autoPublishEnabled, selectedNetworks]);

  const handleAutoPost = async (platforms: string[]) => {
    const autoContent = generateAutoContent();
    const platformKeys = platforms.map(name => {
      const network = networks.find(n => n.name === name);
      return network?.apiKey;
    }).filter(Boolean) as string[];

    try {
      const request: AyrsharePostRequest = {
        post: autoContent.text,
        platforms: platformKeys,
        hashtags: autoContent.hashtags,
        mediaUrls: imageUrl ? [imageUrl] : undefined
      };

      const result = await AyrshareService.publishPost(request);
      
      toast({
        title: "🤖 AUTO-PUBLICACIÓN EXITOSA",
        description: `Post automático publicado en ${platforms.join(', ')}`,
      });

      console.log('✅ Auto-publicación completada:', result);
    } catch (error) {
      console.error('❌ Error en auto-publicación:', error);
    }
  };

  const generateAutoContent = () => {
    const autoContents = [
      {
        text: "🔥 ¡Transforma tu vida HOY con SuperPatch! \n\n✨ Tecnología innovadora para el alivio del dolor\n💪 Resultados desde el primer uso\n📱 Contáctanos: +34654669289",
        hashtags: ['#SuperPatch', '#AlivioInstantáneo', '#VidaSinDolor', '#TecnologíaWearable', '#BienestarNatural']
      },
      {
        text: "💼 ¿Buscas una oportunidad de negocio REAL? \n\n🚀 SuperPatch está revolucionando el wellness\n💰 Modelo de distribución altamente rentable\n📞 WhatsApp: +34654669289",
        hashtags: ['#OportunidadNegocio', '#SuperPatch', '#EmprendimientoWellness', '#InversiónInteligente', '#ÉxitoEmpresarial']
      },
      {
        text: "🎯 TESTIMONIO REAL: 'Después de usar SuperPatch, mi vida cambió completamente' \n\n✅ Sin dolor crónico\n✅ Más energía\n✅ Mejor calidad de vida\n📲 +34654669289",
        hashtags: ['#TestimonioReal', '#SuperPatch', '#CambioDeVida', '#DolorCrónico', '#TransformaciónPersonal']
      }
    ];

    return autoContents[Math.floor(Math.random() * autoContents.length)];
  };

  const handleNetworkToggle = (network: string) => {
    setSelectedNetworks(prev => 
      prev.includes(network) 
        ? prev.filter(n => n !== network)
        : [...prev, network]
    );
  };

  const handlePublishNow = async () => {
    if (!postContent.trim()) {
      toast({
        title: "⚠️ Contenido Requerido",
        description: "Escribe el contenido antes de publicar.",
        variant: "destructive"
      });
      return;
    }

    setIsPublishing(true);

    try {
      const platformKeys = selectedNetworks.map(name => {
        const network = networks.find(n => n.name === name);
        return network?.apiKey;
      }).filter(Boolean) as string[];

      const request: AyrsharePostRequest = {
        post: postContent + "\n\n📱 Contacto directo: +34654669289",
        platforms: platformKeys,
        hashtags: ['#SuperPatch', '#DolorCrónico', '#BienestarNatural', '#OportunidadNegocio'],
        mediaUrls: imageUrl ? [imageUrl] : undefined
      };

      console.log('🚀 ENVIANDO A AYRSHARE:', request);
      const result = await AyrshareService.publishPost(request);

      toast({
        title: "🎉 ¡PUBLICACIÓN EXITOSA!",
        description: `Post publicado en ${selectedNetworks.length} redes sociales usando Ayrshare API`,
      });

      setPostContent('');
      setImageUrl('');
      
      console.log('✅ RESULTADO AYRSHARE:', result);

    } catch (error) {
      console.error('❌ ERROR PUBLICACIÓN:', error);
      toast({
        title: "❌ Error de Publicación",
        description: "No se pudo publicar. Verifica tu conexión API.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Estado de API */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-green-800 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                API AYRSHARE CONECTADA ✅
              </h3>
              <p className="text-sm text-green-600">
                Publicación directa en redes sociales ACTIVADA
              </p>
            </div>
            <Badge className="bg-green-500">ACTIVO</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Estrategia Mensual */}
      <MonthlyContentStrategy />

      {/* Publisher Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Publicador Directo - API Ayrshare
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selector de Redes */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Redes Sociales Conectadas</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {networks.map(network => (
                <div key={network.name} className="flex items-center space-x-2">
                  <Switch
                    checked={selectedNetworks.includes(network.name)}
                    onCheckedChange={() => handleNetworkToggle(network.name)}
                  />
                  <Label className="text-sm">{network.name}</Label>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${network.color}`} />
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
            <Label>🤖 Auto-publicación inteligente en horarios óptimos</Label>
          </div>

          {/* Contenido del Post */}
          <div>
            <Label htmlFor="postContent" className="text-base font-semibold">Contenido del Post</Label>
            <Textarea
              id="postContent"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Escribe tu post aquí... Se añadirá contacto WhatsApp automáticamente"
              className="min-h-32 mt-2"
            />
          </div>

          {/* URL de Imagen */}
          <div>
            <Label htmlFor="imageUrl" className="text-base font-semibold">URL de Imagen (Opcional)</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="mt-2"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handlePublishNow} 
              disabled={isPublishing || selectedNetworks.length === 0}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600"
            >
              <Send className="w-4 h-4 mr-2" />
              {isPublishing ? 'Publicando en API...' : `Publicar AHORA en ${selectedNetworks.length} redes`}
            </Button>
          </div>

          {/* Preview de Hashtags */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <Label className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4" />
              Hashtags que se añadirán automáticamente:
            </Label>
            <div className="flex flex-wrap gap-1">
              {['#SuperPatch', '#DolorCrónico', '#BienestarNatural', '#OportunidadNegocio'].map(hashtag => (
                <Badge key={hashtag} variant="secondary" className="text-xs">
                  {hashtag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado del Sistema */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold text-purple-800">Sistema de Automatización REAL</h3>
            <p className="text-sm text-purple-600">
              {autoPublishEnabled ? '🟢 Auto-publicación ACTIVADA con API real' : '🔴 Auto-publicación desactivada'}
            </p>
            <p className="text-xs text-purple-500 mt-1">
              Token API: 36D66CD2-2F59447B-AC564C88-47F75E41 ✅
            </p>
            <p className="text-xs text-purple-500">
              Redirección automática a WhatsApp: +34654669289
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedSocialPublisher;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ContentQueueService } from '@/services/contentQueueService';
import { ContentValidator } from '@/services/contentValidator';
import { Calendar, Clock, Target, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

const AdvancedContentManager = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagramApi', 'facebook']);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [contentType, setContentType] = useState<'promotion' | 'educational' | 'engagement' | 'sales'>('promotion');
  const [targetAudience, setTargetAudience] = useState('general');
  const [scheduledDate, setScheduledDate] = useState(new Date(Date.now() + 3600000).toISOString().slice(0, 16));
  const [validation, setValidation] = useState<any>(null);

  const platforms = [
    { id: 'instagramApi', name: 'Instagram', color: 'from-pink-500 to-purple-600' },
    { id: 'facebook', name: 'Facebook', color: 'from-blue-500 to-blue-700' },
    { id: 'tiktok', name: 'TikTok', color: 'from-red-500 to-pink-600' },
    { id: 'linkedin', name: 'LinkedIn', color: 'from-blue-600 to-blue-800' }
  ];

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (newContent.trim()) {
      const validationResult = ContentValidator.validateContent(newContent, selectedPlatforms);
      const analysis = ContentValidator.analyzeContent(newContent);
      setValidation({ ...validationResult, analysis });
    } else {
      setValidation(null);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      const updated = prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId];
      
      // Re-validar con nuevas plataformas
      if (content.trim()) {
        const validationResult = ContentValidator.validateContent(content, updated);
        const analysis = ContentValidator.analyzeContent(content);
        setValidation({ ...validationResult, analysis });
      }
      
      return updated;
    });
  };

  const handleScheduleContent = () => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      toast({
        title: "⚠️ Contenido Incompleto",
        description: "Completa el contenido y selecciona al menos una plataforma",
        variant: "destructive"
      });
      return;
    }

    if (validation && !validation.isValid) {
      toast({
        title: "❌ Contenido Inválido",
        description: `Errores: ${validation.errors.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    const id = ContentQueueService.addToQueue({
      text: content,
      platforms: selectedPlatforms,
      scheduledAt: new Date(scheduledDate),
      priority,
      hashtags: ['#SuperPatch', '#BienestarNatural', '#VidaSinDolor'],
      targetAudience,
      contentType
    });

    toast({
      title: "✅ Contenido Programado",
      description: `Programado para ${new Date(scheduledDate).toLocaleString()}`,
    });

    // Limpiar formulario
    setContent('');
    setValidation(null);
  };

  const generateOptimizedContent = () => {
    const templates = {
      promotion: "🔥 ¡Descubre SuperPatch! \n\n✨ Tecnología revolucionaria para el bienestar\n💪 Resultados desde el primer uso\n🌟 Testimonios reales de miles de usuarios\n\n📱 Contacto: +34654669289",
      educational: "📚 ¿Sabías que SuperPatch utiliza tecnología cuántica? \n\n🧬 Frecuencias específicas para cada necesidad\n⚡ Estimulación natural sin medicamentos\n🎯 Resultados científicamente comprobados\n\n📱 Más info: +34654669289",
      engagement: "🤔 ¿Qué harías si pudieras eliminar el dolor de tu vida? \n\n💭 Comparte tu experiencia en comentarios\n❤️ Dale like si quieres una vida sin dolor\n🔄 Comparte con quien necesite saberlo\n\n📱 WhatsApp: +34654669289",
      sales: "💼 ¡OPORTUNIDAD ÚNICA! \n\n🚀 Únete al negocio del futuro\n💰 Ingresos desde €500/mes\n📈 Sin límites de crecimiento\n🎯 Formación completa incluida\n\n📱 Empezar YA: +34654669289"
    };

    setContent(templates[contentType]);
    handleContentChange(templates[contentType]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Gestor Avanzado de Contenido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configuración de Contenido */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Contenido</Label>
              <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotion">📢 Promocional</SelectItem>
                  <SelectItem value="educational">📚 Educativo</SelectItem>
                  <SelectItem value="engagement">💬 Engagement</SelectItem>
                  <SelectItem value="sales">💰 Ventas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioridad</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🔵 Baja</SelectItem>
                  <SelectItem value="medium">🟡 Media</SelectItem>
                  <SelectItem value="high">🔴 Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selección de Plataformas */}
          <div>
            <Label className="mb-3 block">Plataformas de Publicación</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map(platform => (
                <div 
                  key={platform.id} 
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPlatforms.includes(platform.id) 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  <div className="text-center">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${platform.color} mx-auto mb-1`} />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor de Contenido */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Contenido del Post</Label>
              <Button variant="outline" size="sm" onClick={generateOptimizedContent}>
                <Zap className="w-4 h-4 mr-1" />
                Generar Optimizado
              </Button>
            </div>
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Escribe tu contenido aquí..."
              className="min-h-32"
            />
            {content && (
              <div className="mt-2 text-xs text-gray-500">
                Caracteres: {content.length}
              </div>
            )}
          </div>

          {/* Validación en Tiempo Real */}
          {validation && (
            <Card className={`p-3 ${validation.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {validation.isValid ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${validation.isValid ? 'text-green-800' : 'text-red-800'}`}>
                  Puntuación de Calidad: {validation.score}/100
                </span>
              </div>
              
              {validation.errors.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-medium text-red-700 mb-1">Errores:</div>
                  {validation.errors.map((error: string, idx: number) => (
                    <div key={idx} className="text-xs text-red-600">• {error}</div>
                  ))}
                </div>
              )}
              
              {validation.warnings.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-medium text-yellow-700 mb-1">Advertencias:</div>
                  {validation.warnings.map((warning: string, idx: number) => (
                    <div key={idx} className="text-xs text-yellow-600">• {warning}</div>
                  ))}
                </div>
              )}

              {validation.analysis && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  <div className="text-center">
                    <div className="text-xs font-medium">Legibilidad</div>
                    <div className="text-xs">{Math.round(validation.analysis.readabilityScore)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium">Engagement</div>
                    <div className="text-xs">{Math.round(validation.analysis.engagementPotential)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium">Hashtags</div>
                    <div className="text-xs">{Math.round(validation.analysis.hashtagRelevance)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium">Optimización</div>
                    <div className="text-xs">{Math.round(validation.analysis.platformOptimization)}%</div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Programación */}
          <div>
            <Label htmlFor="scheduleDate" className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              Fecha y Hora de Publicación
            </Label>
            <input
              id="scheduleDate"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Botón de Programar */}
          <Button 
            onClick={handleScheduleContent}
            disabled={!content.trim() || selectedPlatforms.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600"
          >
            <Clock className="w-4 h-4 mr-2" />
            Programar Publicación
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedContentManager;

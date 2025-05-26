
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, TrendingUp, Hash } from 'lucide-react';

const MonthlyContentPlanner = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const contentCalendar = {
    1: { // Enero
      posts: [
        { time: '08:00', content: 'Buenos días! Nuevo año, nueva vida sin dolor 💪 #AñoNuevo #SuperPatch', networks: ['Instagram', 'Facebook'] },
        { time: '19:00', content: 'Después de las fiestas, tu cuerpo necesita recuperarse 🎉➡️😌', networks: ['Instagram', 'TikTok'] },
        { time: '12:00', content: 'Resoluciones 2024: Vivir sin dolor crónico ✅', networks: ['Facebook', 'LinkedIn'] }
      ]
    },
    2: { // Febrero
      posts: [
        { time: '08:00', content: 'San Valentín: Ámate y cuídate primero ❤️ #SanValentin #Autocuidado', networks: ['Instagram', 'Facebook'] },
        { time: '20:00', content: 'El mejor regalo que puedes darte: una vida sin dolor', networks: ['Instagram', 'TikTok'] },
        { time: '14:00', content: 'Febrero del amor propio y el bienestar integral', networks: ['Facebook', 'LinkedIn'] }
      ]
    },
    3: { // Marzo
      posts: [
        { time: '08:00', content: 'Primavera = Renovación 🌸 Renueva tu vida sin dolor', networks: ['Instagram', 'Facebook'] },
        { time: '19:00', content: 'Energía primaveral con SuperPatch 🌱💚', networks: ['Instagram', 'TikTok'] },
        { time: '12:00', content: 'Marzo: mes perfecto para empezar tu transformación', networks: ['Facebook', 'LinkedIn'] }
      ]
    }
    // ... más meses
  };

  const optimalHashtags = {
    trending: ['#SuperPatch', '#DolorCronico', '#VidaSinDolor', '#Bienestar', '#Salud'],
    seasonal: ['#Primavera2024', '#VeranoSaludable', '#OtoñoActivo', '#InviernoSano'],
    engagement: ['#Testimonio', '#AntesYDespues', '#CambioDeVida', '#TransformacionReal']
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Planificador de Contenido Mensual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Selector de Mes */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {Array.from({length: 12}, (_, i) => i + 1).map(month => (
              <Button
                key={month}
                variant={selectedMonth === month ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMonth(month)}
              >
                {new Date(2024, month - 1).toLocaleDateString('es-ES', { month: 'short' })}
              </Button>
            ))}
          </div>

          {/* Posts del Mes Seleccionado */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Posts Optimizados - {new Date(2024, selectedMonth - 1).toLocaleDateString('es-ES', { month: 'long' })}
            </h3>
            
            {contentCalendar[selectedMonth as keyof typeof contentCalendar]?.posts.map((post, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <Badge variant="outline">{post.time}</Badge>
                    </div>
                    <div className="flex gap-1">
                      {post.networks.map(network => (
                        <Badge key={network} variant="secondary" className="text-xs">
                          {network}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mb-2">{post.content}</p>
                  <p className="text-xs text-gray-500">
                    + Hashtags automáticos + Redirección a WhatsApp +34654669289
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hashtags Estratégicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Banco de Hashtags Estratégicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Trending Permanentes</h4>
              <div className="flex flex-wrap gap-2">
                {optimalHashtags.trending.map(tag => (
                  <Badge key={tag} className="bg-green-100 text-green-800 hover:bg-green-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Estacionales</h4>
              <div className="flex flex-wrap gap-2">
                {optimalHashtags.seasonal.map(tag => (
                  <Badge key={tag} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Alto Engagement</h4>
              <div className="flex flex-wrap gap-2">
                {optimalHashtags.engagement.map(tag => (
                  <Badge key={tag} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Engagement */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Proyección de Engagement Mensual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">2,500+</p>
              <p className="text-sm text-gray-600">Impresiones proyectadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">180+</p>
              <p className="text-sm text-gray-600">Interacciones esperadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">25+</p>
              <p className="text-sm text-gray-600">Leads cualificados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">8-12%</p>
              <p className="text-sm text-gray-600">Engagement rate óptimo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyContentPlanner;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Hash, Clock, Target } from 'lucide-react';

const MonthlyContentStrategy = () => {
  const [currentMonth] = useState(new Date().getMonth() + 1);
  
  const monthlyStrategies = {
    1: { // Enero
      theme: 'Nuevos Propósitos de Salud',
      frequency: '3 posts/día',
      focus: 'Resoluciones año nuevo, dolor post-fiestas',
      hashtags: ['#PropósitosSaludables', '#AñoNuevo2024', '#SuperPatch', '#VidaSinDolor'],
      bestTimes: ['8:00', '14:00', '20:00']
    },
    2: { // Febrero
      theme: 'Amor Propio y Autocuidado',
      frequency: '3 posts/día',
      focus: 'San Valentín enfocado en amarse y cuidarse',
      hashtags: ['#AmorPropio', '#Autocuidado', '#SuperPatch', '#BienestarPersonal'],
      bestTimes: ['9:00', '15:00', '21:00']
    },
    3: { // Marzo
      theme: 'Primavera y Renovación',
      frequency: '4 posts/día',
      focus: 'Energía renovada, actividad física',
      hashtags: ['#PrimaveraActiva', '#RenovaciónPersonal', '#SuperPatch', '#EnergíaNatural'],
      bestTimes: ['7:00', '12:00', '17:00', '22:00']
    },
    4: { // Abril
      theme: 'Actividad y Movimiento',
      frequency: '4 posts/día',
      focus: 'Deporte, ejercicio, vida activa',
      hashtags: ['#VidaActiva', '#DeporteYSalud', '#SuperPatch', '#MovimientoLibre'],
      bestTimes: ['6:00', '11:00', '16:00', '21:00']
    },
    5: { // Mayo
      theme: 'Bienestar Integral',
      frequency: '4 posts/día',
      focus: 'Mes de la madre, cuidado familiar',
      hashtags: ['#BienestarFamiliar', '#MesDeLaMadre', '#SuperPatch', '#CuidadoIntegral'],
      bestTimes: ['8:00', '13:00', '18:00', '22:00']
    },
    6: { // Junio
      theme: 'Verano Activo',
      frequency: '5 posts/día',
      focus: 'Preparación vacaciones, actividades',
      hashtags: ['#VeranoActivo', '#VacacionesSinDolor', '#SuperPatch', '#LibertadTotal'],
      bestTimes: ['7:00', '11:00', '15:00', '19:00', '23:00']
    },
    7: { // Julio
      theme: 'Vacaciones Sin Dolor',
      frequency: '5 posts/día',
      focus: 'Viajes, actividades veraniegas',
      hashtags: ['#VacacionesPerfectas', '#VeranoSinLímites', '#SuperPatch', '#ViajeSinDolor'],
      bestTimes: ['6:00', '10:00', '14:00', '18:00', '22:00']
    },
    8: { // Agosto
      theme: 'Máximo Rendimiento',
      frequency: '5 posts/día',
      focus: 'Pico de actividad, deportes verano',
      hashtags: ['#MáximoRendimiento', '#DeporteExtremo', '#SuperPatch', '#SinLímites'],
      bestTimes: ['6:00', '10:00', '14:00', '18:00', '22:00']
    },
    9: { // Septiembre
      theme: 'Vuelta a la Rutina',
      frequency: '4 posts/día',
      focus: 'Regreso trabajo, nuevos hábitos',
      hashtags: ['#VueltaAlTrabajo', '#RutinasSaludables', '#SuperPatch', '#ProductividadSana'],
      bestTimes: ['7:00', '12:00', '17:00', '21:00']
    },
    10: { // Octubre
      theme: 'Constancia y Resultados',
      frequency: '4 posts/día',
      focus: 'Testimonios, casos de éxito',
      hashtags: ['#ResultadosReales', '#TestimoniosSuperpatch', '#SuperPatch', '#TransformaciónTotal'],
      bestTimes: ['8:00', '13:00', '18:00', '21:00']
    },
    11: { // Noviembre
      theme: 'Preparación Invierno',
      frequency: '3 posts/día',
      focus: 'Cuidado clima frío, articulaciones',
      hashtags: ['#CuidadoInvierno', '#ArticulacionesSanas', '#SuperPatch', '#ProtecciónTotal'],
      bestTimes: ['9:00', '14:00', '20:00']
    },
    12: { // Diciembre
      theme: 'Regalo de Salud',
      frequency: '4 posts/día',
      focus: 'Regalos navideños, ofertas especiales',
      hashtags: ['#RegaloNavideño', '#SaludParaTodos', '#SuperPatch', '#OfertaEspecial'],
      bestTimes: ['8:00', '13:00', '18:00', '22:00']
    }
  };

  const currentStrategy = monthlyStrategies[currentMonth as keyof typeof monthlyStrategies];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="space-y-6">
      {/* Estrategia Actual */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Estrategia de {monthNames[currentMonth - 1]} 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">{currentStrategy.theme}</h4>
                <p className="text-sm text-gray-600">{currentStrategy.focus}</p>
              </div>
              <div>
                <Badge variant="outline" className="mr-2">
                  <Target className="w-3 h-3 mr-1" />
                  {currentStrategy.frequency}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold mb-2 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Horarios Óptimos
                </h5>
                <div className="flex gap-1 flex-wrap">
                  {currentStrategy.bestTimes.map(time => (
                    <Badge key={time} variant="secondary">{time}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-semibold mb-2 flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  Hashtags Principales
                </h5>
                <div className="flex gap-1 flex-wrap">
                  {currentStrategy.hashtags.map(hashtag => (
                    <Badge key={hashtag} className="text-xs">{hashtag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planificación Anual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Planificación Anual de Contenido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(monthlyStrategies).map(([month, strategy]) => (
              <div 
                key={month} 
                className={`p-3 rounded-lg border ${
                  parseInt(month) === currentMonth 
                    ? 'bg-blue-50 border-blue-300' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <h4 className="font-semibold text-sm">
                  {monthNames[parseInt(month) - 1]}
                </h4>
                <p className="text-xs text-gray-600 mb-2">{strategy.theme}</p>
                <Badge variant="outline" className="text-xs">
                  {strategy.frequency}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mejores Horarios por Red Social */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Horarios Óptimos por Red Social</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                <h4 className="font-semibold">Instagram</h4>
                <p className="text-sm text-gray-600">Máximo engagement: 19:00-21:00 y 8:00-9:00</p>
                <div className="flex gap-1 mt-1">
                  {[8, 12, 17, 19, 21].map(hour => (
                    <Badge key={hour} variant="outline" className="text-xs">{hour}:00</Badge>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <h4 className="font-semibold">Facebook</h4>
                <p className="text-sm text-gray-600">Máximo engagement: 13:00-15:00 y 20:00-21:00</p>
                <div className="flex gap-1 mt-1">
                  {[9, 13, 15, 18, 20].map(hour => (
                    <Badge key={hour} variant="outline" className="text-xs">{hour}:00</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                <h4 className="font-semibold">TikTok</h4>
                <p className="text-sm text-gray-600">Máximo engagement: 19:00-22:00 y 6:00-10:00</p>
                <div className="flex gap-1 mt-1">
                  {[6, 10, 14, 19, 22].map(hour => (
                    <Badge key={hour} variant="outline" className="text-xs">{hour}:00</Badge>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <h4 className="font-semibold">LinkedIn</h4>
                <p className="text-sm text-gray-600">Máximo engagement: 8:00-10:00 y 17:00-18:00</p>
                <div className="flex gap-1 mt-1">
                  {[8, 10, 12, 14, 17].map(hour => (
                    <Badge key={hour} variant="outline" className="text-xs">{hour}:00</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyContentStrategy;

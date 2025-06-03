
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { autoImprovementSystem } from '@/services/autoImprovementSystem';
import { Brain, TrendingUp, Zap, AlertTriangle, CheckCircle, Target } from 'lucide-react';

const AutoImprovementDashboard = () => {
  const [systemHealth, setSystemHealth] = useState<any>({});
  const [learningInsights, setLearningInsights] = useState<any>({});
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Actualizar datos cada 10 segundos
    const interval = setInterval(() => {
      setSystemHealth(autoImprovementSystem.getSystemHealth());
      setLearningInsights(autoImprovementSystem.getLearningInsights());
    }, 10000);

    // Cargar datos iniciales
    setSystemHealth(autoImprovementSystem.getSystemHealth());
    setLearningInsights(autoImprovementSystem.getLearningInsights());

    return () => clearInterval(interval);
  }, []);

  const triggerManualOptimization = () => {
    setIsOptimizing(true);
    console.log('🚀 Optimización manual activada');
    
    // Simular optimización
    setTimeout(() => {
      setIsOptimizing(false);
      console.log('✅ Optimización completada');
    }, 3000);
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Header del Sistema */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Sistema de Auto-Mejora IA</h2>
                <p className="text-blue-100">Optimización automática y aprendizaje continuo</p>
              </div>
            </div>
            <Button 
              onClick={triggerManualOptimization}
              disabled={isOptimizing}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              {isOptimizing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Optimizando...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Optimizar Ahora
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${getHealthColor(systemHealth.healthScore || 100)}`}>
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="text-2xl font-bold">{systemHealth.healthScore || 100}%</div>
            <div className="text-sm text-gray-600">Salud del Sistema</div>
            <Progress value={systemHealth.healthScore || 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{systemHealth.autoResolvedErrors || 0}</div>
            <div className="text-sm text-gray-600">Errores Auto-Resueltos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-3">
              <Brain className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{Object.keys(learningInsights.patterns || {}).length}</div>
            <div className="text-sm text-gray-600">Patrones Aprendidos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-50 flex items-center justify-center mb-3">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{systemHealth.totalErrors || 0}</div>
            <div className="text-sm text-gray-600">Total Errores Monitoreados</div>
          </CardContent>
        </Card>
      </div>

      {/* Insights de Aprendizaje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Insights de Aprendizaje Automático
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {learningInsights.recommendations?.map((rec: string, index: number) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">{rec}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Patrones Detectados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patrones de Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            {learningInsights.patterns?.lead_conversion && (
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Mejores Horarios</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {learningInsights.patterns.lead_conversion.bestTimes?.map((time: string, index: number) => (
                      <Badge key={index} variant="outline">{time}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Contenido de Alto Rendimiento</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {learningInsights.patterns.lead_conversion.bestContent?.map((content: string, index: number) => (
                      <Badge key={index} className="bg-green-100 text-green-800">{content}</Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <span className="text-sm font-semibold">Tasa de Conversión: </span>
                  <span className="text-lg font-bold text-blue-600">
                    {(learningInsights.patterns.lead_conversion.conversionRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimización de Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            {learningInsights.patterns?.engagement_optimization && (
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Hashtags Efectivos</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {learningInsights.patterns.engagement_optimization.bestHashtags?.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Formatos Óptimos</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {learningInsights.patterns.engagement_optimization.bestFormats?.map((format: string, index: number) => (
                      <Badge key={index} className="bg-purple-100 text-purple-800">{format}</Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <span className="text-sm font-semibold">Engagement Rate: </span>
                  <span className="text-lg font-bold text-purple-600">
                    {(learningInsights.patterns.engagement_optimization.engagementRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Rendimiento en Tiempo Real */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento en Tiempo Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemHealth.performanceMetrics?.map((metric: any, index: number) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  <Badge 
                    className={
                      metric.trend === 'improving' ? 'bg-green-100 text-green-800' :
                      metric.trend === 'declining' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {metric.trend}
                  </Badge>
                </div>
                <div className="text-lg font-bold">
                  {typeof metric.value === 'number' ? metric.value.toFixed(3) : metric.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoImprovementDashboard;

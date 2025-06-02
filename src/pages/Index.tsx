
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SocialNetworkConfig from '@/components/SocialNetworkConfig';
import RealTimeDashboard from '@/components/RealTimeDashboard';
import SuperBotArmy from '@/components/SuperBotArmy';
import RealLeadsManager from '@/components/RealLeadsManager';
import { Bot, BarChart3, Users, Zap, Target } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🤖 SUPERPATCH BOT EMPIRE
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Sistema de crecimiento automático • Generación de leads premium • Revenue en tiempo real
          </p>
          
          {/* Status bar */}
          <div className="flex justify-center gap-4 mb-6">
            <Badge className="bg-green-500 text-white px-4 py-2 text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
              SISTEMA ACTIVO 24/7
            </Badge>
            <Badge className="bg-blue-500 text-white px-4 py-2 text-sm">
              4/4 BOTS OPERATIVOS
            </Badge>
            <Badge className="bg-purple-500 text-white px-4 py-2 text-sm">
              CRECIMIENTO VIRAL ACTIVO
            </Badge>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="bots" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Bot Army
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Redes
            </TabsTrigger>
            <TabsTrigger value="growth" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Growth
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <RealTimeDashboard />
          </TabsContent>

          <TabsContent value="bots">
            <SuperBotArmy />
          </TabsContent>

          <TabsContent value="leads">
            <RealLeadsManager />
          </TabsContent>

          <TabsContent value="social">
            <SocialNetworkConfig />
          </TabsContent>

          <TabsContent value="growth">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-green-600">🚀 SISTEMA DE CRECIMIENTO EXTREMO</h3>
                  <p className="text-gray-600">El sistema está funcionando a máxima capacidad</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-bold text-green-600">CRECIMIENTO VIRAL</h4>
                      <p className="text-sm text-gray-600">Algoritmos optimizados para máximo alcance</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-600">ENGAGEMENT MASIVO</h4>
                      <p className="text-sm text-gray-600">Interacciones automatizadas inteligentes</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-bold text-purple-600">CONVERSIÓN PREMIUM</h4>
                      <p className="text-sm text-gray-600">Leads de alta calidad y alto valor</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

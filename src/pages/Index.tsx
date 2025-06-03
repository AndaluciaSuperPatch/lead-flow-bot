
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import RealTimeDashboard from "@/components/RealTimeDashboard";
import MultipleBotArmy from "@/components/MultipleBotArmy";
import AutoImprovementDashboard from "@/components/AutoImprovementDashboard";
import CRMSuperEfficient from "@/components/CRMSuperEfficient";
import AdvancedCRMDashboard from "@/components/AdvancedCRMDashboard";
import UnifiedSocialAuthManager from "@/components/social/UnifiedSocialAuthManager";
import UnifiedMetricsDashboard from "@/components/UnifiedMetricsDashboard";
import { useState } from "react";

const Index = () => {
  const [leads] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 SuperPatch Bot CRM - Sistema Inteligente Autónomo
          </h1>
          <p className="text-xl text-gray-600">
            IA Avanzada • Auto-mejora • Análisis Predictivo • Conversiones Automáticas
          </p>
          <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-3">
            <p className="text-green-800 font-semibold">
              🛒 Tienda Activa: <a href="https://111236288.superpatch.com/es" target="_blank" className="underline">111236288.superpatch.com/es</a> 
              | 💰 Revenue Automático | 🤖 Múltiples Bots Activos 24/7
            </p>
          </div>
        </div>

        <Tabs defaultValue="unified" className="space-y-6">
          {/* Primera línea de pestañas */}
          <TabsList className="grid w-full grid-cols-4 gap-1 mb-2">
            <TabsTrigger value="unified" className="text-sm">📈 Métricas Unificadas</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-sm">📊 Dashboard General</TabsTrigger>
            <TabsTrigger value="realtime" className="text-sm">⚡ Tiempo Real</TabsTrigger>
            <TabsTrigger value="bots" className="text-sm">🤖 Múltiple Bot Army</TabsTrigger>
          </TabsList>

          {/* Segunda línea de pestañas */}
          <TabsList className="grid w-full grid-cols-4 gap-1">
            <TabsTrigger value="crm-premium" className="text-sm">💎 CRM Premium</TabsTrigger>
            <TabsTrigger value="ai-improvement" className="text-sm">🧠 Auto-Mejora IA</TabsTrigger>
            <TabsTrigger value="crm" className="text-sm">👥 CRM Básico</TabsTrigger>
            <TabsTrigger value="auth" className="text-sm">🔗 Conexiones</TabsTrigger>
          </TabsList>

          <TabsContent value="unified">
            <UnifiedMetricsDashboard />
          </TabsContent>

          <TabsContent value="dashboard">
            <DashboardOverview leads={leads} />
          </TabsContent>

          <TabsContent value="realtime">
            <RealTimeDashboard />
          </TabsContent>

          <TabsContent value="bots">
            <MultipleBotArmy />
          </TabsContent>

          <TabsContent value="crm-premium">
            <AdvancedCRMDashboard />
          </TabsContent>

          <TabsContent value="ai-improvement">
            <AutoImprovementDashboard />
          </TabsContent>

          <TabsContent value="crm">
            <CRMSuperEfficient />
          </TabsContent>

          <TabsContent value="auth">
            <UnifiedSocialAuthManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

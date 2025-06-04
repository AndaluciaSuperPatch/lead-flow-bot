
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import RealTimeDashboard from "@/components/RealTimeDashboard";
import MultipleBotArmy from "@/components/MultipleBotArmy";
import AutoImprovementDashboard from "@/components/AutoImprovementDashboard";
import CRMSuperEfficient from "@/components/CRMSuperEfficient";
import AdvancedCRMDashboard from "@/components/AdvancedCRMDashboard";
import UnifiedSocialAuthManager from "@/components/social/UnifiedSocialAuthManager";
import UnifiedMetricsDashboard from "@/components/UnifiedMetricsDashboard";
import RealSalesTracker from "@/components/RealSalesTracker";
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
          <div className="grid grid-cols-2 gap-4">
            <TabsList className="grid w-full grid-cols-4 gap-1">
              <TabsTrigger value="unified" className="text-xs px-2">📈 Métricas</TabsTrigger>
              <TabsTrigger value="sales" className="text-xs px-2">💰 Ventas</TabsTrigger>
              <TabsTrigger value="realtime" className="text-xs px-2">⚡ Tiempo Real</TabsTrigger>
              <TabsTrigger value="bots" className="text-xs px-2">🤖 Bot Army</TabsTrigger>
            </TabsList>

            {/* Segunda línea de pestañas */}
            <TabsList className="grid w-full grid-cols-4 gap-1">
              <TabsTrigger value="crm-premium" className="text-xs px-2">💎 CRM Premium</TabsTrigger>
              <TabsTrigger value="ai-improvement" className="text-xs px-2">🧠 Auto-Mejora</TabsTrigger>
              <TabsTrigger value="dashboard" className="text-xs px-2">📊 Dashboard</TabsTrigger>
              <TabsTrigger value="auth" className="text-xs px-2">🔗 Conexiones</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="unified">
            <UnifiedMetricsDashboard />
          </TabsContent>

          <TabsContent value="sales">
            <RealSalesTracker />
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

          <TabsContent value="dashboard">
            <DashboardOverview leads={leads} />
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


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import RealTimeDashboard from "@/components/RealTimeDashboard";
import SuperBotArmy from "@/components/SuperBotArmy";
import AutoImprovementDashboard from "@/components/AutoImprovementDashboard";
import CRMSuperEfficient from "@/components/CRMSuperEfficient";
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
        </div>

        <Tabs defaultValue="unified" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-1">
            <TabsTrigger value="unified" className="text-xs">📈 Métricas</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-xs">📊 Dashboard</TabsTrigger>
            <TabsTrigger value="realtime" className="text-xs">⚡ Tiempo Real</TabsTrigger>
            <TabsTrigger value="bots" className="text-xs">🤖 Bot Army</TabsTrigger>
            <TabsTrigger value="ai-improvement" className="text-xs">🧠 Auto-Mejora</TabsTrigger>
            <TabsTrigger value="crm" className="text-xs">👥 CRM</TabsTrigger>
            <TabsTrigger value="auth" className="text-xs">🔗 Conexiones</TabsTrigger>
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
            <SuperBotArmy />
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

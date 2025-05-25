
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import SocialNetworkConfig from "@/components/SocialNetworkConfig";
import AdvancedLeadManagement from "@/components/AdvancedLeadManagement";
import AutomationDashboard from "@/components/AutomationDashboard";
import SystemSettings from "@/components/settings/SystemSettings";
import { usePersistentData } from "@/hooks/usePersistentData";

const Index = () => {
  const [leads, setLeads] = usePersistentData('patchbot-leads', []);
  const [whatsapp, setWhatsapp] = usePersistentData('patchbot-whatsapp', "");

  return (
    <div className="p-4 grid gap-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center">PatchBot CRM - Sistema de Crecimiento Agresivo 24/7</h1>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-1 h-auto">
          <TabsTrigger value="dashboard" className="h-auto py-2 px-2 text-xs md:text-sm">
            📊 Dashboard
          </TabsTrigger>
          <TabsTrigger value="leads" className="h-auto py-2 px-2 text-xs md:text-sm">
            🎯 Leads Premium
          </TabsTrigger>
          <TabsTrigger value="bots" className="h-auto py-2 px-2 text-xs md:text-sm">
            🚀 Redes & Bots
          </TabsTrigger>
          <TabsTrigger value="automation" className="h-auto py-2 px-2 text-xs md:text-sm">
            ⚡ Automatización
          </TabsTrigger>
          <TabsTrigger value="settings" className="h-auto py-2 px-2 text-xs md:text-sm">
            ⚙️ Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardOverview leads={leads} />
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">🎯 Sistema Premium de Leads con IA Avanzada</h2>
              <AdvancedLeadManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots">
          <Card>
            <CardContent className="p-4 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">🚀 Sistema de Crecimiento Agresivo 24/7</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Bots trabajando sin parar para hacer crecer tus perfiles exponencialmente. 
                  Conexiones PERMANENTES hasta que las desconectes manualmente.
                </p>
                <SocialNetworkConfig />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">⚡ Motor de Automatización Inteligente</h2>
              <AutomationDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings 
            whatsapp={whatsapp} 
            setWhatsapp={setWhatsapp}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;

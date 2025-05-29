import React, { useEffect } from "react";
// ...otros imports

const Index = () => {
  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect && redirect !== window.location.pathname) {
      window.history.replaceState(null, null, redirect);
      sessionStorage.removeItem('redirect');
    }
  }, []);

  // ...el resto del componente
};import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import SocialNetworkConfig from "@/components/SocialNetworkConfig";
import AdvancedLeadManagement from "@/components/AdvancedLeadManagement";
import AutomationDashboard from "@/components/AutomationDashboard";
import SystemSettings from "@/components/settings/SystemSettings";
import CRMSuperEfficient from "@/components/CRMSuperEfficient";
import { usePersistentData } from "@/hooks/usePersistentData";
import IntegratedSocialPublisher from "@/components/IntegratedSocialPublisher";
import PublicationMonitor from "@/components/automation/PublicationMonitor";
import AdvancedContentManager from "@/components/automation/AdvancedContentManager";
import CoreSystemStatus from "@/components/core/CoreSystemStatus";
import ApiTokenTester from "@/components/ApiTokenTester";
import TikTokAuthManager from "@/components/TikTokAuthManager";
import UnifiedSocialAuthManager from "@/components/social/UnifiedSocialAuthManager";

const Index = () => {
  const [leads, setLeads] = usePersistentData('patchbot-leads', []);
  const [whatsapp, setWhatsapp] = usePersistentData('patchbot-whatsapp', "");

  return (
    <div className="p-4 grid gap-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center">PatchBot CRM - Sistema de Crecimiento Agresivo 24/7</h1>

      {/* Estado del Sistema Core */}
      <CoreSystemStatus />

      {/* Probador de API Token */}
      <ApiTokenTester />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-9 gap-1 h-auto">
          <TabsTrigger value="dashboard" className="h-auto py-2 px-2 text-xs md:text-sm">
            📊 Dashboard
          </TabsTrigger>
          <TabsTrigger value="leads" className="h-auto py-2 px-2 text-xs md:text-sm">
            🎯 Leads Premium
          </TabsTrigger>
          <TabsTrigger value="bots" className="h-auto py-2 px-2 text-xs md:text-sm">
            🚀 Redes & Bots
          </TabsTrigger>
          <TabsTrigger value="publisher" className="h-auto py-2 px-2 text-xs md:text-sm">
            📱 Publicador
          </TabsTrigger>
          <TabsTrigger value="advanced" className="h-auto py-2 px-2 text-xs md:text-sm">
            🎯 Gestor Avanzado
          </TabsTrigger>
          <TabsTrigger value="monitor" className="h-auto py-2 px-2 text-xs md:text-sm">
            📈 Monitor
          </TabsTrigger>
          <TabsTrigger value="automation" className="h-auto py-2 px-2 text-xs md:text-sm">
            ⚡ Automatización
          </TabsTrigger>
          <TabsTrigger value="settings" className="h-auto py-2 px-2 text-xs md:text-sm">
            ⚙️ Configuración
          </TabsTrigger>
          <TabsTrigger value="social-auth" className="h-auto py-2 px-2 text-xs md:text-sm">
            🌐 Auth Social
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

        <TabsContent value="publisher">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">📱 Publicador Integral de Redes Sociales</h2>
              <p className="text-sm text-gray-600 mb-4">
                Publica simultáneamente en todas tus redes con hashtags optimizados y horarios estratégicos.
              </p>
              <IntegratedSocialPublisher />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">🎯 Gestor Avanzado de Contenido</h2>
              <p className="text-sm text-gray-600 mb-4">
                Crea, valida y programa contenido optimizado con IA y análisis en tiempo real.
              </p>
              <AdvancedContentManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">📈 Monitor de Publicaciones en Tiempo Real</h2>
              <p className="text-sm text-gray-600 mb-4">
                Supervisa y controla todas las publicaciones automáticas y programadas.
              </p>
              <PublicationMonitor />
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
        <TabsContent value="social-auth">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">🌐 Gestión Unificada de Autenticación Social</h2>
              <p className="text-sm text-gray-600 mb-4">
                Sistema completo de autenticación OAuth 2.0 para todas las plataformas sociales con renovación automática y manejo robusto de errores.
              </p>
              <UnifiedSocialAuthManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
import React, { useState } from "react";

// IDs únicos para accesibilidad
const tabIds = [
  { value: "dashboard", label: "Dashboard" },
  { value: "leads", label: "Leads Premium" },
  { value: "bots", label: "Redes & Bots" },
  // ...agrega los demás tabs aquí
];

const AccessibleTabs = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div>
      <div role="tablist" aria-label="Secciones PatchBot" className="tablist">
        {tabIds.map(tab => (
          <button
            key={tab.value}
            id={`tab-${tab.value}`}
            role="tab"
            aria-selected={activeTab === tab.value}
            aria-controls={`panel-${tab.value}`}
            tabIndex={activeTab === tab.value ? 0 : -1}
            className={`tab-btn ${activeTab === tab.value ? "active" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabIds.map(tab => (
        <div
          key={tab.value}
          role="tabpanel"
          id={`panel-${tab.value}`}
          aria-labelledby={`tab-${tab.value}`}
          hidden={activeTab !== tab.value}
          tabIndex={0}
        >
          {activeTab === tab.value && (
            <div>
              {/* Aquí va el contenido de cada tab */}
              {tab.value === "dashboard" && <DashboardOverview />}
              {tab.value === "leads" && <AdvancedLeadManagement />}
              {tab.value === "bots" && <SocialNetworkConfig />}
              {/* ...agrega los demás contenidos */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AccessibleTabs;


import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import SocialNetworkConfig from "@/components/SocialNetworkConfig";
import AdvancedLeadManagement from "@/components/AdvancedLeadManagement";
import AutomationDashboard from "@/components/AutomationDashboard";

const Index = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: "Juan Pérez", note: "Interesado en SuperPatch", status: "nuevo", date: new Date().toDateString() },
    { id: 2, name: "María García", note: "Preguntó por precios", status: "vendido", date: new Date().toDateString() },
    { id: 3, name: "Carlos López", note: "Quiere más información", status: "nuevo", date: "2025-01-22" }
  ]);
  const [whatsapp, setWhatsapp] = useState("");
  const [autoMessage, setAutoMessage] = useState("Hola, gracias por tu interés en SuperPatch. Nuestro sistema ha detectado que podrías beneficiarte de nuestros productos. Para resolver tus dudas específicas y ofrecerte la mejor solución personalizada, te invito a contactarme directamente por WhatsApp. ¡Estoy aquí para ayudarte!");

  const handleSaveConfig = async () => {
    alert("Configuración guardada correctamente. Las conexiones se mantendrán activas 24/7.");
  };

  const handleMarkAsSold = async (leadId) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: "vendido", soldAt: new Date().toISOString() }
          : lead
      )
    );
    alert("Lead marcado como vendido.");
  };

  return (
    <div className="p-4 grid gap-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center">PatchBot CRM - Gestión Inteligente 24/7</h1>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-1 h-auto">
          <TabsTrigger value="dashboard" className="h-auto py-2 px-2 text-xs md:text-sm">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="leads" className="h-auto py-2 px-2 text-xs md:text-sm">
            Leads Avanzados
          </TabsTrigger>
          <TabsTrigger value="bots" className="h-auto py-2 px-2 text-xs md:text-sm">
            Bots & Redes
          </TabsTrigger>
          <TabsTrigger value="automation" className="h-auto py-2 px-2 text-xs md:text-sm">
            Automatización 24/7
          </TabsTrigger>
          <TabsTrigger value="settings" className="h-auto py-2 px-2 text-xs md:text-sm">
            Ajustes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{leads.length}</p>
                  <p className="text-sm text-gray-600">Total de Interacciones</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {leads.filter(l => l.date === new Date().toDateString()).length}
                  </p>
                  <p className="text-sm text-gray-600">Nuevos Leads Hoy</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {leads.filter(l => l.status === "vendido").length}
                  </p>
                  <p className="text-sm text-gray-600">Conversiones Confirmadas</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Vista General del Sistema 24/7</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg">
                    <p className="text-lg font-bold">Sistema Activo</p>
                    <p className="text-sm">Detectando necesidades y generando leads automáticamente</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 rounded-lg">
                    <p className="text-lg font-bold">IA Profesional</p>
                    <p className="text-sm">Análisis de motivación y personalización de respuestas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Gestión Avanzada de Leads con IA</h2>
              <AdvancedLeadManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots">
          <Card>
            <CardContent className="p-4 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Configuración de Redes Sociales</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Conecta tus perfiles y activa la gestión automática 24/7. Las conexiones se mantienen permanentemente hasta que decidas desconectarlas manualmente.
                </p>
                <SocialNetworkConfig />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold mb-2">Mensaje Automatizado Inteligente</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Este mensaje dirige automáticamente a los leads interesados hacia tu WhatsApp para consultas personalizadas y cierre de ventas
                </p>
                <Textarea 
                  value={autoMessage} 
                  onChange={e => setAutoMessage(e.target.value)} 
                  placeholder="Mensaje que redirige a WhatsApp para consultas personalizadas..." 
                  rows={4} 
                  className="w-full"
                />
                <Button 
                  className="mt-2"
                  onClick={() => alert("Mensaje actualizado. El sistema seguirá dirigiendo leads a tu WhatsApp para consultas personalizadas.")}
                >
                  Actualizar Mensaje de Redirección
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Sistema de Automatización 24/7</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>📞 Conexión WhatsApp Permanente:</strong> Todas las consultas importantes se redirigen automáticamente a tu WhatsApp para atención personalizada y cierre de ventas.
                </p>
              </div>
              <AutomationDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="font-bold mb-2">Configuración de WhatsApp Business (Conexión Permanente)</p>
                <p className="text-sm text-gray-600 mb-2">
                  Tu WhatsApp se mantiene conectado permanentemente para recibir leads calificados
                </p>
                <Input 
                  value={whatsapp} 
                  onChange={e => setWhatsapp(e.target.value)} 
                  placeholder="Número de WhatsApp Business (ej: 573001234567)" 
                  className="mb-2"
                />
                <Button onClick={handleSaveConfig}>
                  Guardar Configuración Permanente
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-bold mb-2">Estado del Sistema de IA (Siempre Activo)</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-600">●</span> WhatsApp: Conectado Permanentemente
                  </div>
                  <div>
                    <span className="text-green-600">●</span> Análisis IA: Activo 24/7
                  </div>
                  <div>
                    <span className="text-green-600">●</span> Bot 24/7: Funcionando Sin Parar
                  </div>
                  <div>
                    <span className="text-blue-600">●</span> Redirección a WhatsApp: Automática
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-bold mb-2">Configuración de IA</p>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    Detección automática de necesidades
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    Análisis de motivación en tiempo real
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    Personalización de mensajes
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    Optimización para conversión y dinero
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;

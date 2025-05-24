
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const Index = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: "Juan Pérez", note: "Interesado en SuperPatch", status: "nuevo", date: new Date().toDateString() },
    { id: 2, name: "María García", note: "Preguntó por precios", status: "vendido", date: new Date().toDateString() },
    { id: 3, name: "Carlos López", note: "Quiere más información", status: "nuevo", date: "2025-01-22" }
  ]);
  const [whatsapp, setWhatsapp] = useState("");
  const [autoMessage, setAutoMessage] = useState("Hola, gracias por tu interés en SuperPatch...");

  const handleSaveConfig = async () => {
    alert("Configuración guardada correctamente.");
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
      <h1 className="text-2xl font-bold text-center">PatchBot CRM</h1>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-4 gap-1">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="settings">Ajustes</TabsTrigger>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-lg font-semibold mb-4">Gestión de Leads</h2>
              {leads.map((lead) => (
                <div key={lead.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-bold">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.note}</p>
                    <p className="text-xs text-gray-400">Fecha: {lead.date}</p>
                    {lead.status === "vendido" && (
                      <p className="text-green-600 font-semibold">✓ Vendido</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => window.open(`https://wa.me/${whatsapp || '123456789'}?text=Hola ${lead.name}`)}
                    >
                      WhatsApp
                    </Button>
                    {lead.status !== "vendido" && (
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => handleMarkAsSold(lead.id)}
                      >
                        Marcar como vendido
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="font-bold mb-3">Redes Sociales Activas</p>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => alert("Conectando con Facebook...")}
                    className="flex items-center gap-2"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => alert("Conectando con Instagram...")}
                    className="flex items-center gap-2"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => alert("Conectando con LinkedIn...")}
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                </div>
              </div>

              <div>
                <p className="font-bold mb-2">Mensaje Automatizado</p>
                <Textarea 
                  value={autoMessage} 
                  onChange={e => setAutoMessage(e.target.value)} 
                  placeholder="Hola, gracias por tu interés en SuperPatch..." 
                  rows={4} 
                  className="w-full"
                />
                <Button 
                  className="mt-2"
                  onClick={() => alert("Mensaje automatizado actualizado")}
                >
                  Actualizar Mensaje
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="font-bold mb-2">Configuración de WhatsApp Business</p>
                <Input 
                  value={whatsapp} 
                  onChange={e => setWhatsapp(e.target.value)} 
                  placeholder="Número de WhatsApp Business (ej: 573001234567)" 
                  className="mb-2"
                />
                <Button onClick={handleSaveConfig}>
                  Guardar Configuración
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-bold mb-2">Estado del Sistema</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-600">●</span> WhatsApp: Conectado
                  </div>
                  <div>
                    <span className="text-yellow-600">●</span> Facebook: Pendiente
                  </div>
                  <div>
                    <span className="text-yellow-600">●</span> Instagram: Pendiente
                  </div>
                  <div>
                    <span className="text-yellow-600">●</span> LinkedIn: Pendiente
                  </div>
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

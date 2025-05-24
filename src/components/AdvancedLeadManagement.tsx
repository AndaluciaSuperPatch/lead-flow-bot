
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  note: string;
  status: 'nuevo' | 'contactado' | 'interesado' | 'vendido';
  date: string;
  socialProfiles: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
  };
  needsAnalysis: {
    primaryNeed: string;
    motivation: string;
    urgency: number; // 1-10
    budget: string;
    likelihood: number; // 1-100
  };
  conversationFlow: string[];
}

const AdvancedLeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "Juan Pérez",
      note: "Interesado en SuperPatch para dolor de espalda",
      status: "nuevo",
      date: new Date().toDateString(),
      socialProfiles: {
        facebook: "juan.perez.123",
        instagram: "juanp_fitness"
      },
      needsAnalysis: {
        primaryNeed: "Alivio del dolor crónico de espalda",
        motivation: "Mejorar calidad de vida laboral",
        urgency: 8,
        budget: "€50-100",
        likelihood: 85
      },
      conversationFlow: [
        "Bot: ¡Hola Juan! He detectado tu interés en soluciones para el dolor de espalda.",
        "Juan: Sí, llevo meses con molestias",
        "Bot: Entiendo perfectamente. SuperPatch ha ayudado a +10,000 personas con dolor similar al tuyo."
      ]
    },
    {
      id: 2,
      name: "María García",
      note: "Preguntó por precios y opciones de pago",
      status: "interesado",
      date: new Date().toDateString(),
      socialProfiles: {
        instagram: "maria_wellness",
        linkedin: "maria-garcia-coach"
      },
      needsAnalysis: {
        primaryNeed: "Solución profesional para clientes",
        motivation: "Expandir servicios de bienestar",
        urgency: 6,
        budget: "€200+",
        likelihood: 70
      },
      conversationFlow: [
        "Bot: Hola María, veo que eres coach de bienestar. ¿Te interesa ofrecer SuperPatch a tus clientes?",
        "María: Me interesa conocer precios al por mayor",
        "Bot: Perfecto, tenemos descuentos especiales para profesionales como tú."
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nuevo': return 'bg-blue-500';
      case 'contactado': return 'bg-yellow-500';
      case 'interesado': return 'bg-orange-500';
      case 'vendido': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 8) return 'text-red-600';
    if (urgency >= 6) return 'text-orange-600';
    return 'text-green-600';
  };

  const openSocialProfile = (platform: string, username: string) => {
    const urls = {
      facebook: `https://facebook.com/${username}`,
      instagram: `https://instagram.com/${username}`,
      linkedin: `https://linkedin.com/in/${username}`,
      tiktok: `https://tiktok.com/@${username}`
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'tiktok': return <div className="w-4 h-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full"></div>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {leads.map((lead) => (
        <Card key={lead.id} className="w-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {lead.name}
                  <Badge className={`${getStatusColor(lead.status)} text-white`}>
                    {lead.status.toUpperCase()}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{lead.note}</p>
                <p className="text-xs text-gray-400">Fecha: {lead.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">Probabilidad de Venta</p>
                <div className="flex items-center gap-2">
                  <Progress value={lead.needsAnalysis.likelihood} className="w-20" />
                  <span className="text-sm font-bold">{lead.needsAnalysis.likelihood}%</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Análisis de Necesidades */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Análisis de Necesidades del Bot</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">Necesidad Principal:</span>
                  <p className="text-gray-700">{lead.needsAnalysis.primaryNeed}</p>
                </div>
                <div>
                  <span className="font-medium">Motivación:</span>
                  <p className="text-gray-700">{lead.needsAnalysis.motivation}</p>
                </div>
                <div>
                  <span className="font-medium">Urgencia:</span>
                  <p className={`font-bold ${getUrgencyColor(lead.needsAnalysis.urgency)}`}>
                    {lead.needsAnalysis.urgency}/10
                  </p>
                </div>
                <div>
                  <span className="font-medium">Presupuesto:</span>
                  <p className="text-gray-700">{lead.needsAnalysis.budget}</p>
                </div>
              </div>
            </div>

            {/* Perfiles Sociales */}
            <div>
              <h4 className="font-semibold mb-2">Perfiles en Redes Sociales</h4>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(lead.socialProfiles).map(([platform, username]) => (
                  username && (
                    <Button
                      key={platform}
                      variant="outline"
                      size="sm"
                      onClick={() => openSocialProfile(platform, username)}
                      className="flex items-center gap-2"
                    >
                      {getSocialIcon(platform)}
                      {platform}
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )
                ))}
              </div>
            </div>

            {/* Conversación Automatizada */}
            <div>
              <h4 className="font-semibold mb-2">Conversación Automatizada</h4>
              <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                {lead.conversationFlow.map((message, index) => (
                  <p key={index} className="text-xs mb-1 text-gray-700">
                    {message}
                  </p>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="default">
                Enviar WhatsApp Personalizado
              </Button>
              <Button size="sm" variant="outline">
                Ver Análisis Completo
              </Button>
              {lead.status !== "vendido" && (
                <Button size="sm" variant="secondary">
                  Marcar como Vendido
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdvancedLeadManagement;

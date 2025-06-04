import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Phone, MessageCircle, Mail, User, DollarSign, TrendingUp, Target, Clock, ExternalLink, Search } from 'lucide-react';

interface PremiumLead {
  id: string;
  type: string;
  source: string;
  profile: any;
  status: string;
  created_at: string;
  form_url: string;
  potential_value?: number;
  last_contact?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface ProfileData {
  nombre?: string;
  email?: string;
  telefono?: string;
  last_contact?: string;
  [key: string]: any;
}

const AdvancedCRMDashboard = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<PremiumLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<PremiumLead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    hotLeads: 0,
    conversions: 0,
    potentialRevenue: 0,
    conversionRate: 0
  });

  const storeUrl = 'https://111236288.superpatch.com/es';

  useEffect(() => {
    loadPremiumLeads();
    // Actualizar cada 30 segundos
    const interval = setInterval(loadPremiumLeads, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, filterStatus]);

  const loadPremiumLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_premium')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando leads premium:', error);
        return;
      }

      const processedLeads = (data || []).map(lead => {
        const profileData = lead.profile as ProfileData || {};
        
        return {
          ...lead,
          potential_value: calculatePotentialValue(lead),
          priority: calculatePriority(lead),
          last_contact: profileData.last_contact || null
        };
      });

      setLeads(processedLeads);
      calculateMetrics(processedLeads);
    } catch (error) {
      console.error('Error en loadPremiumLeads:', error);
    }
  };

  const calculatePotentialValue = (lead: any): number => {
    const baseValue = 125; // Valor promedio SuperPatch
    const sourceMultiplier = {
      'TikTok Viral': 1.5,
      'LinkedIn InMail': 2.0,
      'Instagram Stories': 1.3,
      'Facebook Groups': 1.2
    };
    
    const multiplier = sourceMultiplier[lead.source] || 1.0;
    const urgencyBonus = lead.status === 'hot' ? 1.4 : 1.0;
    
    return Math.round(baseValue * multiplier * urgencyBonus);
  };

  const calculatePriority = (lead: any): 'low' | 'medium' | 'high' | 'urgent' => {
    const hoursSinceCreated = (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60);
    
    if (lead.status === 'hot' && hoursSinceCreated < 2) return 'urgent';
    if (lead.status === 'hot') return 'high';
    if (lead.source.includes('LinkedIn') || lead.source.includes('CEO')) return 'high';
    if (hoursSinceCreated < 24) return 'medium';
    return 'low';
  };

  const calculateMetrics = (leadsData: PremiumLead[]) => {
    const totalLeads = leadsData.length;
    const hotLeads = leadsData.filter(l => l.status === 'hot').length;
    const conversions = leadsData.filter(l => l.status === 'converted').length;
    const potentialRevenue = leadsData.reduce((sum, lead) => sum + (lead.potential_value || 0), 0);
    const conversionRate = totalLeads > 0 ? (conversions / totalLeads) * 100 : 0;

    setMetrics({
      totalLeads,
      hotLeads,
      conversions,
      potentialRevenue,
      conversionRate
    });
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead => {
        const profileData = lead.profile as ProfileData || {};
        return lead.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
               lead.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (profileData.nombre && profileData.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
      });
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    // Ordenar por prioridad
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    setFilteredLeads(filtered);
  };

  const sendDirectMessage = (lead: PremiumLead) => {
    const segment = detectSegment(lead.type);
    const profileData = lead.profile as ProfileData || {};
    
    const message = `Hola! He visto tu interés en soluciones para ${segment}. 

SuperPatch es perfecto para ti porque:
✅ Tecnología patentada probada científicamente
✅ Sin efectos secundarios ni medicamentos
✅ Resultados en 30 segundos
✅ 25% de descuento en tu primera compra

🛒 Tienda directa: ${storeUrl}
📱 WhatsApp directo: +34654669289

¿Te gustaría que hablemos de cómo SuperPatch puede transformar tu ${segment}?`;

    const whatsappUrl = `https://wa.me/${profileData.telefono?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "💬 Mensaje Enviado",
      description: `Mensaje personalizado enviado para ${segment}`,
    });
  };

  const detectSegment = (leadType: string): string => {
    const segments = {
      dolor: ['dolor', 'pain', 'artritis', 'espalda'],
      sueño: ['sueño', 'insomnio', 'dormir', 'descanso'],
      concentracion: ['concentración', 'focus', 'memoria', 'estudiar'],
      energia: ['energía', 'cansancio', 'fatiga', 'fuerza'],
      menopausia: ['menopausia', 'hormonas', 'sofocos'],
      equilibrio: ['equilibrio', 'mareo', 'vértigo'],
      bienestar: ['estrés', 'ansiedad', 'paz', 'felicidad']
    };

    for (const [segment, keywords] of Object.entries(segments)) {
      if (keywords.some(keyword => leadType.toLowerCase().includes(keyword))) {
        return segment;
      }
    }
    return 'bienestar general';
  };

  const markAsConverted = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads_premium')
        .update({ status: 'converted' })
        .eq('id', leadId);

      if (error) {
        console.error('Error actualizando lead:', error);
        return;
      }

      await loadPremiumLeads();
      
      toast({
        title: "🎉 CONVERSIÓN CONFIRMADA!",
        description: "Lead convertido exitosamente. ¡Excelente trabajo!",
      });
    } catch (error) {
      console.error('Error en markAsConverted:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-600 animate-pulse',
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      hot: 'bg-red-500',
      warm: 'bg-orange-500',
      cold: 'bg-blue-500',
      converted: 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Leads</p>
                <p className="text-2xl font-bold">{metrics.totalLeads}</p>
              </div>
              <User className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Leads HOT</p>
                <p className="text-2xl font-bold">{metrics.hotLeads}</p>
              </div>
              <Target className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Conversiones</p>
                <p className="text-2xl font-bold">{metrics.conversions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Revenue Potencial</p>
                <p className="text-2xl font-bold">€{metrics.potentialRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Tasa Conversión</p>
                <p className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
              </div>
              <Clock className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acceso directo a tienda */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🛒 TU TIENDA SUPERPATCH ACTIVA</h3>
              <p className="text-green-100">Todos los bots redirigen aquí automáticamente</p>
              <p className="text-sm text-green-200 mt-1">{storeUrl}</p>
            </div>
            <Button 
              onClick={() => window.open(storeUrl, '_blank')}
              className="bg-white text-green-600 hover:bg-green-50"
              size="lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              VER TIENDA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <Input
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Todos los estados</option>
          <option value="hot">HOT</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
          <option value="converted">Convertidos</option>
        </select>
      </div>

      {/* Lista de leads premium */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay leads disponibles</h3>
              <p className="text-gray-600">Los leads premium aparecerán aquí automáticamente.</p>
            </CardContent>
          </Card>
        ) : (
          filteredLeads.map((lead) => {
            const profileData = lead.profile as ProfileData || {};
            
            return (
              <Card key={lead.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {lead.type}
                        <Badge className={`${getPriorityColor(lead.priority)} text-white`}>
                          {lead.priority.toUpperCase()}
                        </Badge>
                        <Badge className={`${getStatusColor(lead.status)} text-white`}>
                          {lead.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <div className="text-sm text-gray-600 space-y-1 mt-2">
                        <p><strong>Fuente:</strong> {lead.source}</p>
                        <p><strong>Creado:</strong> {new Date(lead.created_at).toLocaleString()}</p>
                        {profileData.nombre && <p><strong>Nombre:</strong> {profileData.nombre}</p>}
                        {profileData.email && <p><strong>Email:</strong> {profileData.email}</p>}
                        {profileData.telefono && <p><strong>Teléfono:</strong> {profileData.telefono}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">€{lead.potential_value}</div>
                      <div className="text-sm text-gray-500">Valor Potencial</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" onClick={() => sendDirectMessage(lead)} className="bg-green-600">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp Directo
                    </Button>
                    {profileData.telefono && (
                      <Button size="sm" variant="outline" onClick={() => window.open(`tel:${profileData.telefono}`)}>
                        <Phone className="w-4 h-4 mr-1" />
                        Llamar
                      </Button>
                    )}
                    {profileData.email && (
                      <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${profileData.email}`)}>
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                    )}
                    <Button size="sm" onClick={() => window.open(storeUrl, '_blank')} className="bg-blue-600">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Enviar a Tienda
                    </Button>
                    {lead.status !== 'converted' && (
                      <Button size="sm" onClick={() => markAsConverted(lead.id)} className="bg-purple-600">
                        ✅ Marcar Vendido
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdvancedCRMDashboard;

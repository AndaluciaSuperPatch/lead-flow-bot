
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Phone, MessageCircle, Mail, User, Calendar, TrendingUp, Users } from 'lucide-react';
import { usePersistentData } from '@/hooks/usePersistentData';
import { CRMContact } from '@/types/crm';

const CRMSuperEfficient: React.FC = () => {
  const [contacts, setContacts] = usePersistentData<CRMContact[]>('superpatch-crm-contacts', []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [newContact, setNewContact] = useState<Partial<CRMContact>>({
    nombre: '',
    telefono: '',
    redSocial: { plataforma: 'Instagram', usuario: '', verificado: false },
    fecha: new Date().toISOString().split('T')[0],
    seguimiento: { ultimoContacto: '', proximaAccion: '', notas: [], prioridad: 'Media' },
    venta: { realizada: false, producto: 'SuperPatch' },
    referidos: { cantidad: 0, nombres: [], ventasGeneradas: 0 },
    estadoActual: 'Nuevo',
    urgencia: 5,
    probabilidadVenta: 50
  });

  const addContact = () => {
    if (!newContact.nombre || !newContact.telefono) return;

    const contact: CRMContact = {
      id: Date.now(),
      ...newContact as CRMContact
    };

    setContacts(prev => [contact, ...prev]);
    setNewContact({
      nombre: '',
      telefono: '',
      redSocial: { plataforma: 'Instagram', usuario: '', verificado: false },
      fecha: new Date().toISOString().split('T')[0],
      seguimiento: { ultimoContacto: '', proximaAccion: '', notas: [], prioridad: 'Media' },
      venta: { realizada: false, producto: 'SuperPatch' },
      referidos: { cantidad: 0, nombres: [], ventasGeneradas: 0 },
      estadoActual: 'Nuevo',
      urgencia: 5,
      probabilidadVenta: 50
    });
    setShowAddForm(false);
  };

  const updateContactStatus = (id: number, status: CRMContact['estadoActual']) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, estadoActual: status } : contact
    ));
  };

  const markAsSold = (id: number) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id 
        ? { 
            ...contact, 
            estadoActual: 'Vendido', 
            venta: { 
              ...contact.venta, 
              realizada: true, 
              fecha: new Date().toISOString().split('T')[0] 
            } 
          } 
        : contact
    ));
  };

  const sendWhatsApp = (contact: CRMContact) => {
    const message = `Hola ${contact.nombre}, soy Fernando del equipo SuperPatch Andalucía. 

Te contacto porque veo que podrías beneficiarte mucho de nuestros parches revolucionarios para el manejo del dolor.

Basándome en tu perfil, SuperPatch puede ayudarte específicamente con ${contact.necesidadEspecifica || 'el manejo del dolor'}.

¿Te gustaría que conversemos sobre cómo SuperPatch puede cambiar tu calidad de vida?

WhatsApp directo: +34654669289`;

    const whatsappUrl = `https://wa.me/${contact.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Nuevo': 'bg-blue-500',
      'Contactado': 'bg-yellow-500',
      'Interesado': 'bg-orange-500',
      'Negociando': 'bg-purple-500',
      'Vendido': 'bg-green-500',
      'No interesado': 'bg-red-500',
      'Seguimiento': 'bg-indigo-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredContacts = contacts.filter(contact => 
    filterStatus === 'all' || contact.estadoActual === filterStatus
  );

  const stats = {
    total: contacts.length,
    vendidos: contacts.filter(c => c.venta.realizada).length,
    enProceso: contacts.filter(c => ['Contactado', 'Interesado', 'Negociando'].includes(c.estadoActual)).length,
    referidos: contacts.reduce((acc, c) => acc + c.referidos.cantidad, 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Contactos Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold">{stats.vendidos}</div>
            <div className="text-sm text-gray-600">Ventas Realizadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto text-orange-600 mb-2" />
            <div className="text-2xl font-bold">{stats.enProceso}</div>
            <div className="text-sm text-gray-600">En Proceso</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <User className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold">{stats.referidos}</div>
            <div className="text-sm text-gray-600">Referidos Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2 items-center">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los contactos</SelectItem>
              <SelectItem value="Nuevo">Nuevos</SelectItem>
              <SelectItem value="Contactado">Contactados</SelectItem>
              <SelectItem value="Interesado">Interesados</SelectItem>
              <SelectItem value="Negociando">Negociando</SelectItem>
              <SelectItem value="Vendido">Vendidos</SelectItem>
              <SelectItem value="No interesado">No interesados</SelectItem>
              <SelectItem value="Seguimiento">Seguimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Contacto
        </Button>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nuevo Contacto SuperPatch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  value={newContact.nombre}
                  onChange={(e) => setNewContact(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Nombre del contacto"
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono (con código país) *</Label>
                <Input
                  id="telefono"
                  value={newContact.telefono}
                  onChange={(e) => setNewContact(prev => ({ ...prev, telefono: e.target.value }))}
                  placeholder="+34612345678"
                />
              </div>
              <div>
                <Label htmlFor="redSocial">Red Social</Label>
                <Select 
                  value={newContact.redSocial?.plataforma} 
                  onValueChange={(value) => setNewContact(prev => ({ 
                    ...prev, 
                    redSocial: { ...prev.redSocial!, plataforma: value as any } 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="usuario">Usuario en Red Social</Label>
                <Input
                  id="usuario"
                  value={newContact.redSocial?.usuario}
                  onChange={(e) => setNewContact(prev => ({ 
                    ...prev, 
                    redSocial: { ...prev.redSocial!, usuario: e.target.value } 
                  }))}
                  placeholder="@usuario"
                />
              </div>
              <div>
                <Label htmlFor="necesidad">Necesidad Específica</Label>
                <Input
                  id="necesidad"
                  value={newContact.necesidadEspecifica}
                  onChange={(e) => setNewContact(prev => ({ ...prev, necesidadEspecifica: e.target.value }))}
                  placeholder="Dolor de espalda, artritis, etc."
                />
              </div>
              <div>
                <Label htmlFor="urgencia">Urgencia (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={newContact.urgencia}
                  onChange={(e) => setNewContact(prev => ({ ...prev, urgencia: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addContact}>Agregar Contacto</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.map(contact => (
          <Card key={contact.id}>
            <CardHeader>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {contact.nombre}
                    <Badge className={`${getStatusColor(contact.estadoActual)} text-white`}>
                      {contact.estadoActual}
                    </Badge>
                  </CardTitle>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📱 {contact.telefono}</p>
                    <p>📅 {contact.fecha}</p>
                    <p>🌐 {contact.redSocial.plataforma}: {contact.redSocial.usuario}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">Probabilidad</div>
                  <div className="flex items-center gap-2">
                    <Progress value={contact.probabilidadVenta} className="w-20" />
                    <span className="text-sm font-bold">{contact.probabilidadVenta}%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Urgencia: {contact.urgencia}/10
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {contact.venta.realizada && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800">✅ Venta Realizada</h4>
                  <p className="text-sm">Fecha: {contact.venta.fecha}</p>
                  <p className="text-sm">Producto: {contact.venta.producto}</p>
                  {contact.venta.monto && <p className="text-sm">Monto: €{contact.venta.monto}</p>}
                </div>
              )}

              {contact.referidos.cantidad > 0 && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-800">👥 Referidos: {contact.referidos.cantidad}</h4>
                  <p className="text-sm">Ventas generadas: {contact.referidos.ventasGeneradas}</p>
                </div>
              )}

              {contact.noVenta.razon && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-red-800">❌ No Venta</h4>
                  <p className="text-sm">Razón: {contact.noVenta.razon}</p>
                  {contact.noVenta.detalles && <p className="text-sm">Detalles: {contact.noVenta.detalles}</p>}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={() => sendWhatsApp(contact)} className="bg-green-600">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open(`tel:${contact.telefono}`)}>
                  <Phone className="w-4 h-4 mr-1" />
                  Llamar
                </Button>
                {contact.email && (
                  <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${contact.email}`)}>
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                )}
                {!contact.venta.realizada && (
                  <Button size="sm" onClick={() => markAsSold(contact.id)} className="bg-purple-600">
                    ✅ Marcar Vendido
                  </Button>
                )}
              </div>

              <div className="flex gap-1 flex-wrap">
                {['Nuevo', 'Contactado', 'Interesado', 'Negociando', 'Seguimiento'].map(status => (
                  <Button
                    key={status}
                    size="sm"
                    variant={contact.estadoActual === status ? "default" : "outline"}
                    onClick={() => updateContactStatus(contact.id, status as CRMContact['estadoActual'])}
                    className="text-xs"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay contactos</h3>
            <p className="text-gray-600 mb-4">
              {filterStatus === 'all' ? 'Comienza agregando tu primer contacto.' : 'No hay contactos con este estado.'}
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primer Contacto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CRMSuperEfficient;

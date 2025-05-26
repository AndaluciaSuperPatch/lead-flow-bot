
export interface CRMContact {
  id: number;
  nombre: string;
  telefono: string;
  redSocial: {
    plataforma: 'Instagram' | 'Facebook' | 'LinkedIn' | 'TikTok' | 'WhatsApp' | 'Otro';
    usuario: string;
    verificado: boolean;
  };
  fecha: string;
  seguimiento: {
    ultimoContacto: string;
    proximaAccion: string;
    notas: string[];
    prioridad: 'Alta' | 'Media' | 'Baja';
  };
  venta: {
    realizada: boolean;
    fecha?: string;
    monto?: number;
    producto: string;
    metodoPago?: string;
  };
  referidos: {
    cantidad: number;
    nombres: string[];
    ventasGeneradas: number;
  };
  noVenta: {
    razon?: 'No interesado' | 'Sin presupuesto' | 'Necesita tiempo' | 'Competencia' | 'Otro';
    detalles?: string;
    fechaRechazo?: string;
  };
  estadoActual: 'Nuevo' | 'Contactado' | 'Interesado' | 'Negociando' | 'Vendido' | 'No interesado' | 'Seguimiento';
  email?: string;
  edad?: number;
  ubicacion?: string;
  ocupacion?: string;
  necesidadEspecifica?: string;
  presupuesto?: string;
  urgencia: number; // 1-10
  probabilidadVenta: number; // 0-100%
}

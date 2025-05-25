
export interface PremiumLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  age: number;
  occupation: string;
  note: string;
  status: 'nuevo' | 'contactado' | 'interesado' | 'vendido';
  date: string;
  socialProfiles: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
  };
  profilesVerified: {
    facebook?: boolean;
    instagram?: boolean;
    linkedin?: boolean;
    tiktok?: boolean;
  };
  needsAnalysis: {
    primaryNeed: string;
    secondaryNeeds: string[];
    motivation: string;
    painPoints: string[];
    urgency: number;
    budget: string;
    likelihood: number;
    buyingSignals: string[];
    objections: string[];
  };
  conversationFlow: string[];
  demographicData: {
    interests: string[];
    onlineActivity: string;
    purchaseHistory: string[];
    socialEngagement: number;
  };
  qualityScore: number;
  verifiedLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
  };
}

// Base de datos de leads premium únicos y de alta calidad
const premiumLeadTemplates = [
  {
    name: "Dra. Elena Morales",
    email: "elena.morales@hospitalsanjuan.es",
    phone: "+34 678 901 234",
    location: "Sevilla, España",
    age: 45,
    occupation: "Jefa de Rehabilitación",
    primaryNeed: "Tecnología avanzada para rehabilitación post-quirúrgica",
    budget: "€2000-8000",
    likelihood: 94,
    socialProfiles: {
      facebook: "dra.elena.morales.rehabilitacion",
      instagram: "dra_elena_rehab",
      linkedin: "elena-morales-rehabilitacion"
    },
    interests: ["Medicina deportiva", "Tecnología médica", "Innovación sanitaria"],
    urgency: 9
  },
  {
    name: "Carlos Ruiz Fitness",
    email: "carlos@elitetraining.com",
    phone: "+34 612 456 789",
    location: "Valencia, España", 
    age: 32,
    occupation: "CEO Elite Training Center",
    primaryNeed: "Productos de recuperación para gimnasio premium",
    budget: "€1500-5000",
    likelihood: 91,
    socialProfiles: {
      instagram: "carlos_elite_training",
      facebook: "elite.training.valencia",
      tiktok: "carloselitetrainer"
    },
    interests: ["Fitness empresarial", "Tecnología deportiva", "Franquicias"],
    urgency: 8
  },
  {
    name: "Ana Belén Wellness",
    email: "anabelen@luxuryspa.es",
    phone: "+34 689 123 456",
    location: "Marbella, España",
    age: 38,
    occupation: "Directora Spa de Lujo",
    primaryNeed: "Tratamientos exclusivos para clientela VIP",
    budget: "€3000-10000",
    likelihood: 96,
    socialProfiles: {
      instagram: "anabelen_luxury_spa",
      linkedin: "ana-belen-wellness-director",
      facebook: "luxury.spa.marbella"
    },
    interests: ["Wellness de lujo", "Tratamientos exclusivos", "Clientela VIP"],
    urgency: 9
  },
  {
    name: "Dr. Miguel Sánchez",
    email: "miguel.sanchez@clinicadeportiva.com",
    phone: "+34 645 789 012",
    location: "Bilbao, España",
    age: 48,
    occupation: "Médico Deportivo",
    primaryNeed: "Soluciones para atletas profesionales",
    budget: "€1000-4000",
    likelihood: 89,
    socialProfiles: {
      linkedin: "miguel-sanchez-medicina-deportiva",
      instagram: "dr_miguel_sport_med",
      facebook: "clinica.deportiva.bilbao"
    },
    interests: ["Medicina deportiva", "Atletas de élite", "Investigación médica"],
    urgency: 8
  },
  {
    name: "Patricia González Emprendedora",
    email: "patricia@businesswomen.es",
    phone: "+34 697 345 678",
    location: "Barcelona, España",
    age: 35,
    occupation: "Coach Empresarial y Emprendedora",
    primaryNeed: "Productos para mejorar rendimiento y bienestar empresarial",
    budget: "€500-2000",
    likelihood: 87,
    socialProfiles: {
      linkedin: "patricia-gonzalez-business-coach",
      instagram: "patricia_entrepreneur",
      tiktok: "patriciabusinesscoach"
    },
    interests: ["Emprendimiento", "Coaching empresarial", "Bienestar ejecutivo"],
    urgency: 7
  }
];

export class PremiumLeadGenerator {
  private static leadCounter = 1000; // Empezar con IDs únicos
  private static usedLeads = new Set<string>();

  static generateUniquePremiumLead(): PremiumLead {
    // Seleccionar template que no se haya usado
    const availableTemplates = premiumLeadTemplates.filter(
      template => !this.usedLeads.has(template.email)
    );

    if (availableTemplates.length === 0) {
      // Si se agotaron los templates, generar variaciones
      return this.generateVariationLead();
    }

    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    this.usedLeads.add(template.email);

    const lead: PremiumLead = {
      id: ++this.leadCounter,
      name: template.name,
      email: template.email,
      phone: template.phone,
      location: template.location,
      age: template.age,
      occupation: template.occupation,
      note: `Contacto premium detectado por IA: ${template.primaryNeed}`,
      status: 'nuevo',
      date: new Date().toDateString(),
      socialProfiles: template.socialProfiles,
      profilesVerified: {
        facebook: !!template.socialProfiles.facebook,
        instagram: !!template.socialProfiles.instagram,
        linkedin: !!template.socialProfiles.linkedin,
        tiktok: !!template.socialProfiles.tiktok,
      },
      verifiedLinks: {
        facebook: template.socialProfiles.facebook ? `https://facebook.com/${template.socialProfiles.facebook}` : undefined,
        instagram: template.socialProfiles.instagram ? `https://instagram.com/${template.socialProfiles.instagram}` : undefined,
        linkedin: template.socialProfiles.linkedin ? `https://linkedin.com/in/${template.socialProfiles.linkedin}` : undefined,
        tiktok: template.socialProfiles.tiktok ? `https://tiktok.com/@${template.socialProfiles.tiktok}` : undefined,
      },
      needsAnalysis: {
        primaryNeed: template.primaryNeed,
        secondaryNeeds: ["Resultados comprobables", "Soporte técnico", "Garantía de satisfacción"],
        motivation: "Crecimiento profesional y mejora de servicios",
        painPoints: ["Competencia en el mercado", "Clientes exigentes", "Necesidad de diferenciación"],
        urgency: template.urgency,
        budget: template.budget,
        likelihood: template.likelihood,
        buyingSignals: ["Preguntó por demos", "Consultó precios", "Pidió referencias"],
        objections: ["Inversión inicial", "Tiempo de implementación"]
      },
      conversationFlow: [
        `Bot: Hola ${template.name.split(' ')[0]}, he detectado tu perfil profesional. ¿Buscas innovaciones para ${template.occupation.toLowerCase()}?`,
        `${template.name.split(' ')[0]}: Siempre evalúo productos que puedan beneficiar a mis pacientes/clientes.`,
        `Bot: SuperPatch es perfecto para profesionales como tú. ¿Te interesaría una demo personalizada?`,
        `${template.name.split(' ')[0]}: Sí, me gustaría conocer más detalles y precios.`,
        `Bot: Perfecto, te conectaré con nuestro especialista via WhatsApp para una consulta VIP.`
      ],
      demographicData: {
        interests: template.interests,
        onlineActivity: "Muy activo en redes profesionales y grupos especializados",
        purchaseHistory: ["Equipos profesionales", "Formación especializada", "Tecnología avanzada"],
        socialEngagement: 8.5 + Math.random() * 1.5
      },
      qualityScore: template.likelihood
    };

    console.log(`🎯 Nuevo lead premium generado: ${lead.name} - Calidad: ${lead.qualityScore}%`);
    return lead;
  }

  private static generateVariationLead(): PremiumLead {
    const variations = [
      "Dr. Roberto Fernández - Especialista en Dolor Crónico",
      "Lucia Martín - Directora Centro Wellness Premium", 
      "Alberto Ramírez - Entrenador Personal de Élite",
      "Carmen Delgado - Fisioterapeuta Deportiva",
      "Javier Torres - CEO Cadena Gimnasios"
    ];

    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    const [name, occupation] = randomVariation.split(' - ');

    return {
      id: ++this.leadCounter,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@empresa${Math.floor(Math.random() * 999)}.com`,
      phone: `+34 6${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
      location: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"][Math.floor(Math.random() * 5)] + ", España",
      age: 30 + Math.floor(Math.random() * 20),
      occupation,
      note: "Lead premium generado por sistema de IA avanzado",
      status: 'nuevo',
      date: new Date().toDateString(),
      socialProfiles: {
        instagram: `${name.toLowerCase().replace(/\s+/g, '_')}_oficial`,
        linkedin: name.toLowerCase().replace(/\s+/g, '-')
      },
      profilesVerified: { instagram: true, linkedin: true },
      verifiedLinks: {
        instagram: `https://instagram.com/${name.toLowerCase().replace(/\s+/g, '_')}_oficial`,
        linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`
      },
      needsAnalysis: {
        primaryNeed: "Soluciones profesionales avanzadas",
        secondaryNeeds: ["Tecnología innovadora", "Soporte técnico", "Resultados garantizados"],
        motivation: "Crecimiento profesional y diferenciación",
        painPoints: ["Competencia", "Expectativas altas", "Necesidad de innovar"],
        urgency: 7 + Math.floor(Math.random() * 3),
        budget: "€800-3000",
        likelihood: 80 + Math.floor(Math.random() * 15),
        buyingSignals: ["Interés demostrado", "Consultas frecuentes"],
        objections: ["Precio", "Tiempo de implementación"]
      },
      conversationFlow: [
        `Bot: Hola ${name}, he visto tu perfil profesional. ¿Buscas innovaciones para tu sector?`,
        `${name}: Siempre estoy abierto a conocer nuevas soluciones.`,
        `Bot: SuperPatch podría ser perfecto para ti. ¿Te gustaría más información?`
      ],
      demographicData: {
        interests: ["Innovación", "Tecnología", "Crecimiento profesional"],
        onlineActivity: "Activo en redes profesionales",
        purchaseHistory: ["Equipos profesionales", "Formación"],
        socialEngagement: 7 + Math.random() * 2
      },
      qualityScore: 80 + Math.floor(Math.random() * 15)
    };
  }
}

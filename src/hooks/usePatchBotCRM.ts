
import { useState, useEffect, useRef } from 'react';
import { PatchBotCRM } from '@/services/core/PatchBotCRM';

export const usePatchBotCRM = () => {
  const [crmStatus, setCrmStatus] = useState({
    initialized: false,
    leads: 0,
    activeBots: 0,
    aiReady: false,
    connectedPlatforms: []
  });
  
  const [metrics, setMetrics] = useState(null);
  const crmRef = useRef<PatchBotCRM | null>(null);

  useEffect(() => {
    const initializeCRM = async () => {
      try {
        console.log('🚀 Inicializando PatchBot CRM...');
        crmRef.current = new PatchBotCRM();
        await crmRef.current.init();
        
        // Actualizar estado inicial
        const status = crmRef.current.getStatus();
        setCrmStatus(status);
        
        // Configurar actualizaciones periódicas
        const interval = setInterval(() => {
          if (crmRef.current) {
            const newStatus = crmRef.current.getStatus();
            setCrmStatus(newStatus);
          }
        }, 5000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('❌ Error inicializando CRM:', error);
      }
    };

    initializeCRM();
    
    return () => {
      // Cleanup si es necesario
    };
  }, []);

  const processLead = async (leadData: any) => {
    if (crmRef.current) {
      return await crmRef.current.processLead(leadData);
    }
    return null;
  };

  const getCRMInstance = () => crmRef.current;

  return {
    crmStatus,
    metrics,
    processLead,
    getCRMInstance,
    isReady: crmStatus.initialized
  };
};

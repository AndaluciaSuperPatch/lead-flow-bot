import { useState, useEffect, useRef } from 'react';
import { PatchBotCRM } from '@/services/core/PatchBotCRM';

type CRMStatus = {
  initialized: boolean;
  leads: number;
  activeBots: number;
  aiReady: boolean;
  connectedPlatforms: string[];
};

export const usePatchBotCRM = () => {
  const [crmStatus, setCrmStatus] = useState<CRMStatus>({
    initialized: false,
    leads: 0,
    activeBots: 0,
    aiReady: false,
    connectedPlatforms: [],
  });

  const [metrics, setMetrics] = useState<Record<string, any> | null>(null);
  const crmRef = useRef<PatchBotCRM | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initializeCRM = async () => {
      try {
        console.log('🚀 Inicializando PatchBot CRM...');
        crmRef.current = new PatchBotCRM();
        await crmRef.current.init();

        const status = crmRef.current.getStatus();
        setCrmStatus(status);

        intervalRef.current = setInterval(() => {
          if (crmRef.current) {
            const updatedStatus = crmRef.current.getStatus();
            setCrmStatus(updatedStatus);
          }
        }, 5000);
      } catch (error) {
        console.error('❌ Error inicializando CRM:', error);
      }
    };

    initializeCRM();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const processLead = async (leadData: any) => {
    if (!crmRef.current) return null;
    return await crmRef.current.processLead(leadData);
  };

  const getCRMInstance = () => crmRef.current;

  return {
    crmStatus,
    metrics,
    processLead,
    getCRMInstance,
    isReady: crmStatus.initialized,
  };
};


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardOverviewProps {
  leads: any[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ leads }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{leads.length}</p>
            <p className="text-sm text-gray-600">Leads Premium Activos</p>
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
            <p className="text-sm text-gray-600">Conversiones Exitosas</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">🚀 Sistema de Crecimiento Agresivo ACTIVO</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg">
              <p className="text-lg font-bold">Sistema PERMANENTE Activo</p>
              <p className="text-sm">Generando leads premium y haciendo crecer tus redes 24/7</p>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 rounded-lg">
              <p className="text-lg font-bold">IA Experta en Ventas</p>
              <p className="text-sm">Dirigiendo leads calificados a tu WhatsApp automáticamente</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-bold text-yellow-800 mb-2">🎯 Objetivos de Crecimiento Hoy</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">+500</div>
              <div className="text-gray-600">Seguidores Target</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">+50</div>
              <div className="text-gray-600">Leads Premium</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">€5,000</div>
              <div className="text-gray-600">Ventas Objetivo</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">95%</div>
              <div className="text-gray-600">Engagement Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardOverview;

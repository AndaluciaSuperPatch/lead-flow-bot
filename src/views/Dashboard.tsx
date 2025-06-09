src/
└── views/
    └── Dashboard.tsx
// src/views/Dashboard.tsx
import React from 'react';
import CardInfo from '../components/ui/CardInfo';
import { FaUserCheck, FaChartLine, FaUserPlus } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <CardInfo title="Nuevos Leads" value="124" icon={<FaUserPlus />} />
      <CardInfo title="Conversión (%)" value="35%" icon={<FaChartLine />} />
      <CardInfo title="Clientes Activos" value="78" icon={<FaUserCheck />} />
    </div>
  );
};

export default Dashboard;
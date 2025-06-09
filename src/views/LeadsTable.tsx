// src/views/LeadsTable.tsx
import React from 'react';
import { mockLeads } from '../data/mockLeads';

const LeadsTable: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Lista de Leads</h2>
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Fuente</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Estado</th>
          </tr>
        </thead>
        <tbody>
          {mockLeads.map((lead) => (
            <tr key={lead.id} className="border-b">
              <td className="p-2 border">{lead.name}</td>
              <td className="p-2 border">{lead.source}</td>
              <td className="p-2 border">{lead.date}</td>
              <td className="p-2 border">{lead.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
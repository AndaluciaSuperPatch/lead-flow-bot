// src/components/ui/CardInfo.tsx
import React from 'react';

interface CardInfoProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

const CardInfo: React.FC<CardInfoProps> = ({ title, value, icon, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 flex items-center ${className}`}>
      {icon && <div className="text-blue-500 text-2xl mr-4">{icon}</div>}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

export default CardInfo;

import React from 'react';

interface ActivityDisplayProps {
  networkName: string;
  activities: string[];
}

const ActivityDisplay: React.FC<ActivityDisplayProps> = ({ networkName, activities }) => {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <h4 className="text-sm font-semibold mb-2">🤖 Actividades del Bot (Últimas horas)</h4>
      <div className="space-y-1">
        {activities.slice(0, 3).map((activity, idx) => (
          <p key={idx} className="text-xs text-gray-700 border-l-2 border-blue-300 pl-2">
            • {activity}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ActivityDisplay;

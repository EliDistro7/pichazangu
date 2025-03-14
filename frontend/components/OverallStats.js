

import React from "react";
import StatsCard from "./StatsCard";

const OverallStats = ({ stats }) => {
  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {stats.map((stat, index) => (
        <div key={index} className="w-full min-w-0">
          <StatsCard
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            iconColor={stat.iconColor}
          />
        </div>
      ))}
    </div>
  );
  
};

export default OverallStats;

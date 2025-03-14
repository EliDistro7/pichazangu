

import React from "react";
import StatsCard from "./StatsCard";

const OverallStats = ({ stats }) => {
  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
};

export default OverallStats;

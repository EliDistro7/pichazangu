import React from "react";
import { Users, BarChart2, HardDrive } from "lucide-react";

const StatsCard = ({ icon: Icon, label, value, iconColor }) => (
  <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-700 transition-colors w-full min-w-[150px] max-w-[300px]">
    <Icon size={20} className={iconColor} />
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

export default StatsCard;

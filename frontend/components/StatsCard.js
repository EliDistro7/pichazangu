import React from "react";
import { Users, BarChart2, HardDrive } from "lucide-react";
const StatsCard = ({ icon: Icon, label, value, iconColor }) => (
  <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-700 transition-colors w-full flex-1 min-w-0">
    <Icon size={20} className={iconColor} />
    <div className="truncate">
      <p className="text-gray-400 text-sm truncate">{label}</p>
      <p className="text-lg font-semibold truncate">{value}</p>
    </div>
  </div>
);


export default StatsCard;



import { Users, Eye } from "lucide-react";

const EventStats = ({ followersCount, viewsCount, onShowFollowers }) => (
  <div className="flex items-center justify-between mb-4">
    <button
      onClick={onShowFollowers}
      className="flex items-center space-x-2 text-sm text-gray-300 hover:underline"
    >
      <Users size={16} />
      <span>{followersCount} Followers</span>
    </button>
    <div className="flex items-center space-x-2 text-sm text-gray-300">
      <Eye size={16} />
      <span>{viewsCount} Views</span>
    </div>
  </div>
);

export default EventStats;
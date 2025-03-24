

import { User2Icon } from "lucide-react";

const FollowersList = ({ followers, loading }) => (
  <div className="bg-gray-700 p-2 rounded-md mt-2">
    {loading ? (
      <p className="text-gray-300 text-sm">Loading followers...</p>
    ) : followers.length > 0 ? (
      <ul className="text-gray-300 text-sm space-y-1">
        {followers.map((follower) => (
          <li key={follower._id} className="flex items-center space-x-2">
            <User2Icon />
            <span>{follower.username}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-300 text-sm">No followers yet.</p>
    )}
  </div>
);

export default FollowersList;
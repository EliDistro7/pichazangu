import { Eye, Edit, Trash2, QrCode, Lock, Globe, MoreVertical } from "lucide-react";
import { useState } from "react";

const EventActionsDropdown = ({
  onView,
  onEdit,
  onDelete,
  onGenerateQR,
  onSetPrivate,
  onToggleVisibility,
  isVisible,
}) => {
  const [password, setPassword] = useState("");

  return (
    <div className="absolute top-2 right-2">
      <button
        onClick={() => onToggleVisibility(!isVisible)}
        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md relative"
      >
        <MoreVertical size={16} className="text-white" />
      </button>
      {isVisible && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-700 rounded-md shadow-lg z-10">
          <button
            onClick={onView}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
          <button
            onClick={onEdit}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
          <button
            onClick={onGenerateQR}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
          >
            <QrCode size={16} />
            <span>Generate QR Code</span>
          </button>
          <div className="p-2">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm bg-gray-600 text-white px-2 py-1 rounded-md mb-2"
            />
            <button
              onClick={() => onSetPrivate(password)}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md"
            >
              <Lock size={16} />
              <span>Set Private</span>
            </button>
          </div>
          <button
            onClick={onToggleVisibility}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
          >
            <Globe size={16} />
            <span>Toggle Visibility</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventActionsDropdown;
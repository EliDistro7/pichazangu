import React, { useEffect, useState } from "react";
import { Bell, XCircle, CheckCircle } from "lucide-react";
import { getNotifications, markNotificationAsRead, deleteNotification } from "actions/notifications";

const NotificationModal = ({ userId, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(userId);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white w-[350px] md:w-[400px] p-4 rounded-lg shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircle size={20} />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-400">No notifications</p>
        ) : (
          <ul className="max-h-[400px] overflow-y-auto space-y-2">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-3 rounded-lg flex items-start justify-between ${
                  notification.read ? "bg-gray-800" : "bg-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <Bell className="text-blue-400 mr-3" size={20} />
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;

import React, { useEffect, useState } from "react";
import { Bell, XCircle, CheckCircle, Eye, Heart, Users, MessageSquare, Film, Mail, Bookmark } from "lucide-react";
import { getNotifications, markNotificationAsRead, deleteNotification } from "actions/notifications";
import Link from "next/link";

const NotificationModal = ({ userId, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [groupedNotifications, setGroupedNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const notificationTypes = [
    "event_follow", 
    "view_event", 
    "like_event", 
    "collaboration_requested", 
    "collaboration_accepted", 
    "media_added", 
    "new_message"
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(userId);
        setNotifications(data);
        processNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const processNotifications = (notificationsData) => {
    // Create a map to store grouped notifications
    const eventGroups = new Map();
    
    // Process each notification
    notificationsData.forEach(notification => {
      const { event, type } = notification;
      
      // Skip if type is not recognized
      if (!notificationTypes.includes(type)) {
        eventGroups.set(`individual_${notification._id}`, {
          ...notification,
          isGrouped: false
        });
        return;
      }
      
      // Create a unique key for grouping
      const groupKey = `${event}_${type}`;
      
      if (!eventGroups.has(groupKey)) {
        // Create a new group with this notification
        eventGroups.set(groupKey, {
          ...notification,
          count: 1,
          isGrouped: true,
          notifications: [notification],
          // Store the original sender name for reference
          originalSender: notification.senderName
        });
      } else {
        // Add to existing group
        const group = eventGroups.get(groupKey);
        group.count += 1;
        group.notifications.push(notification);
        
        // Update to the most recent notification
        if (new Date(notification.createdAt) > new Date(group.createdAt)) {
          group.createdAt = notification.createdAt;
          // We'll keep the original sender name but update other fields
          group.senderName = notification.senderName;
          
          // If this notification has an eventTitle and the group doesn't, update it
          if (notification.eventTitle && !group.eventTitle) {
            group.eventTitle = notification.eventTitle;
          }
        }
      }
    });
    
    // Convert map to array and sort by date (newest first)
    const processed = Array.from(eventGroups.values()).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    setGroupedNotifications(processed);
  };

  const handleMarkAsRead = async (notification) => {
    try {
      if (notification.isGrouped && notification.notifications) {
        // Mark all grouped notifications as read
        const unreadNotifications = notification.notifications.filter(n => !n.read);
        
        for (const n of unreadNotifications) {
          await markNotificationAsRead(n._id);
        }
        
        // Update state for all notifications in the group
        setNotifications(prev => 
          prev.map(n => 
            notification.notifications.some(gn => gn._id === n._id) 
              ? { ...n, read: true } 
              : n
          )
        );
        
        // Update grouped notifications
        setGroupedNotifications(prev => 
          prev.map(n => 
            n._id === notification._id 
              ? { ...n, read: true, notifications: n.notifications.map(gn => ({ ...gn, read: true })) } 
              : n
          )
        );
      } else {
        // Mark individual notification as read
        await markNotificationAsRead(notification._id);
        
        // Update original notifications state
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
        );
        
        // Update grouped notifications state
        setGroupedNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (notification) => {
    try {
      if (notification.isGrouped && notification.notifications) {
        // Delete all notifications in the group
        for (const n of notification.notifications) {
          await deleteNotification(n._id);
        }
        
        // Remove all deleted notifications from state
        setNotifications(prev => 
          prev.filter(n => !notification.notifications.some(gn => gn._id === n._id))
        );
        
        // Remove the group from grouped notifications
        setGroupedNotifications(prev => 
          prev.filter(n => n._id !== notification._id)
        );
      } else {
        // Delete individual notification
        await deleteNotification(notification._id);
        
        // Update original notifications state
        setNotifications(prev => 
          prev.filter(n => n._id !== notification._id)
        );
        
        // Update grouped notifications state
        setGroupedNotifications(prev => 
          prev.filter(n => n._id !== notification._id)
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "event_follow":
        return <Bookmark className="text-purple-400 mr-3" size={20} />;
      case "view_event":
        return <Eye className="text-blue-400 mr-3" size={20} />;
      case "like_event":
        return <Heart className="text-red-400 mr-3" size={20} />;
      case "collaboration_requested":
      case "collaboration_accepted":
        return <Users className="text-green-400 mr-3" size={20} />;
      case "media_added":
        return <Film className="text-yellow-400 mr-3" size={20} />;
      case "new_message":
        return <MessageSquare className="text-indigo-400 mr-3" size={20} />;
      default:
        return <Bell className="text-gray-400 mr-3" size={20} />;
    }
  };

  const renderGroupedMessage = (notification) => {
    const { type, count, originalSender, eventTitle } = notification;
    const eventName = eventTitle ? `"${eventTitle}"` : "your event";
    
    if (count === 1) {
      return notification.message;
    }
    
    switch (type) {
      case "event_follow":
        return `${originalSender} and ${count - 1} other${count > 2 ? 's' : ''} followed ${eventName}.`;
      case "view_event":
        return `${originalSender} and ${count - 1} other${count > 2 ? 's' : ''} viewed ${eventName}.`;
      case "like_event":
        return `${originalSender} and ${count - 1} other${count > 2 ? 's' : ''} liked ${eventName}.`;
      case "collaboration_requested":
        return `${originalSender} and ${count - 1} other${count > 2 ? 's' : ''} requested to collaborate on ${eventName}.`;
      case "collaboration_accepted":
        return `${originalSender} and ${count - 1} other${count > 2 ? 's' : ''} accepted your collaboration request for ${eventName}.`;
      case "media_added":
        return `${count} new media items were added to ${eventName}.`;
      case "new_message":
        return `You have ${count} new messages${eventTitle ? ` about ${eventName}` : ''}.`;
      default:
        return `You have ${count} new notifications of type ${type}${eventTitle ? ` for ${eventName}` : ''}.`;
    }
  };

  const renderNotificationContent = (notification) => {
    // Use eventTitle if available in the notification message
    let message = notification.message;
    if (notification.eventTitle && !message.includes(notification.eventTitle)) {
      // Only append event title if it's not already in the message
      message = notification.isGrouped && notification.count > 1
        ? renderGroupedMessage(notification)
        : message;
    } else if (notification.isGrouped && notification.count > 1) {
      message = renderGroupedMessage(notification);
    }

    return (
      <div className="flex items-center">
        {getNotificationIcon(notification.type)}
        <div>
          <p className="text-sm">{message}</p>
          <span className="text-xs text-gray-400">
            {new Date(notification.createdAt).toLocaleString()}
          </span>
          {notification.eventTitle && (
            <span className="block text-xs text-blue-400 mt-1">
              {notification.eventTitle}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white w-full max-w-md p-4 rounded-lg shadow-lg relative mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircle size={20} />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : groupedNotifications.length === 0 ? (
          <p className="text-center text-gray-400">No notifications</p>
        ) : (
          <ul className="max-h-96 overflow-y-auto space-y-2">
            {groupedNotifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-3 rounded-lg flex items-start justify-between ${
                  notification.read ? "bg-gray-800" : "bg-gray-700"
                }`}
              >
                <Link 
                  href={`/evento/${notification.event}`} 
                  className="flex-1"
                  onClick={() => handleMarkAsRead(notification)}
                >
                  {renderNotificationContent(notification)}
                </Link>

                <div className="flex items-center space-x-2 ml-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification)}
                      className="text-green-400 hover:text-green-300"
                      title="Mark as read"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification)}
                    className="text-red-400 hover:text-red-300"
                    title="Delete"
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
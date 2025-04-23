import React, { useEffect, useState } from "react";
import { Bell, XCircle, CheckCircle, Eye, Heart, Users, MessageSquare, Film, Mail, Bookmark, X, Loader2,
  Clock,
  Trash,
  Check
 } from "lucide-react";
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


  function formatDistanceToNow(date, options = {}) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    // Define time units in seconds
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;
    
    let distance;
    
    if (diffInSeconds < minute) {
      distance = 'just now';
    } else if (diffInSeconds < hour) {
      const minutes = Math.floor(diffInSeconds / minute);
      distance = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < day) {
      const hours = Math.floor(diffInSeconds / hour);
      distance = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (diffInSeconds < week) {
      const days = Math.floor(diffInSeconds / day);
      distance = `${days} day${days > 1 ? 's' : ''}`;
    } else if (diffInSeconds < month) {
      const weeks = Math.floor(diffInSeconds / week);
      distance = `${weeks} week${weeks > 1 ? 's' : ''}`;
    } else if (diffInSeconds < year) {
      const months = Math.floor(diffInSeconds / month);
      distance = `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffInSeconds / year);
      distance = `${years} year${years > 1 ? 's' : ''}`;
    }
    
    return options.addSuffix ? `${distance} ago` : distance;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 text-white w-full max-w-md rounded-xl shadow-2xl relative mx-4 overflow-hidden border border-gray-800 animate-in slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell size={18} className="text-blue-400" />
            <span>Notifications</span>
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/70 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
  
        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 size={30} className="text-blue-400 animate-spin mb-3" />
              <p className="text-gray-400">Loading notifications...</p>
            </div>
          ) : groupedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-800/70 p-4 rounded-full mb-4">
                <Bell size={32} className="text-gray-500" />
              </div>
              <p className="text-gray-400 mb-1">No notifications yet</p>
              <p className="text-gray-500 text-sm">We'll notify you when something happens</p>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto space-y-2 pr-1 -mr-1">
              {groupedNotifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`p-3 rounded-lg flex items-start justify-between transition-all ${
                    notification.read 
                      ? "bg-gray-800/70 border border-gray-800" 
                      : "bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 shadow-md"
                  }`}
                >
                  <Link 
                    href={`/evento/${notification.event}`} 
                    className="flex-1 group"
                    onClick={() => handleMarkAsRead(notification)}
                  >
                    <div className="flex gap-3">
                      {/* Notification type icon */}
                      <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${
                        !notification.read ? "bg-blue-500/20" : "bg-gray-700"
                      }`}>
                        {notification.type === 'like' && <Heart size={14} className="text-pink-400" />}
                        {notification.type === 'comment' && <MessageCircle size={14} className="text-blue-400" />}
                        {notification.type === 'follow' && <UserPlus size={14} className="text-green-400" />}
                        {notification.type === 'invite' && <Calendar size={14} className="text-purple-400" />}
                      </div>
                      
                      {/* Content */}
                      <div>
                        <div className={`text-sm group-hover:text-blue-400 transition-colors ${!notification.read ? "text-white" : "text-gray-300"}`}>
                          {renderNotificationContent(notification)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </Link>
  
                  <div className="flex items-center space-x-1 ml-2 self-start">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-700/70 rounded-full transition-colors"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-700/70 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer with clear all button, only show if there are notifications
        {!loading && groupedNotifications.length > 0 && (
          <div className="p-3 border-t border-gray-800 bg-gray-900/80 flex justify-end">
            <button 
              onClick={() => {
                // Add your clear all logic here
                handleClearAll ? handleClearAll() : null;
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors flex items-center gap-1"
            >
              <Trash size={12} />
              <span>Clear all</span>
            </button>
          </div>
        )}
           */}
      </div>
    </div>
  );
};

export default NotificationModal;
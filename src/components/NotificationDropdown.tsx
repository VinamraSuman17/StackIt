import React from 'react';
import { FaTimes, FaUser, FaComment, FaCheck } from 'react-icons/fa';

interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'mention';
  message: string;
  read: boolean;
  createdAt: string;
  questionId?: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onClose }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return <FaComment className="text-green-600" />;
      case 'comment':
        return <FaComment className="text-blue-600" />;
      case 'mention':
        return <FaUser className="text-purple-600" />;
      default:
        return <FaComment className="text-gray-600" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-black shadow-[8px_8px_0px_#000] z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b-2 border-black bg-yellow-100">
        <h3 className="font-bold text-black">Notifications</h3>
        <button
          onClick={onClose}
          className="text-black hover:text-red-600 transition-colors"
        >
          <FaTimes size={16} />
        </button>
      </div>
      
      {notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <FaCheck size={32} className="mx-auto mb-2 text-gray-400" />
          <p>No notifications yet!</p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-black font-medium">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
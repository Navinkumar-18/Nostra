import { useState, useEffect } from 'react';

let notificationId = 0;

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timer);
  }, [notifications]);

  const showNotification = (message) => {
    const id = notificationId++;
    setNotifications((prev) => [...prev, { id, message }]);
  };

  return { notifications, showNotification };
};

const Notification = ({ notifications }) => {
  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <div key={n.id} className="notification-toast">
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default Notification;

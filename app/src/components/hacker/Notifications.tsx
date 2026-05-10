import { useState, useCallback, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number; // ms, 0 = no auto-dismiss
}

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem = ({ notification, onDismiss }: NotificationItemProps) => {
  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => onDismiss(notification.id), notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      titleColor: "text-emerald-400",
      textColor: "text-emerald-300",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      titleColor: "text-red-400",
      textColor: "text-red-300",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      titleColor: "text-yellow-400",
      textColor: "text-yellow-300",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      titleColor: "text-blue-400",
      textColor: "text-blue-300",
    },
  };

  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-lg border ${config.bgColor} ${config.borderColor} p-4 flex gap-3 animate-in slide-in-from-right-5 fade-in duration-300`}
    >
      <Icon className={`w-5 h-5 ${config.titleColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <h4 className={`text-sm font-cyber ${config.titleColor} mb-1`}>
          {notification.title}
        </h4>
        <p className={`text-xs font-mono-code ${config.textColor}`}>
          {notification.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className={`w-4 h-4 ${config.titleColor}`} />
      </button>
    </div>
  );
};

// Global notification context for easy access
let notificationCallback: ((notification: Notification) => void) | null = null;

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    const fullNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000, // Default 5 seconds
    };
    setNotifications((prev) => [...prev, fullNotification]);
    return id;
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Set global callback for external use
  useEffect(() => {
    notificationCallback = addNotification;
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    dismissNotification,
  };
};

// Helper functions for quick notifications
export const showSuccess = (title: string, message: string, duration = 5000) => {
  if (notificationCallback) {
    notificationCallback({
      type: "success",
      title,
      message,
      duration,
    });
  }
};

export const showError = (title: string, message: string, duration = 5000) => {
  if (notificationCallback) {
    notificationCallback({
      type: "error",
      title,
      message,
      duration,
    });
  }
};

export const showWarning = (title: string, message: string, duration = 5000) => {
  if (notificationCallback) {
    notificationCallback({
      type: "warning",
      title,
      message,
      duration,
    });
  }
};

export const showInfo = (title: string, message: string, duration = 5000) => {
  if (notificationCallback) {
    notificationCallback({
      type: "info",
      title,
      message,
      duration,
    });
  }
};

interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationContainer = ({
  notifications,
  onDismiss,
}: NotificationContainerProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

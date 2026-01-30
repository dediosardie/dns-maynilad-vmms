// Notification Service for creating and managing notifications
export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type?: 'success' | 'info' | 'warning' | 'error';
}

class NotificationService {
  private listeners: ((notification: Notification) => void)[] = [];
  private notificationId = 1000;

  subscribe(listener: (notification: Notification) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') {
    const notification: Notification = {
      id: this.notificationId++,
      title,
      message,
      time: 'Just now',
      unread: true,
      type
    };

    this.listeners.forEach(listener => listener(notification));
  }

  // Helper methods for common notification types
  success(title: string, message: string) {
    this.notify(title, message, 'success');
  }

  error(title: string, message: string) {
    this.notify(title, message, 'error');
  }

  info(title: string, message: string) {
    this.notify(title, message, 'info');
  }

  warning(title: string, message: string) {
    this.notify(title, message, 'warning');
  }
}

export const notificationService = new NotificationService();

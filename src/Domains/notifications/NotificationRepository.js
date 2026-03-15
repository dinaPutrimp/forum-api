class NotificationRepository {
  async addNotification(notification) {
    throw new Error("NOTIFICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getNotificationsByUserId(userId) {
    throw new Error("NOTIFICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async markNotificationAsRead(notificationId, userId) {
    throw new Error("NOTIFICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async markAllNotificationsAsRead(userId) {
    throw new Error("NOTIFICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = NotificationRepository;

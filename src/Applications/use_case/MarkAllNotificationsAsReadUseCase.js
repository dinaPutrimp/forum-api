class MarkAllNotificationsAsReadUseCase {
  constructor({ notificationRepository }) {
    this._notificationRepository = notificationRepository;
  }

  async execute(userId) {
    await this._notificationRepository.markAllNotificationsAsRead(userId);
  }
}

module.exports = MarkAllNotificationsAsReadUseCase;

class GetNotificationUseCase {
  constructor({ notificationRepository }) {
    this._notificationRepository = notificationRepository;
  }

  async execute(userId) {
    const notifications =
      await this._notificationRepository.getNotificationsByUserId(userId);
    return notifications;
  }
}

module.exports = GetNotificationUseCase;

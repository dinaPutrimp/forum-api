class MarkNotificationAsReadUseCase {
  constructor({ notificationRepository }) {
    this._notificationRepository = notificationRepository;
  }

  async execute(notificationId, userId) {
    await this._notificationRepository.markNotificationAsRead(
      notificationId,
      userId
    );
  }
}

module.exports = MarkNotificationAsReadUseCase;

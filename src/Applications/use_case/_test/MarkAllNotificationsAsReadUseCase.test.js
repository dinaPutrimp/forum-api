const NotificationRepository = require("../../../Domains/notifications/NotificationRepository");
const MarkAllNotificationsAsReadUseCase = require("../MarkAllNotificationsAsReadUseCase");

describe("MarkAllNotificationsAsReadUseCase", () => {
  it("should orchestrating the mark all action correctly", async () => {
    // Arrange
    const mockNotifications = [
      {
        is_read: true,
      },
    ];

    const mockNotificationRepository = new NotificationRepository();

    mockNotificationRepository.markAllNotificationsAsRead = jest
      .fn()
      .mockResolvedValue(mockNotifications);

    /** creating use case instance */
    const markNotification = new MarkAllNotificationsAsReadUseCase({
      notificationRepository: mockNotificationRepository,
    });

    // Action
    await markNotification.execute("user-123");

    // Assert — tidak perlu cek return value
    expect(
      mockNotificationRepository.markAllNotificationsAsRead
    ).toBeCalledWith("user-123");
  });
});

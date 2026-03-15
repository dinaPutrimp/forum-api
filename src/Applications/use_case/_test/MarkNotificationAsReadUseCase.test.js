const NotificationRepository = require("../../../Domains/notifications/NotificationRepository");
const MarkNotificationAsReadUseCase = require("../MarkNotificationAsReadUseCase");

describe("MarkNotificationAsReadUseCase", () => {
  it("should orchestrating the mark action correctly", async () => {
    // Arrange
    const mockNotifications = {
      is_read: true,
    };

    const mockNotificationRepository = new NotificationRepository();

    mockNotificationRepository.markNotificationAsRead = jest
      .fn()
      .mockResolvedValue(mockNotifications);

    /** creating use case instance */
    const markNotification = new MarkNotificationAsReadUseCase({
      notificationRepository: mockNotificationRepository,
    });

    // Action
    await markNotification.execute("notification-123", "user-123");

    // Assert — tidak perlu cek return value
    expect(mockNotificationRepository.markNotificationAsRead).toBeCalledWith(
      "notification-123",
      "user-123"
    );
  });
});

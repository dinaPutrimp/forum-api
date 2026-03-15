const NotificationRepository = require("../../../Domains/notifications/NotificationRepository");
const GetNotificationUseCase = require("../GetNotificationUseCase");

describe("GetNotificationUseCase", () => {
  it("shouldn't throw error if notifications is empty", async () => {
    // Arrange
    const mockNotificationRepository = new NotificationRepository();

    /** creating use case instance */
    mockNotificationRepository.getNotificationsByUserId = jest
      .fn()
      .mockResolvedValue([]);

    const getNotifications = new GetNotificationUseCase({
      notificationRepository: mockNotificationRepository,
    });

    const result = await getNotifications.execute("user-123");
    expect(result).toStrictEqual([]);
    expect(mockNotificationRepository.getNotificationsByUserId).toBeCalledWith(
      "user-123"
    );
  });

  it("should orchestrating the get notification action correctly", async () => {
    // Arrange
    const mockNotifications = [
      {
        id: "notification-123",
        type: "reply",
        entity_type: "comment",
        entity_id: "comment-123",
        payload: { threadId: "thread-123" },
        is_read: false,
        created_at: "2024-01-01T00:00:00.000Z",
        actor_username: "john_doe",
      },
    ];

    const mockNotificationRepository = new NotificationRepository();

    mockNotificationRepository.getNotificationsByUserId = jest
      .fn()
      .mockResolvedValue(mockNotifications);

    /** creating use case instance */
    const getNotifications = new GetNotificationUseCase({
      notificationRepository: mockNotificationRepository,
    });

    // Action
    const notifications = await getNotifications.execute("user-123");

    // Assert
    expect(notifications).toStrictEqual(mockNotifications);
    expect(mockNotificationRepository.getNotificationsByUserId).toBeCalledWith(
      "user-123"
    );
  });
});

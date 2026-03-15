const AddedCommentToAThread = require("../../../Domains/comments/entities/AddedCommentToAThread");
const AddCommentToAThread = require("../../../Domains/comments/entities/AddCommentToAThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const NotificationRepository = require("../../../Domains/notifications/NotificationRepository");
const AddCommentToAThreadUseCase = require("../AddCommentToAThreadUseCase");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("AddCommentToAThread", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should throw error if thread is not available", async () => {
    // Arrange
    const useCasePayload = { content: "sabi" };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockNotificationRepository = new NotificationRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockRejectedValue(
        new NotFoundError("ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND")
      );

    /** creating use case instance */
    const addCommentUseCase = new AddCommentToAThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      notificationRepository: mockNotificationRepository,
    });

    // Action
    await expect(
      addCommentUseCase.execute(useCasePayload, "thread-123", "user-123")
    ).rejects.toThrowError(NotFoundError);
  });

  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "sabi",
    };

    const mockAddedCommentToAThread = new AddedCommentToAThread({
      id: "comment-123",
      content: useCasePayload.content,
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockNotificationRepository = new NotificationRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn().mockResolvedValue();
    mockThreadRepository.getThreadOwnerById = jest
      .fn()
      .mockResolvedValue("user-456");
    mockCommentRepository.addCommentToAThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedCommentToAThread));
    mockNotificationRepository.addNotification = jest.fn().mockResolvedValue();

    /** creating use case instance */
    const addCommentUseCase = new AddCommentToAThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      notificationRepository: mockNotificationRepository,
    });

    // Action
    const aComment = await addCommentUseCase.execute(
      useCasePayload,
      "thread-123",
      "user-123"
    );

    // Assert
    expect(aComment).toStrictEqual(
      new AddedCommentToAThread({
        id: "comment-123",
        thread_id: "thread-123",
        content: useCasePayload.content,
        owner: "user-123",
      })
    );

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.addCommentToAThread).toBeCalledWith(
      new AddCommentToAThread({
        content: useCasePayload.content,
      }),
      "thread-123",
      "user-123"
    );
    expect(mockThreadRepository.getThreadOwnerById).toBeCalledWith(
      "thread-123"
    );
    expect(mockNotificationRepository.addNotification).toBeCalledWith({
      recipientId: "user-456",
      actorId: "user-123",
      type: "reply",
      entityType: "comment",
      entityId: "comment-123",
      payload: { threadId: "thread-123" },
    });
  });
});

const CommentLikeRepository = require("../../../Domains/comment-likes/CommentLikeRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ToggleCommentLikeUseCase = require("../ToggleCommentLikeUseCase");

describe("ToggleCommentLikeUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should throw error if param not contain needed property", async () => {
    const useCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: {},
      commentRepository: {},
    });

    await expect(
      useCase.execute("thread-123", null, "owner-123")
    ).rejects.toThrowError(
      "TOGGLE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION"
    );
  });

  it("should delete like when user already like the comment", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue();
    mockCommentLikeRepository.verifyCommentLike = jest
      .fn()
      .mockResolvedValue(true);
    mockCommentLikeRepository.deleteCommentLike = jest.fn().mockResolvedValue();
    mockCommentLikeRepository.addCommentLike = jest.fn();

    /** creating use case instance */
    const toggleLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeUseCase.execute("thread-123", "comment-123", "user-123");

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      "comment-123"
    );
    expect(mockCommentLikeRepository.verifyCommentLike).toHaveBeenCalledWith(
      "comment-123",
      "user-123"
    );
    expect(mockCommentLikeRepository.deleteCommentLike).toHaveBeenCalledWith(
      "comment-123",
      "user-123"
    );
    expect(mockCommentLikeRepository.addCommentLike).not.toHaveBeenCalled();
  });

  it("should add like if user hasn’t liked the comment yet", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue();
    mockCommentLikeRepository.verifyCommentLike = jest
      .fn()
      .mockResolvedValue(false);
    mockCommentLikeRepository.addCommentLike = jest.fn().mockResolvedValue();
    mockCommentLikeRepository.deleteCommentLike = jest.fn();

    const toggleLikeUseCase = new ToggleCommentLikeUseCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeUseCase.execute("thread-123", "comment-123", "user-123");

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      "comment-123"
    );
    expect(mockCommentLikeRepository.verifyCommentLike).toHaveBeenCalledWith(
      "comment-123",
      "user-123"
    );
    expect(mockCommentLikeRepository.addCommentLike).toHaveBeenCalledWith(
      "comment-123",
      "user-123"
    );
    expect(mockCommentLikeRepository.deleteCommentLike).not.toHaveBeenCalled();
  });
});

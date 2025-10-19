const AddedReplyToComment = require("../../../Domains/replies/entities/AddedReplyToComment");
const AddReplyToComment = require("../../../Domains/replies/entities/AddReplyToComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AddReplyToCommentUseCase = require("../AddReplyToCommentUseCase");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("AddReplyToCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should throw error if thread is not available", async () => {
    // Arrange
    const useCasePayload = { content: "sabi" };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockRejectedValue(
        new NotFoundError("ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND")
      );

    /** creating use case instance */
    const addReplyUseCase = new AddReplyToCommentUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(
      addReplyUseCase.execute(
        useCasePayload,
        "thread-123",
        "comment-123",
        "user-123"
      )
    ).rejects.toThrowError(NotFoundError);
  });

  it("should throw error if comment is not available", async () => {
    // Arrange
    const useCasePayload = { content: "sabi" };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockRejectedValue(
        new NotFoundError("ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND")
      );

    /** creating use case instance */
    const addReplyUseCase = new AddReplyToCommentUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(
      addReplyUseCase.execute(
        useCasePayload,
        "thread-123",
        "comment-123",
        "user-123"
      )
    ).rejects.toThrowError(NotFoundError);
  });

  it("should orchestrating the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "sabi",
    };

    const mockAddedReplyToComment = new AddedReplyToComment({
      id: "reply-123",
      content: useCasePayload.content,
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue();
    mockReplyRepository.addReplyToComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReplyToComment));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyToCommentUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const aReply = await addReplyUseCase.execute(
      useCasePayload,
      "thread-123",
      "comment-123",
      "user-123"
    );

    // Assert
    expect(aReply).toStrictEqual(
      new AddedReplyToComment({
        id: "reply-123",
        content: useCasePayload.content,
        owner: "user-123",
      })
    );

    expect(mockReplyRepository.addReplyToComment).toBeCalledWith(
      new AddReplyToComment({
        content: useCasePayload.content,
      }),
      "comment-123",
      "user-123"
    );
  });
});

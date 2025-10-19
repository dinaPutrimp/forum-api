const AddedCommentToAThread = require("../../../Domains/comments/entities/AddedCommentToAThread");
const AddCommentToAThread = require("../../../Domains/comments/entities/AddCommentToAThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
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

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockRejectedValue(new NotFoundError("ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND"));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentToAThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
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

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue();
    mockCommentRepository.addCommentToAThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedCommentToAThread));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentToAThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
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

    expect(mockCommentRepository.addCommentToAThread).toBeCalledWith(
      new AddCommentToAThread({
        content: useCasePayload.content,
      }),
      "thread-123",
      "user-123"
    );
  });
});

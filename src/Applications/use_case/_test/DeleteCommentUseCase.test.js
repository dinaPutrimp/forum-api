const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should throw error if param not contain needed property", async () => {
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(
      deleteCommentUseCase.execute(null, "owner-123")
    ).rejects.toThrowError(
      "DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION"
    );
  });

  it("should throw error if comment not owned by owner", async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyTheCommentOwner = jest
      .fn()
      .mockRejectedValue(
        new Error("DELETE_COMMENT_USE_CASE.NOT_THE_COMMENT_OWNER")
      );

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(
      deleteCommentUseCase.execute("comment-123", "user-123")
    ).rejects.toThrowError("DELETE_COMMENT_USE_CASE.NOT_THE_COMMENT_OWNER");
  });

  it("should orchestrating the delete comment action correctly", async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyTheCommentOwner = jest.fn().mockResolvedValue();
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockResolvedValue({ id: "comment-123" });

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const deletedComment = await deleteCommentUseCase.execute(
      "comment-123",
      "user-123"
    );

    // Assert
    expect(deletedComment).toStrictEqual({ id: "comment-123" });
    expect(mockCommentRepository.verifyTheCommentOwner).toBeCalledWith(
      "comment-123",
      "user-123"
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      "comment-123"
    );
  });
});

const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should throw error if param not contain needed property", async () => {
    const useCase = new DeleteReplyUseCase({ replyRepository: {} });

    await expect(useCase.execute(null, "owner-123")).rejects.toThrowError(
      "DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION"
    );
  });

  it("should throw error if reply not owned by owner", async () => {
    // Arrange
    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.verifyTheReplyOwner = jest
      .fn()
      .mockRejectedValue(
        new Error("DELETE_REPLY_USE_CASE.NOT_THE_COMMENT_OWNER")
      );

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await expect(
      deleteReplyUseCase.execute("reply-123", "user-123")
    ).rejects.toThrowError("DELETE_REPLY_USE_CASE.NOT_THE_COMMENT_OWNER");
  });

  it("should orchestrating the delete reply action correctly", async () => {
    // Arrange
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.verifyTheReplyOwner = jest.fn().mockResolvedValue();
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockResolvedValue({ id: "reply-123" });

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    const deletedReply = await deleteReplyUseCase.execute(
      "reply-123",
      "user-123"
    );

    // Assert
    expect(deletedReply).toStrictEqual({ id: "reply-123" });
    expect(mockReplyRepository.verifyTheReplyOwner).toBeCalledWith(
      "reply-123",
      "user-123"
    );
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith("reply-123");
  });
});

const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.addReplyToComment({})).rejects.toThrowError(
      "REPLY_REPOSITORY.ADD_REPLY_TO_A_COMMENT_METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      replyRepository.getRepliesByCommentId("")
    ).rejects.toThrowError(
      "REPLY_REPOSITORY.GET_REPLIES_BY_COMMENT_ID_METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      replyRepository.verifyTheReplyOwner("", "")
    ).rejects.toThrowError(
      "REPLY_REPOSITORY.VERIFY_THE_REPLY_OWNER_METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.deleteReplyById("")).rejects.toThrowError(
      "REPLY_REPOSITORY.DELETE_REPLY_BY_ID_METHOD_NOT_IMPLEMENTED"
    );
  });
});

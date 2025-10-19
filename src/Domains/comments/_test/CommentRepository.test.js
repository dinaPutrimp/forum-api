const CommentRepository = require("../CommentRepository");

describe("CommentRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(
      commentRepository.addCommentToAThread({})
    ).rejects.toThrowError(
      "COMMENT_REPOSITORY.ADD_COMMENT_TO_A_THREAD_METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.getCommentById("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.GET_COMMENT_BY_ID_METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.verifyTheCommentOwner("", "")
    ).rejects.toThrowError(
      "COMMENT_REPOSITORY.VERIFY_THE_COMMENT_OWNER_METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.deleteCommentById("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.DELETE_COMMENT_BY_ID_METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.getCommentByThreadId("")
    ).rejects.toThrowError(
      "COMMENT_REPOSITORY.GET_COMMENT_BY_THREAD_METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.verifyAvailableComment("")
    ).rejects.toThrowError(
      "COMMENT_REPOSITORY.VERIFY_AVAILABLE_COMMENT_METHOD_NOT_IMPLEMENTED"
    );
  });
});

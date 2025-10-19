const CommentLikeRepository = require("../CommentLikeRepository");

describe("CommentLikeRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action and Assert
    await expect(
      commentLikeRepository.addCommentLike("", "")
    ).rejects.toThrowError(
      "COMMENT_LIKE_REPOSITORY.ADD_COOMENT_LIKE_METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentLikeRepository.deleteCommentLike("", "")
    ).rejects.toThrowError(
      "COMMENT_LIKE_REPOSITORY.DELETE_COMMENT_LIKE_METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentLikeRepository.verifyCommentLike("", "")
    ).rejects.toThrowError(
      "COMMENT_LIKE_REPOSITORY.VERIFY_COMMENT_LIKE_METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentLikeRepository.getLikeCountByCommentId("", "")
    ).rejects.toThrowError(
      "COMMENT_LIKE_REPOSITORY.GET_LIKE_COUNT_METHOD_NOT_IMPLEMENTED"
    );
  });
});

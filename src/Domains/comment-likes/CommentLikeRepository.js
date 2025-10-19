class CommentLikeRepository {
  async verifyCommentLike(_commentId, _userId) {
    throw new Error(
      "COMMENT_LIKE_REPOSITORY.VERIFY_COMMENT_LIKE_METHOD_NOT_IMPLEMENTED"
    );
  }

  async deleteCommentLike(_commentId, _userId) {
    throw new Error(
      "COMMENT_LIKE_REPOSITORY.DELETE_COMMENT_LIKE_METHOD_NOT_IMPLEMENTED"
    );
  }

  async addCommentLike(_commentId, _userId) {
    throw new Error(
      "COMMENT_LIKE_REPOSITORY.ADD_COOMENT_LIKE_METHOD_NOT_IMPLEMENTED"
    );
  }

  async getLikeCountByCommentId(_commentId) {
    throw new Error(
      "COMMENT_LIKE_REPOSITORY.GET_LIKE_COUNT_METHOD_NOT_IMPLEMENTED"
    );
  }
}

module.exports = CommentLikeRepository;

class CommentRepository {
  async addCommentToAThread(_comment, _threadId, _owner) {
    throw new Error(
      "COMMENT_REPOSITORY.ADD_COMMENT_TO_A_THREAD_METHOD_NOT_IMPLEMENTED"
    );
  }

  async getCommentById(_commentId) {
    throw new Error(
      "COMMENT_REPOSITORY.GET_COMMENT_BY_ID_METHOD_NOT_IMPLEMENTED"
    );
  }

  async verifyTheCommentOwner(_commentId, _owner) {
    throw new Error(
      "COMMENT_REPOSITORY.VERIFY_THE_COMMENT_OWNER_METHOD_NOT_IMPLEMENTED"
    );
  }

  async deleteCommentById(_commentId) {
    throw new Error(
      "COMMENT_REPOSITORY.DELETE_COMMENT_BY_ID_METHOD_NOT_IMPLEMENTED"
    );
  }

  async getCommentByThreadId(_threadId) {
    throw new Error(
      "COMMENT_REPOSITORY.GET_COMMENT_BY_THREAD_METHOD_NOT_IMPLEMENTED"
    );
  }

  async verifyAvailableComment(_commentId) {
    throw new Error("COMMENT_REPOSITORY.VERIFY_AVAILABLE_COMMENT_METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentRepository;

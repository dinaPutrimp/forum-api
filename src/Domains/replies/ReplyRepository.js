class ReplyRepository {
  async verifyTheReplyOwner(_replyId, _owner) {
    throw new Error(
      "REPLY_REPOSITORY.VERIFY_THE_REPLY_OWNER_METHOD_NOT_IMPLEMENTED"
    );
  }

  async addReplyToComment(_commentId) {
    throw new Error(
      "REPLY_REPOSITORY.ADD_REPLY_TO_A_COMMENT_METHOD_NOT_IMPLEMENTED"
    );
  }

  async deleteReplyById(_replyId) {
    throw new Error(
      "REPLY_REPOSITORY.DELETE_REPLY_BY_ID_METHOD_NOT_IMPLEMENTED"
    );
  }
  
  async getRepliesByCommentId(_commentId) {
    throw new Error(
      "REPLY_REPOSITORY.GET_REPLIES_BY_COMMENT_ID_METHOD_NOT_IMPLEMENTED"
    );
  }
}

module.exports = ReplyRepository;

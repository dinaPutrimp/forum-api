class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, owner) {
    this._verifyPayload(commentId, owner);
    await this._commentRepository.verifyTheCommentOwner(commentId, owner);
    const deletedComment = await this._commentRepository.deleteCommentById(commentId);
    return deletedComment
  }

  _verifyPayload(commentId, owner) {
    if (!commentId || !owner) {
      throw new Error("DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION");
    }
  }
}

module.exports = DeleteCommentUseCase;

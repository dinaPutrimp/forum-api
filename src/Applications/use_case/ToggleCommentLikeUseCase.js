class ToggleCommentLikeUseCase {
  constructor({ commentLikeRepository, threadRepository, commentRepository }) {
    this._commentLikeRepository = commentLikeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, userId) {
    this._verifyPayload(threadId, commentId, userId);
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._commentRepository.verifyAvailableComment(commentId);
    const isLiked = await this._commentLikeRepository.verifyCommentLike(
      commentId,
      userId
    );

    if (isLiked) {
      await this._commentLikeRepository.deleteCommentLike(commentId, userId);
    } else await this._commentLikeRepository.addCommentLike(commentId, userId);
  }

  _verifyPayload(threadId, commentId, userId) {
    if (!threadId || !commentId || !userId) {
      throw new Error(
        "TOGGLE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION"
      );
    }
  }
}

module.exports = ToggleCommentLikeUseCase;

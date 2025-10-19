class DetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(threadId) {
    this._verifyPayload(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThreadId(
      threadId
    );

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(
          comment.id
        );
        const likeCount =
          await this._commentLikeRepository.getLikeCountByCommentId(comment.id);
        const _replies = replies.map((reply) => ({
          ...reply,
          content: reply.is_delete
            ? "**balasan telah dihapus**"
            : reply.content,
        }));
        return {
          ...comment,
          content: comment.is_delete
            ? "**komentar telah dihapus**"
            : comment.content,
          likeCount,
          replies: _replies,
        };
      })
    );

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: commentsWithReplies,
    };
  }

  _verifyPayload(threadId) {
    if (!threadId) {
      throw new Error("DETAIL_THREAD_USE_CASE.THREAD_NOT_FOUND");
    }
  }
}

module.exports = DetailThreadUseCase;

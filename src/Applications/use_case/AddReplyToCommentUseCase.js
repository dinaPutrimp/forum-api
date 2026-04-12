const AddReplyToComment = require("../../Domains/replies/entities/AddReplyToComment");
const AddedReplyToComment = require("../../Domains/replies/entities/AddedReplyToComment");

class AddReplyToCommentUseCase {
  constructor({
    replyRepository,
    commentRepository,
    threadRepository,
    notificationRepository,
  }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._notificationRepository = notificationRepository;
  }

  async execute(useCasePayload, threadId, commentId, owner) {
    const reply = new AddReplyToComment(useCasePayload);

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);

    const addedReply = await this._replyRepository.addReplyToComment(
      reply,
      commentId,
      owner
    );
    const comment = await this._commentRepository.getCommentById(commentId);

    if (comment.owner !== owner) {
      await this._notificationRepository.addNotification({
        recipientId: comment.owner,
        actorId: owner,
        type: "reply",
        entityType: "reply",
        entityId: addedReply.id,
        payload: { commentId, threadId },
      });
    }

    return new AddedReplyToComment(addedReply);
  }
}

module.exports = AddReplyToCommentUseCase;

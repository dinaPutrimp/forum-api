const AddCommentToAThread = require("../../Domains/comments/entities/AddCommentToAThread");
const AddedCommentToAThread = require("../../Domains/comments/entities/AddedCommentToAThread");

class AddCommentToAThreadUseCase {
  constructor({ commentRepository, threadRepository, notificationRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._notificationRepository = notificationRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    await this._threadRepository.verifyAvailableThread(threadId);

    const comment = new AddCommentToAThread(useCasePayload);

    const addedComment = await this._commentRepository.addCommentToAThread(
      comment,
      threadId,
      owner
    );
    const threadOwner = await this._threadRepository.getThreadOwnerById(
      threadId
    );

    if (threadOwner !== owner) {
      await this._notificationRepository.addNotification({
        recipientId: threadOwner,
        actorId: owner,
        type: "reply",
        entityType: "comment",
        entityId: addedComment.id,
        payload: { threadId },
      });
    }

    return new AddedCommentToAThread(addedComment);
  }
}

module.exports = AddCommentToAThreadUseCase;

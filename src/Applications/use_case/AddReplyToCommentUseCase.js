const AddReplyToComment = require("../../Domains/replies/entities/AddReplyToComment");
const AddedReplyToComment = require("../../Domains/replies/entities/AddedReplyToComment");

class AddReplyToCommentUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
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

    return new AddedReplyToComment(addedReply);
  }
}

module.exports = AddReplyToCommentUseCase;

const AddCommentToAThread = require("../../Domains/comments/entities/AddCommentToAThread");
const AddedCommentToAThread = require("../../Domains/comments/entities/AddedCommentToAThread");

class AddCommentToAThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    await this._threadRepository.verifyAvailableThread(threadId);
    
    const comment = new AddCommentToAThread(useCasePayload);

    const addedComment = await this._commentRepository.addCommentToAThread(
      comment,
      threadId,
      owner
    );
    return new AddedCommentToAThread(addedComment);
  }
}

module.exports = AddCommentToAThreadUseCase;

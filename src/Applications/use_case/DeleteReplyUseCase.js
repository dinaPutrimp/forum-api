class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(replyId, owner) {
    this._verifyPayload(replyId, owner);
    await this._replyRepository.verifyTheReplyOwner(replyId, owner);
    const deletedReply = await this._replyRepository.deleteReplyById(replyId);
    return deletedReply;
  }

  _verifyPayload(replyId, owner) {
    if (!replyId || !owner) {
      throw new Error("DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION");
    }
  }
}

module.exports = DeleteReplyUseCase;

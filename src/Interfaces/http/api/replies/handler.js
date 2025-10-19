const AddReplyToCommentUseCase = require("../../../../Applications/use_case/AddReplyToCommentUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addReplyToCommentUseCase = this._container.getInstance(
      AddReplyToCommentUseCase.name
    );
    const addedReply = await addReplyToCommentUseCase.execute(
      request.payload,
      threadId,
      commentId,
      credentialId
    );

    const response = h.response({
      status: "success",
      data: {
        addedReply: {
          id: addedReply.id,
          content: addedReply.content,
          owner: addedReply.owner,
        },
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { replyId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    await deleteReplyUseCase.execute(replyId, credentialId);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;

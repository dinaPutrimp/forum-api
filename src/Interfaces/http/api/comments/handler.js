const AddCommentToAThreadUseCase = require("../../../../Applications/use_case/AddCommentToAThreadUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addCommentToAThreadUseCase = this._container.getInstance(
      AddCommentToAThreadUseCase.name
    );
    const addedComment = await addCommentToAThreadUseCase.execute(
      request.payload,
      threadId,
      credentialId
    );

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    await deleteCommentUseCase.execute(commentId, credentialId);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;

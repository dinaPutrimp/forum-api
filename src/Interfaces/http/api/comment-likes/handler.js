const ToggleCommentLikeUseCase = require("../../../../Applications/use_case/ToggleCommentLikeUseCase");

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.toggleLikeCommentHandler = this.toggleLikeCommentHandler.bind(this);
  }

  async toggleLikeCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const toggleLikeUseCase = this._container.getInstance(
      ToggleCommentLikeUseCase.name
    );
    await toggleLikeUseCase.execute(threadId, commentId, credentialId);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentLikesHandler;

class AddCommentToAThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error("ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION");
    }
    
    if (typeof content !== "string") {
      throw new Error("ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddCommentToAThread;

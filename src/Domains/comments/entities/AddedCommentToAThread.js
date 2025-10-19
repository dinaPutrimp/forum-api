class AddedCommentToAThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error(
        "ADDED_COMMENT_TO_A_THREAD.PAYLOAD_NOT_MEET_SPECIFICATION"
      );
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error(
        "ADDED_COMMENT_TO_A_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

module.exports = AddedCommentToAThread;

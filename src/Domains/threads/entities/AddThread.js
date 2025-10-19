class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  _verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error("ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION");
    }
    
    if (typeof title !== "string" || typeof body !== "string") {
      throw new Error("ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddThread;

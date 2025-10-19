const AddedReplyToComment = require("../AddedReplyToComment");

describe("a AddedReplyToComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      owner: "user-123"
    };

    // Action and Assert
    expect(() => new AddedReplyToComment(payload)).toThrowError(
      "ADDED_REPLY_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: 123,
      owner: "user-123"
    };

    // Action and Assert
    expect(() => new AddedReplyToComment(payload)).toThrowError(
      "ADDED_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addedReplyToComment object correctly", () => {
    // Arrange
    const payload = {
      id: "reply-1263839",
      content: "sabi nder",
      owner: "user-192837",
    };

    // Action
    const addedReplyToComment = new AddedReplyToComment(payload);

    // Assert
    expect(addedReplyToComment.id).toEqual(payload.id);
    expect(addedReplyToComment.content).toEqual(payload.content);
    expect(addedReplyToComment.owner).toEqual(payload.owner);
  });
});

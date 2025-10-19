const AddReplyToComment = require("../AddReplyToComment");

describe("a AddReplyToComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddReplyToComment(payload)).toThrowError(
      "ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new AddReplyToComment(payload)).toThrowError(
      "ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addReplyToComment object correctly", () => {
    // Arrange
    const payload = {
      content: "sabi nder",
    };

    // Action
    const { content } = new AddReplyToComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});

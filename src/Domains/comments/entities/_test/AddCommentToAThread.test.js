const AddCommentToAThread = require("../AddCommentToAThread");

describe("a AddCommentToAThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddCommentToAThread(payload)).toThrowError(
      "ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new AddCommentToAThread(payload)).toThrowError(
      "ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addCommentToAThread object correctly", () => {
    // Arrange
    const payload = {
      content: "sabi nder",
    };

    // Action
    const { content } = new AddCommentToAThread(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});

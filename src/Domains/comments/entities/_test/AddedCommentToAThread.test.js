const AddedCommentToAThread = require("../AddedCommentToAThread");

describe("a AddCommentToAThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      owner: "user-123"
    };

    // Action and Assert
    expect(() => new AddedCommentToAThread(payload)).toThrowError(
      "ADDED_COMMENT_TO_A_THREAD.PAYLOAD_NOT_MEET_SPECIFICATION"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: 123,
      owner: "user-123"
    };

    // Action and Assert
    expect(() => new AddedCommentToAThread(payload)).toThrowError(
      "ADDED_COMMENT_TO_A_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addedCommentToAThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-1263839",
      content: "sabi nder",
      owner: "user-192837",
    };

    // Action
    const addedCommentToAThread = new AddedCommentToAThread(payload);

    // Assert
    expect(addedCommentToAThread.id).toEqual(payload.id);
    expect(addedCommentToAThread.content).toEqual(payload.content);
    expect(addedCommentToAThread.owner).toEqual(payload.owner);
  });
});

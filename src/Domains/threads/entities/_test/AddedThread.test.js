const AddedThread = require("../AddedThread");

describe("a AddedThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      body: "sorry kalo berantakan karena ini pertama kali aku buat thread",
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.PAYLOAD_NOT_MEET_SPECIFICATION"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: 123,
      body: "sorry kalo berantakan karena ini pertama kali aku buat thread",
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addedThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-1263839",
      title: "a thread",
      owner: "user-192837",
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});

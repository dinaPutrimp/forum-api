const AddThread = require("../AddThread");

describe("a AddThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      //   title: "a thread",
      body: "sorry kalo berantakan karena ini pertama kali aku buat thread",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      title: 123,
      body: "sorry kalo berantakan karena ini pertama kali aku buat thread",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addThread object correctly", () => {
    // Arrange
    const payload = {
      title: "a thread",
      body: "sorry kalo berantakan karena ini pertama kali aku buat thread",
    };

    // Action
    const { title, body } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});

const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "a Thread",
      body: "pesut",
    };

    const mockAddedThread = new AddedThread({
      id: "thread-123",
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const aThread = await getThreadUseCase.execute(useCasePayload, "user-123");

    // Assert
    expect(aThread).toStrictEqual(
      new AddedThread({
        id: "thread-123",
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: "user-123",
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
      "user-123"
    );
  });
});

const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadsByUserUseCase = require("../GetThreadsByUserUseCase");

describe("GetAllThreadsUseCase", () => {
  it("should GetThreadsByUserUseCase the list threads action correctly", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadsByUser = jest.fn().mockResolvedValue([
      {
        id: "thread-123",
        title: "a thread",
        body: "pesut",
        date: "2025-10-12T00:00:00.000Z",
        username: "dicoding",
      },
    ]);

    /** creating use case instance */
    const getThreadsByUserUseCase = new GetThreadsByUserUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threads = await getThreadsByUserUseCase.execute("user-123"); // ← perlu userId

    expect(mockThreadRepository.getThreadsByUser).toBeCalledWith("user-123");
    expect(threads).toStrictEqual([
      {
        id: "thread-123",
        title: "a thread",
        body: "pesut",
        date: "2025-10-12T00:00:00.000Z",
        username: "dicoding",
      },
    ]);
  });
});

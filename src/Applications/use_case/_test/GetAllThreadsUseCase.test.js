const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetAllThreadsUseCase = require("../GetAllThreadsUseCase");

describe("GetAllThreadsUseCase", () => {
  it("should orchestrating the list threads action correctly", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getAllThreads = jest.fn().mockResolvedValue([
      {
        id: "thread-123",
        title: "a thread",
        body: "pesut",
        date: "2025-10-12T00:00:00.000Z",
        username: "dicoding",
        comment_count: 0,
      },
    ]);

    /** creating use case instance */
    const getAllThreadsUseCase = new GetAllThreadsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const getAllThreads = await getAllThreadsUseCase.execute();

    // Assert
    expect(mockThreadRepository.getAllThreads).toBeCalled();
    expect(getAllThreads).toStrictEqual([
      {
        id: "thread-123",
        title: "a thread",
        body: "pesut",
        date: "2025-10-12T00:00:00.000Z",
        username: "dicoding",
        comment_count: 0,
      },
    ]);
  });
});

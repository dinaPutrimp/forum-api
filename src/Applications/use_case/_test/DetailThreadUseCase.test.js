const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const CommentLikeRepository = require("../../../Domains/comment-likes/CommentLikeRepository");
const DetailThreadUseCase = require("../DetailThreadUseCase");

describe("DetailThreadUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should throw error if thread not found", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new Error("DETAIL_THREAD_USE_CASE.THREAD_NOT_FOUND"))
      );

    /** creating use case instance */
    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await expect(
      detailThreadUseCase.execute("thread-123")
    ).rejects.toThrowError("DETAIL_THREAD_USE_CASE.THREAD_NOT_FOUND");
  });

  it("should orchestrating the detail thread action correctly", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue({
      id: "thread-123",
      title: "a thread",
      body: "pesut",
      date: "2025-10-12T00:00:00.000Z",
      username: "dicoding",
    });
    mockCommentRepository.getCommentByThreadId = jest.fn().mockResolvedValue([
      {
        id: "comment-123",
        username: "johndoe",
        date: "2025-10-12T01:00:00.000Z",
        content: "SABI",
      },
    ]);
    mockReplyRepository.getRepliesByCommentId = jest.fn().mockResolvedValue([
      {
        id: "reply-123",
        content: "beneran",
        date: "2025-11-08T07:59:48.766Z",
        username: "aya",
      },
    ]);
    mockCommentLikeRepository.getLikeCountByCommentId = jest
      .fn()
      .mockResolvedValue(0);

    /** creating use case instance */
    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const detailThread = await detailThreadUseCase.execute("thread-123");

    // Assert
    expect(detailThread).toStrictEqual({
      id: "thread-123",
      title: "a thread",
      body: "pesut",
      date: "2025-10-12T00:00:00.000Z",
      username: "dicoding",
      comments: [
        {
          id: "comment-123",
          username: "johndoe",
          date: "2025-10-12T01:00:00.000Z",
          content: "SABI",
          likeCount: 0,
          replies: [
            {
              id: "reply-123",
              content: "beneran",
              date: "2025-11-08T07:59:48.766Z",
              username: "aya",
            },
          ],
        },
      ],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
      "thread-123"
    );
  });
});

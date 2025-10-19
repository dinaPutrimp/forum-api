const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const AddCommentToAThread = require("../../../Domains/comments/entities/AddCommentToAThread");
const AddedCommentToAThread = require("../../../Domains/comments/entities/AddedCommentToAThread");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyTheCommentOwner function", () => {
    it("should throw AuthorizationError when comment not owned by owner", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "demo",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addCommentToAThread({
        id: "comment-123",
        content: "sabi",
        threadId: "thread-123",
        owner: "user-456",
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyTheCommentOwner(
          "comment-123",
          "user-123"
        )
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw InvariantError when comment exists", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addCommentToAThread({ id: "comment-123" });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyTheCommentOwner(
          "comment-123",
          "user-123"
        )
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("addCommentToAThread function", () => {
    it("should persist add comment and return added comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        title: "a thread",
        body: "pesut",
      });
      const aComment = new AddCommentToAThread({ content: "sabi" });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addCommentToAThread(
        aComment,
        "thread-123",
        "user-123"
      );

      // Assert
      const comments = await CommentsTableTestHelper.getCommentById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        title: "a thread",
        body: "pesut",
      });
      const aComment = new AddCommentToAThread({ content: "sabi" });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const comment = await commentRepositoryPostgres.addCommentToAThread(
        aComment,
        "thread-123",
        "user-123"
      );

      // Assert
      expect(comment).toStrictEqual(
        new AddedCommentToAThread({
          id: "comment-123",
          content: "sabi",
          owner: "user-123",
        })
      );
    });
  });

  describe("getCommentById function", () => {
    it("should throw InvariantError when comment not found", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(
        commentRepositoryPostgres.getCommentById("comment-124")
      ).rejects.toThrowError(InvariantError);
    });

    it("should return comment correctly when found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        title: "a thread",
        body: "pesut",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addCommentToAThread({
        id: "comment-123",
        content: "sabi",
        threadId: "thread-123",
        owner: "user-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentById(
        "comment-123"
      );

      // Assert
      expect(comment).toStrictEqual({
        id: "comment-123",
        content: "sabi",
        owner: "user-123",
      });
    });
  });

  describe("getCommentByThreadId function", () => {
    it("should return comments correctly when found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        title: "a thread",
        body: "pesut",
        owner: "user-123",
      });

      const date = new Date("2025-10-13T00:00:00.000Z");
      await CommentsTableTestHelper.addCommentToAThread({
        id: "comment-123",
        content: "sabi",
        threadId: "thread-123",
        owner: "user-123",
        date,
        is_delete: false,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        "thread-123"
      );

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual(
        {
          id: "comment-123",
          username: "dicoding",
          content: "sabi",
          date: expect.any(Date),
          is_delete: false,
        },
      );
    });
  });

  describe("deleteCommentById function", () => {
    it("should soft delete comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        title: "a thread",
        body: "pesut",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addCommentToAThread({
        id: "comment-123",
        content: "sabi",
        threadId: "thread-123",
        owner: "user-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.verifyTheCommentOwner(
        "comment-123",
        "user-123"
      );
      await commentRepositoryPostgres.deleteCommentById("comment-123");

      // Assert
      const commentAfterDelete = await CommentsTableTestHelper.getCommentById(
        "comment-123"
      );
      expect(commentAfterDelete[0].is_delete).toBe(true);
    });
  });

  describe("verifyAvailableComment function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment("comment-124")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when comment exists", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addCommentToAThread({ id: "comment-123" });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment("comment-123")
      ).resolves.not.toThrowError(InvariantError);
    });
  });
});

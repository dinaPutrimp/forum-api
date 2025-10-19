const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const AddReplyToComment = require("../../../Domains/replies/entities/AddReplyToComment");
const AddedReplyToComment = require("../../../Domains/replies/entities/AddedReplyToComment");

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyTheReplyOwner function", () => {
    it("should throw AuthorizationError when reply not owned by owner", async () => {
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
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReplyToComment({
        id: "reply-123",
        content: "sabi",
        commentId: "comment-123",
        owner: "user-123",
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyTheReplyOwner("reply-123", "user-456")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw InvariantError when reply exists", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addCommentToAThread({ id: "comment-123" });
      await RepliesTableTestHelper.addReplyToComment({ id: "reply-123" });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyTheReplyOwner("reply-123", "user-123")
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("addReplyToComment function", () => {
    it("should persist add reply and return added reply correctly", async () => {
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
      await CommentsTableTestHelper.addCommentToAThread({
        id: "comment-123",
        content: "sabi",
        owner: "user-123",
      });
      const aReply = new AddReplyToComment({ content: "sabi" });
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReplyToComment(
        aReply,
        "comment-123",
        "user-123"
      );

      // Assert
      const reply = await RepliesTableTestHelper.getReplyById("reply-123");
      expect(reply).toBeDefined();
      expect(reply.id).toBe("reply-123");
    });

    it("should return added reply correctly", async () => {
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
      await CommentsTableTestHelper.addCommentToAThread({
        id: "comment-123",
        content: "sabi",
        owner: "user-123",
      });
      const aReply = new AddReplyToComment({ content: "sabi" });
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const reply = await replyRepositoryPostgres.addReplyToComment(
        aReply,
        "comment-123",
        "user-123"
      );

      // Assert
      expect(reply).toStrictEqual(
        new AddedReplyToComment({
          id: "reply-123",
          content: "sabi",
          owner: "user-123",
        })
      );
    });
  });

  describe("getReplyById function", () => {
    it("should throw NotFoundError when reply not found", async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(
        replyRepositoryPostgres.getReplyById("reply-124")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return reply correctly when found", async () => {
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
      await RepliesTableTestHelper.addReplyToComment({
        id: "reply-123",
        content: "sabi",
        commentId: "comment-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const reply = await replyRepositoryPostgres.getReplyById("reply-123");

      // Assert
      expect(reply).toStrictEqual({
        id: "reply-123",
        content: "sabi",
        comment_id: "comment-123",
        date: expect.any(Date),
        owner: "user-123",
      });
    });
  });

  describe("deleteReplyById function", () => {
    it("should soft delete reply correctly", async () => {
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
      await RepliesTableTestHelper.addReplyToComment({
        id: "reply-123",
        content: "beneran",
        commentId: "comment-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.verifyTheReplyOwner(
        "reply-123",
        "user-123"
      );
      await replyRepositoryPostgres.deleteReplyById("reply-123");

      // Assert
      const replyAfterDelete = await RepliesTableTestHelper.getReplyById(
        "reply-123"
      );
      expect(replyAfterDelete.is_delete).toBe(true);
    });
  });

  describe("getReplyByCommentId function", () => {
    it("should return replies correctly when found", async () => {
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
      const date = new Date("2025-10-13T00:00:00.000Z");
      await RepliesTableTestHelper.addReplyToComment({
        id: "reply-123",
        content: "sabi",
        commentId: "comment-123",
        owner: "user-123",
        date,
        is_delete: false
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId("comment-123");

      // Assert
      expect(replies).toHaveLength(1)
      expect(replies[0]).toStrictEqual({
        id: "reply-123",
        content: "sabi",
        date: expect.any(Date),
        username: "dicoding",
        is_delete: false
      });
    });
  });
});

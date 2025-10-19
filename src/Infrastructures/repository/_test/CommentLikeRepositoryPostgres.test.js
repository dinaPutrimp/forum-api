const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentLikesTableTestHelper = require("../../../../tests/CommentLikesTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentLikeRepositoryPostgres = require("../CommentLikeRepositoryPostgres");

describe("CommentLikeRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyCommentLike function", () => {
    it("should return false when like not found, and true when like exists", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addCommentToAThread({ id: "comment-123" });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => "123"
      );

      // Action: belum ada like
      const notLiked = await commentLikeRepositoryPostgres.verifyCommentLike(
        "comment-123",
        "user-123"
      );

      // Add like
      await CommentLikesTableTestHelper.addCommentLike({
        commentId: "comment-123",
        userId: "user-123",
      });

      // Action: sudah ada like
      const liked = await commentLikeRepositoryPostgres.verifyCommentLike(
        "comment-123",
        "user-123"
      );

      // Assert
      expect(notLiked).toBe(false);
      expect(liked).toBe(true);
    });
  });

  describe("addCommentLike function", () => {
    it("should return correctly when like comment", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await UsersTableTestHelper.addUser({
        id: "user-124",
        username: "demo",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addCommentToAThread({ id: "comment-123" });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => "123"
      );

      // Action
      await commentLikeRepositoryPostgres.addCommentLike(
        "comment-123",
        "user-124"
      );

      // Assert
      const likes = await commentLikeRepositoryPostgres.getLikeCountByCommentId(
        "comment-123"
      );
      expect(likes).toEqual(1);
    });
  });

  describe("deleteCommentLike function", () => {
    it("should return correctly when delete like", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await UsersTableTestHelper.addUser({
        id: "user-124",
        username: "demo",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addCommentToAThread({ id: "comment-123" });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => "123"
      );

      // Action
      await commentLikeRepositoryPostgres.addCommentLike(
        "comment-123",
        "user-124"
      );
      await commentLikeRepositoryPostgres.deleteCommentLike(
        "comment-123",
        "user-124"
      );

      // Assert
      const likes = await commentLikeRepositoryPostgres.getLikeCountByCommentId(
        "comment-123"
      );
      expect(likes).toEqual(0);
    });
  });

  describe("getLikeCountByCommentId function", () => {
    it("should return correctly when count like", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await UsersTableTestHelper.addUser({
        id: "user-124",
        username: "demo",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addCommentToAThread({ id: "comment-123" });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => "123"
      );

      // Action
      await commentLikeRepositoryPostgres.addCommentLike(
        "comment-123",
        "user-124"
      );

      // Assert
      const likes = await commentLikeRepositoryPostgres.getLikeCountByCommentId(
        "comment-123"
      );
      expect(likes).toEqual(1);
    });
  });
});

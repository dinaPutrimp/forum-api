const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyAvailableThread function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("thread-124")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread exists", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("thread-123")
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("addThread function", () => {
    it("should persist add thread and return added thread correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const aThread = new AddThread({
        title: "a thread",
        body: "pesut",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(aThread, "user-123");

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const aThread = new AddThread({
        title: "a thread",
        body: "pesut",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const thread = await threadRepositoryPostgres.addThread(
        aThread,
        "user-123"
      );

      // Assert
      expect(thread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "a thread",
          owner: "user-123",
        })
      );
    });
  });

  describe("getThreadById function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(
        threadRepositoryPostgres.getThreadById("thread-124")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return thread correctly when found", async () => {
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
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById("thread-123");

      // Assert
      expect(thread).toStrictEqual({
        id: "thread-123",
        title: "a thread",
        body: "pesut",
        date: expect.any(Date),
        username: "dicoding",
      });
    });
  });
});

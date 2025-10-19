const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentLikesTableTestHelper = require("../../../../tests/CommentLikesTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/likes endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should response 200 and persisted like", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "demo",
          password: "secret",
          fullname: "demo dicoding",
        },
      });

      const demoResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "demo",
          password: "secret",
        },
      });

      const { accessToken } = JSON.parse(loginResponse.payload).data;
      const { accessToken: demoAccessToken } = JSON.parse(demoResponse.payload).data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "a thread",
          body: "pesut",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadResponse = JSON.parse(thread.payload);
      const threadId = threadResponse.data.addedThread.id;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "sabi",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentResponse = JSON.parse(comment.payload);
      const commentId = commentResponse.data.addedComment.id;

      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${demoAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});

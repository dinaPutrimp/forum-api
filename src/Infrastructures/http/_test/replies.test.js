const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper")
const container = require("../../container");
const createServer = require("../createServer");

describe("/replies endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable()
  });

  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should response 201 and persisted reply", async () => {
      // Arrange
      const requestPayload = {
        content: "beneran?",
      };
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

      const { accessToken } = JSON.parse(loginResponse.payload).data;

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
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};
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

      const { accessToken } = JSON.parse(loginResponse.payload).data;
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
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat menambahkan balasan karena properti yang dibutuhkan tidak sesuai"
      );
    });

    it("should response 404 when the comment not found", async () => {
      // Arrange
      const requestPayload = {
        content: "sabi",
      };
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

      const { accessToken } = JSON.parse(loginResponse.payload).data;
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

      await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "sabi",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/comment-987/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat menambahkan balasan karena komentar tidak valid"
      );
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    it("should response 200 and deleted reply", async () => {
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

      const { accessToken } = JSON.parse(loginResponse.payload).data;

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
        payload: { content: "sabi" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentResponse = JSON.parse(comment.payload);
      const commentId = commentResponse.data.addedComment.id;

      const reply = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: "beneran?" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const replyResponse = JSON.parse(reply.payload);
      const replyId = replyResponse.data.addedReply.id;

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toBeUndefined();
    });

    it("should response 403 when comment not owned by user", async () => {
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

      const { accessToken } = JSON.parse(loginResponse.payload).data;

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

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "demo",
          password: "secret",
          fullname: "demo forum",
        },
      });

      const demoLoginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "demo",
          password: "secret",
        },
      });

      const { accessToken: demoToken } = JSON.parse(
        demoLoginResponse.payload
      ).data;

      const commentResponse = JSON.parse(comment.payload);
      const commentId = commentResponse.data.addedComment.id;

      const reply = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: "beneran?" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const replyResponse = JSON.parse(reply.payload);
      const replyId = replyResponse.data.addedReply.id;

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${demoToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 404 when comment not found", async () => {
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

      const { accessToken } = JSON.parse(loginResponse.payload).data;

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
        payload: { content: "sabi" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentResponse = JSON.parse(comment.payload);
      const commentId = commentResponse.data.addedComment.id;

      await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: "beneran?" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-124`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });
  });
});

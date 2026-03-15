const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotificationTableTestHelper = require("../../../../tests/NotificationTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/notifications endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await NotificationTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("when GET /notifications", () => {
    it("should response 200", async () => {
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

      await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: { content: "sabi" },
        headers: {
          Authorization: `Bearer ${demoToken}`,
        },
      });

      const response = await server.inject({
        method: "GET",
        url: `/notifications`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.notifications).toBeDefined();
    });
  });

  describe("when PATCH /notifications/{notificationId}/read", () => {
    it("should response 200", async () => {
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

      await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: { content: "sabi" },
        headers: {
          Authorization: `Bearer ${demoToken}`,
        },
      });

      const notifications = await server.inject({
        method: "GET",
        url: `/notifications`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const notificationResponse = JSON.parse(notifications.payload);
      const notificationId = notificationResponse.data.notifications[0].id;

      const response = await server.inject({
        method: "PATCH",
        url: `/notifications/${notificationId}/read`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });

  describe("when PATCH /notifications/read-all", () => {
    it("should response 200", async () => {
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

      await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: { content: "sabi" },
        headers: {
          Authorization: `Bearer ${demoToken}`,
        },
      });

      await server.inject({
        method: "GET",
        url: `/notifications`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await server.inject({
        method: "PATCH",
        url: `/notifications/read-all`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});

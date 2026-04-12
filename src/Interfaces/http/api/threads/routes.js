const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadHandler,
  },
  {
    method: "GET",
    path: "/threads",
    handler: handler.getAllThreadsHandler,
  },
  {
    method: "GET",
    path: "/threads/me",
    handler: handler.getThreadsByUserHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
];

module.exports = routes;

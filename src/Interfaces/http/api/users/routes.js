const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
  },
  {
    method: "GET",
    path: "/users/me",
    handler: handler.getUserHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
];

module.exports = routes;

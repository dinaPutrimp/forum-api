const routes = (handler) => [
  {
    method: "GET",
    path: "/notifications",
    handler: handler.getNotificationsHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "PATCH",
    path: "/notifications/{notificationId}/read",
    handler: handler.markNotificationAsReadHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "PATCH",
    path: "/notifications/read-all",
    handler: handler.markAllNotificationsAsReadHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
];

module.exports = routes;

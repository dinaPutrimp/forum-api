const NotificationHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "notifications",
  register: async (server, { container }) => {
    const notificationHandler = new NotificationHandler(container);
    server.route(routes(notificationHandler));
  },
};

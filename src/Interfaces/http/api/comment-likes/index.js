const CommentLikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "comment_likes",
  register: async (server, { container }) => {
    const toggleCommentLikeHandler = new CommentLikesHandler(container);
    server.route(routes(toggleCommentLikeHandler));
  },
};

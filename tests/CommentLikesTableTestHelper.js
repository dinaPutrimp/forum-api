/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = "comment-like-123",
    commentId = "comment-123",
    userId = "user-123",
    date = new Date().toISOString(),
  }) {
    const query = {
      text: "INSERT INTO comment_likes (id, comment_id, user_id, created_at) VALUES($1, $2, $3, $4)",
      values: [id, commentId, userId, date],
    };

    await pool.query(query);
  },

  async deleteCommentLike(commentId, userId) {
    const query = {
      text: "DELETE from comment_likes WHERE comment_id = $1 AND user_id = $2",
      values: [commentId, userId],
    };

    await pool.query(query);
  },

  async verifyCommentLike(commentId, userId) {
    const query = {
      text: "SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2",
      values: [commentId, userId],
    };

    const result = await pool.query(query);
    return result.rowCount > 0;
  },

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: "SELECT COUNT(*) AS likes FROM comment_likes WHERE comment_id = $1",
      values: [commentId],
    };

    const result = await pool.query(query);
    return parseInt(result.rows[0].likes);
  },

  async cleanTable() {
    await pool.query("DELETE FROM comment_likes WHERE 1=1");
  },
};

module.exports = CommentLikesTableTestHelper;

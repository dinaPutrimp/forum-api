/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async getReplyById(replyId) {
    const query = {
      text: `SELECT * FROM replies WHERE id = $1`,
      values: [replyId],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async verifyTheReplyOwner(id, owner) {
    const query = {
      text: "SELECT id FROM replies WHERE id = $1 AND owner = $2",
      values: [id, owner],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addReplyToComment({
    id = "reply-123",
    content = "sabi",
    commentId = "comment-123",
    owner = "user-123",
    date = new Date().toISOString(),
    is_delete = false,
  }) {
    const query = {
      text: "INSERT INTO replies (id, content, comment_id, owner, date, is_delete) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner",
      values: [id, content, commentId, owner, date, is_delete],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async deleteReplyById(id) {
    const query = {
      text: "UPDATE replies SET is_delete = $1 WHERE id = $2 RETURNING id",
      values: [true, id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM replies WHERE 1=1");
  },
};

module.exports = RepliesTableTestHelper;

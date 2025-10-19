/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addCommentToAThread({
    id = "comment-123",
    content = "sabi",
    threadId = "thread-123",
    owner = "user-123",
    date = new Date().toISOString(),
    is_delete = false,
  }) {
    const query = {
      text: "INSERT INTO comments (id, content, thread_id, owner, date, is_delete) VALUES($1, $2, $3, $4, $5, $6)",
      values: [id, content, threadId, owner, date, is_delete],
    };

    await pool.query(query);
  },

  async getCommentById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async verifyTheCommentOwner(id, owner) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1 AND owner = $2",
      values: [id, owner],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async deleteCommentById(id) {
    const query = {
      text: "UPDATE comments SET is_delete = $1 WHERE id = $2 RETURNING id",
      values: [true, id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getCommentByThreadId(id) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content
            FROM comments c
            JOIN users u ON u.id = c.owner
            WHERE c.thread_id = $1
            ORDER BY c.date ASC`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment?.is_delete ? "Komentar telah dihapus" : comment.content,
    }));
  },

  async verifyAvailableComment(commentId) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1 AND is_delete = false",
      values: [commentId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;

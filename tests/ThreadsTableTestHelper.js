/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "a thread",
    body = "pesut",
    owner = "user-123",
    date = new Date().toISOString(),
  }) {
    const query = {
      text: "INSERT INTO threads (id, title, body, owner, date) VALUES($1, $2, $3, $4, $5)",
      values: [id, title, body, owner, date],
    };

    await pool.query(query);
  },

  async getThreadById(id) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username 
            FROM threads t 
            JOIN users u ON u.id = t.owner
            WHERE t.id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getThreadOwnerById(id) {
    const query = {
      text: `SELECT t.owner FROM threads t WHERE t.id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0].owner;
  },

  async getAllThreads() {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username,
                    (SELECT COUNT(c.id)::int FROM comments c WHERE c.thread_id = t.id) AS comment_count
             FROM threads t
             JOIN users u ON u.id = t.owner
             ORDER BY t.date DESC`,
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getThreadsByUser(userId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date 
            FROM threads t 
            WHERE t.owner = $1
            ORDER BY t.date DESC`,
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;

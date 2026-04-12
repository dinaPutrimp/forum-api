const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(
        "tidak dapat membuat komentar karena thread tidak valid"
      );
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username 
            FROM threads t 
            JOIN users u ON u.id = t.owner
            WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(
        "tidak dapat melihat detail thread karena thread tidak ada atau tidak valid"
      );
    }

    return result.rows[0];
  }

  async getThreadOwnerById(threadId) {
    const query = {
      text: `SELECT t.owner FROM threads t WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(
        "tidak dapat melihat detail thread karena thread tidak ada atau tidak valid"
      );
    }

    return result.rows[0].owner;
  }

  async addThread({ title, body }, owner) {
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads (id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Thread gagal ditambahkan");
    }

    return new AddedThread({ ...result.rows[0] });
  }

  async getAllThreads() {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username,
                    (SELECT COUNT(c.id)::int FROM comments c WHERE c.thread_id = t.id) AS comment_count
             FROM threads t
             JOIN users u ON u.id = t.owner
             ORDER BY t.date DESC`,
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getThreadsByUser(userId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date 
            FROM threads t 
            WHERE t.owner = $1
            ORDER BY t.date DESC`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ThreadRepositoryPostgres;

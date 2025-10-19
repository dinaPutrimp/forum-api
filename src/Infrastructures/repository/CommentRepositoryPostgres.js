const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../Commons/exceptions/InvariantError");
const AddedCommentToAThread = require("../../Domains/comments/entities/AddedCommentToAThread");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyTheCommentOwner(commentId, owner) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(
        "tidak dapat menghapus komentar karena komentar tidak ada atau tidak valid"
      );
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError(
        "tidak dapat menghapus komentar hanya pemilik komentar yang dapat menghapus komentar"
      );
    }
  }

  async getCommentById(commentId) {
    const query = {
      text: `SELECT id, content, owner FROM comments c WHERE c.id = $1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError("Komentar tidak tersedia");
    }

    return result.rows[0];
  }

  async addCommentToAThread({ content }, threadId, owner) {
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments (id, content, thread_id, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, content, threadId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Komentar gagal ditambahkan");
    }

    return new AddedCommentToAThread({ ...result.rows[0] });
  }

  async deleteCommentById(commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(
        "tidak dapat menghapus komentar karena komentar tidak ada atau tidak valid"
      );
    }

    return { id: result.rows[0].id };
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content, c.is_delete
            FROM comments c
            JOIN users u ON u.id = c.owner
            WHERE c.thread_id = $1
            ORDER BY c.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1 AND is_delete = false",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(
        "tidak dapat menambahkan balasan karena komentar tidak valid"
      );
    }

    return true;
  }
}

module.exports = CommentRepositoryPostgres;

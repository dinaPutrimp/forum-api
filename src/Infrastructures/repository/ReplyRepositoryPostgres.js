const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../Commons/exceptions/InvariantError");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const AddedReplyToComment = require("../../Domains/replies/entities/AddedReplyToComment");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getReplyById(replyId) {
    const query = {
      text: `SELECT id, content, comment_id, owner, date FROM replies r WHERE r.id = $1`,
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Balasan tidak tersedia");
    }

    return result.rows[0];
  }

  async verifyTheReplyOwner(replyId, owner) {
    const query = {
      text: "SELECT owner FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(
        "tidak dapat menghapus balasan karena balasan tidak ada atau tidak valid"
      );
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError(
        "tidak dapat menghapus balasan hanya pemilik balasan yang dapat menghapus balasan"
      );
    }
  }

  async addReplyToComment({ content }, commentId, owner) {
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO replies (id, content, comment_id, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, content, commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Balasan gagal ditambahkan");
    }

    return new AddedReplyToComment({ ...result.rows[0] });
  }

  async deleteReplyById(replyId) {
    const query = {
      text: "UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(
        "tidak dapat menghapus balasan karena balasan tidak ada atau tidak valid"
      );
    }

    return result.rows[0];
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT r.id, u.username, r.date, r.content, r.is_delete
            FROM replies r
            JOIN users u ON u.id = r.owner
            WHERE r.comment_id = $1
            ORDER BY r.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;

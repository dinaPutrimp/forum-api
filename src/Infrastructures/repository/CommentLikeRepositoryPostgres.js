const CommentLikeRepository = require("../../Domains/comment-likes/CommentLikeRepository");

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyCommentLike(commentId, userId) {
    const query = {
      text: "SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2",
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async deleteCommentLike(commentId, userId) {
    const query = {
      text: `DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async addCommentLike(commentId, userId) {
    const id = `comment-like-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comment_likes (id, comment_id, user_id) VALUES($1, $2, $3) RETURNING id",
      values: [id, commentId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: "SELECT COUNT(id) AS likes FROM comment_likes WHERE comment_id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return parseInt(result.rows[0].likes, 10);
  }
}

module.exports = CommentLikeRepositoryPostgres;

/* eslint-disable camelcase */

const up = (pgm) => {
  pgm.createTable("comment_likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    comment_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "comments(id)",
      onDelete: "CASCADE",
    },
    created_at: {
      type: "TIMESTAMP",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("comment_likes", "unique_comment_likes", {
    unique: ["user_id", "comment_id"],
  });
};

const down = (pgm) => {
  pgm.dropTable("comment_likes");
};

module.exports = { up, down };

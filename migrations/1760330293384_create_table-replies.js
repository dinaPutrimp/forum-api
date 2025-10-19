const up = (pgm) => {
  pgm.createTable("replies", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    comment_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "comments(id)",
      onDelete: "CASCADE",
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    date: {
      type: "TIMESTAMP",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    is_delete: {
      type: "BOOLEAN",
      default: false,
    },
  });

  pgm.sql(`
    INSERT INTO replies (id, comment_id, content, owner, date)
    SELECT id, parent_id AS comment_id, content, owner, date
    FROM comments
    WHERE parent_id IS NOT NULL;
  `);

  pgm.sql(`
    DELETE FROM comments WHERE parent_id IS NOT NULL;
  `);

  pgm.dropColumn("comments", "parent_id");
};

const down = (pgm) => {
  pgm.dropTable("replies");
};

module.exports = { up, down };

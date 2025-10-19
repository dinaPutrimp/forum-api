const up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "threads(id)",
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
      default: pgm.func("current_timestamp"),
    },
    is_delete: {
      type: "BOOLEAN",
      default: false,
    },
  });
};

const down = (pgm) => {
  pgm.dropTable("comments");
};

module.exports = { up, down };

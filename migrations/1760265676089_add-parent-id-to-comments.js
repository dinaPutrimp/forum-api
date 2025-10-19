const up = (pgm) => {
  pgm.addColumn("comments", {
    parent_id: {
      type: "VARCHAR(50)",
      references: "comments(id)",
      onDelete: "CASCADE",
      default: null,
    },
  });
};

const down = (pgm) => {
  pgm.dropColumn("comments", "parent_id");
};

module.exports = { up, down };

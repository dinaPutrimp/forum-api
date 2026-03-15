const up = (pgm) => {
  pgm.createTable("notifications", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    recipient_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    actor_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    type: {
      type: "VARCHAR(10)",
      notNull: true,
      check: "type IN ('reply', 'like')",
    },
    entity_type: {
      type: "VARCHAR(10)",
      notNull: true,
      check: "entity_type IN ('comment', 'reply')",
    },
    entity_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    payload: {
      type: "JSONB",
      default: pgm.func("'{}'"),
    },
    is_read: {
      type: "BOOLEAN",
      default: false,
    },
    created_at: {
      type: "TIMESTAMP",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createIndex("notifications", ["recipient_id", "created_at"], {
    name: "idx_notifications_recipient",
    order: { created_at: "DESC" },
  });

  pgm.createIndex("notifications", ["recipient_id", "is_read"], {
    name: "idx_notifications_unread",
    where: "is_read = false",
  });

  pgm.createIndex("notifications", ["entity_type", "entity_id"], {
    name: "idx_notifications_entity",
  });

  pgm.createIndex("notifications", ["actor_id", "entity_id", "type"], {
    name: "idx_notifications_no_dup_like",
    unique: true,
    where: "type = 'like'",
  });
};

const down = (pgm) => {
  pgm.dropTable("notifications");
};

module.exports = { up, down };

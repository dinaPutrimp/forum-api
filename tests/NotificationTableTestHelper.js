const pool = require("../src/Infrastructures/database/postgres/pool");

const NotificationTableTestHelper = {
  async addNotification({
    id = "notification-1234",
    recipientId,
    actorId,
    type,
    entityType,
    entityId,
    payload = {},
    createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: `
                INSERT INTO notifications (id, recipient_id, actor_id, type, entity_type, entity_id, payload, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            `,
      values: [
        id,
        recipientId,
        actorId,
        type,
        entityType,
        entityId,
        payload,
        createdAt,
      ],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM notifications WHERE 1=1");
  },
};

module.exports = NotificationTableTestHelper;

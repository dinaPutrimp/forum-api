const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const NotificationRepository = require("../../Domains/notifications/NotificationRepository");

class NotificationRepositoryPostgres extends NotificationRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addNotification({
    recipientId,
    actorId,
    type,
    entityType,
    entityId,
    payload = {},
  }) {
    const id = `notification-${this._idGenerator()}`;
    const query = {
      text: `
                INSERT INTO notifications (id, recipient_id, actor_id, type, entity_type, entity_id, payload)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `,
      values: [id, recipientId, actorId, type, entityType, entityId, payload],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getNotificationsByUserId(userId) {
    const query = {
      text: `
        SELECT 
          n.id, n.type, n.entity_type, n.payload, n.is_read, n.created_at, u.username AS actor_username
        FROM notifications n
        LEFT JOIN users u ON u.id = n.actor_id
        WHERE n.recipient_id = $1
        ORDER BY n.created_at DESC
        LIMIT 20 
      `,
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async markNotificationAsRead(notificationId, userId) {
    const query = {
      text: `
        UPDATE notifications SET is_read = true
        WHERE id = $1 AND recipient_id = $2
        RETURNING id
      `,
      values: [notificationId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("notifikasi tidak ditemukan");
    }
  }

  async markAllNotificationsAsRead(userId) {
    const query = {
      text: `
        UPDATE notifications
        SET is_read = true
        WHERE recipient_id = $1 AND is_read = false
      `,
      values: [userId],
    };
    await this._pool.query(query);
  }
}

module.exports = NotificationRepositoryPostgres;

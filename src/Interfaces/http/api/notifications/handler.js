const GetNotificationUseCase = require("../../../../Applications/use_case/GetNotificationUseCase");
const MarkAllNotificationsAsReadUseCase = require("../../../../Applications/use_case/MarkAllNotificationsAsReadUseCase");
const MarkNotificationAsReadUseCase = require("../../../../Applications/use_case/MarkNotificationAsReadUseCase");

class NotificationHandler {
  constructor(container) {
    this._container = container;

    this.getNotificationsHandler = this.getNotificationsHandler.bind(this);
    this.markNotificationAsReadHandler =
      this.markNotificationAsReadHandler.bind(this);
    this.markAllNotificationsAsReadHandler =
      this.markAllNotificationsAsReadHandler.bind(this);
  }

  async getNotificationsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const getNotificationsUseCase = this._container.getInstance(
      GetNotificationUseCase.name
    );
    const notifications = await getNotificationsUseCase.execute(credentialId);

    const response = h.response({
      status: "success",
      data: {
        notifications,
      },
    });
    response.code(200);
    return response;
  }

  async markNotificationAsReadHandler(request, h) {
    const { notificationId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const markNotificationAsReadUseCase = this._container.getInstance(
      MarkNotificationAsReadUseCase.name
    );
    await markNotificationAsReadUseCase.execute(notificationId, credentialId);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }

  async markAllNotificationsAsReadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const markAllNotificationsAsReadUseCase = this._container.getInstance(
      MarkAllNotificationsAsReadUseCase.name
    );
    await markAllNotificationsAsReadUseCase.execute(credentialId);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = NotificationHandler;

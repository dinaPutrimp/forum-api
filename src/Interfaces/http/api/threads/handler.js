const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/DetailThreadUseCase");
const GetAllThreadsUseCase = require("../../../../Applications/use_case/GetAllThreadsUseCase");
const GetThreadsByUserUseCase = require("../../../../Applications/use_case/GetThreadsByUserUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.getAllThreadsHandler = this.getAllThreadsHandler.bind(this);
    this.getThreadsByUserHandler = this.getThreadsByUserHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(
      request.payload,
      credentialId
    );

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;

    const detailThreadUseCase = this._container.getInstance(
      DetailThreadUseCase.name
    );
    const thread = await detailThreadUseCase.execute(threadId);

    const response = h.response({
      status: "success",
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }

  async getAllThreadsHandler(request, h) {
    const getAllThreadsUseCase = this._container.getInstance(
      GetAllThreadsUseCase.name
    );
    const threads = await getAllThreadsUseCase.execute();

    const response = h.response({
      status: "success",
      data: {
        threads,
      },
    });
    response.code(200);
    return response;
  }

  async getThreadsByUserHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const getThreadsByUserUseCase = this._container.getInstance(
      GetThreadsByUserUseCase.name
    );
    const threads = await getThreadsByUserUseCase.execute(credentialId);

    const response = h.response({
      status: "success",
      data: {
        threads,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;

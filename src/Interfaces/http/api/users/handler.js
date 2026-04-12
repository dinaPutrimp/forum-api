const AddUserUseCase = require("../../../../Applications/use_case/AddUserUseCase");
const GetUserUseCase = require("../../../../Applications/use_case/GetUserUseCase");

class UsersHandler {
  constructor(container) {
    this._container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserHandler = this.getUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }

  async getUserHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const getUserUseCase = this._container.getInstance(GetUserUseCase.name);
    const user = await getUserUseCase.execute(credentialId);
    const response = h.response({
      status: "success",
      data: {
        user,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = UsersHandler;

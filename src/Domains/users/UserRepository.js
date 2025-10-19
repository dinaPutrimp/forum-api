class UserRepository {
  async addUser(_registerUser) {
    throw new Error("USER_REPOSITORY.ADD_USER_METHOD_NOT_IMPLEMENTED");
  }

  async verifyAvailableUsername(_username) {
    throw new Error(
      "USER_REPOSITORY.VERIFY_AVAILABLE_USERNAME_METHOD_NOT_IMPLEMENTED"
    );
  }

  async getPasswordByUsername(_username) {
    throw new Error(
      "USER_REPOSITORY.GET_PASSWORD_BY_USERNAME_METHOD_NOT_IMPLEMENTED"
    );
  }

  async getIdByUsername(_username) {
    throw new Error(
      "USER_REPOSITORY.GET_ID_BY_USERNAME_METHOD_NOT_IMPLEMENTED"
    );
  }
}

module.exports = UserRepository;

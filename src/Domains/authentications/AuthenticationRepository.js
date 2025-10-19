class AuthenticationRepository {
  async addToken(_token) {
    throw new Error("AUTHENTICATION_REPOSITORY.ADD_TOKEN_METHOD_NOT_IMPLEMENTED");
  }

  async checkAvailabilityToken(_token) {
    throw new Error("AUTHENTICATION_REPOSITORY.CHECK_AVAILABILITY_METHOD_NOT_IMPLEMENTED");
  }

  async deleteToken(_token) {
    throw new Error("AUTHENTICATION_REPOSITORY.DELETE_TOKEN_METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = AuthenticationRepository;

const AuthenticationRepository = require("../AuthenticationRepository");

describe("AuthenticationRepository interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepository();

    // Action & Assert
    await expect(authenticationRepository.addToken("")).rejects.toThrow(
      "AUTHENTICATION_REPOSITORY.ADD_TOKEN_METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      authenticationRepository.checkAvailabilityToken("")
    ).rejects.toThrow(
      "AUTHENTICATION_REPOSITORY.CHECK_AVAILABILITY_METHOD_NOT_IMPLEMENTED"
    );
    await expect(authenticationRepository.deleteToken("")).rejects.toThrow(
      "AUTHENTICATION_REPOSITORY.DELETE_TOKEN_METHOD_NOT_IMPLEMENTED"
    );
  });
});

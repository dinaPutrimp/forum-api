const UserRepository = require("../UserRepository");

describe("UserRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const userRepository = new UserRepository();

    // Action and Assert
    await expect(userRepository.addUser({})).rejects.toThrowError(
      "USER_REPOSITORY.ADD_USER_METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      userRepository.verifyAvailableUsername("")
    ).rejects.toThrowError(
      "USER_REPOSITORY.VERIFY_AVAILABLE_USERNAME_METHOD_NOT_IMPLEMENTED"
    );
    await expect(userRepository.getPasswordByUsername("")).rejects.toThrowError(
      "USER_REPOSITORY.GET_PASSWORD_BY_USERNAME_METHOD_NOT_IMPLEMENTED"
    );
    await expect(userRepository.getIdByUsername("")).rejects.toThrowError(
      "USER_REPOSITORY.GET_ID_BY_USERNAME_METHOD_NOT_IMPLEMENTED"
    );
  });
});

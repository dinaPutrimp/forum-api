const UserRepository = require("../../../Domains/users/UserRepository");
const GetUserUseCase = require("../GetUserUseCase");

describe("GetUserUseCase", () => {
  it("should orchestrating the get user action correctly", async () => {
    // Arrange
    const mockUser = {
      id: "user-123",
      username: "demo",
    };

    const mockUserRepository = new UserRepository();

    mockUserRepository.getUserById = jest.fn().mockResolvedValue(mockUser);

    /** creating use case instance */
    const getUsers = new GetUserUseCase({
      userRepository: mockUserRepository,
    });

    // Action
    const user = await getUsers.execute("user-123");

    // Assert
    expect(user).toStrictEqual(mockUser);
    expect(mockUserRepository.getUserById).toBeCalledWith("user-123");
  });
});

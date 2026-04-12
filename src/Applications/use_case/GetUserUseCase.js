class GetUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this._userRepository.getUserById(userId);
    return user;
  }
}

module.exports = GetUserUseCase;

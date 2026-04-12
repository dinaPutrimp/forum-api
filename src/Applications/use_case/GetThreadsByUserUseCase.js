class GetThreadsByUserUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId) {
    const threads = await this._threadRepository.getThreadsByUser(userId);

    return threads;
  }
}

module.exports = GetThreadsByUserUseCase;

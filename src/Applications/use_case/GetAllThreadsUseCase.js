class GetAllThreadsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute() {
    const threads = await this._threadRepository.getAllThreads();

    return threads;
  }
}

module.exports = GetAllThreadsUseCase;

const AddThread = require("../../Domains/threads/entities/AddThread");
const AddedThread = require("../../Domains/threads/entities/AddedThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const thread = new AddThread(useCasePayload);
    const addedThread = await this._threadRepository.addThread(thread, owner);
    return new AddedThread(addedThread);
  }
}

module.exports = AddThreadUseCase;

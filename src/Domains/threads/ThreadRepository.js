class ThreadRepository {
    async addThread(_thread, _owner){
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }
    
    async verifyAvailableThread(_threadId){
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }
    
    async getThreadById(_threadId){
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }
}

module.exports = ThreadRepository
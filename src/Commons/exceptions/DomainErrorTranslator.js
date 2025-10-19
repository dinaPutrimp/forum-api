const AuthorizationError = require("./AuthorizationError");
const InvariantError = require("./InvariantError");
const NotFoundError = require("./NotFoundError");

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
  ),
  "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat user baru karena tipe data tidak sesuai"
  ),
  "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
    "tidak dapat membuat user baru karena karakter username melebihi batas limit"
  ),
  "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
    "tidak dapat membuat user baru karena username mengandung karakter terlarang"
  ),
  "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan username dan password"
  ),
  "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "username dan password harus string"
  ),
  "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus string"),
  "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus string"),
  "AUTHENTICATION_REPOSITORY.ADD_TOKEN_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method addToken"),
  "AUTHENTICATION_REPOSITORY.CHECK_AVAILABILITY_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method checkAvailabilityToken"),
  "AUTHENTICATION_REPOSITORY.DELETE_TOKEN_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method deleteToken"),
  "AUTH_ERROR.REFRESH_TOKEN_NOT_FOUND": new InvariantError(
    "refresh token tidak ditemukan di database"
  ),
  "ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION": new InvariantError(
    "tidak dapat membuat thread karena properti yang dibutuhkan tidak sesuai"
  ),
  "ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat thread karena tipe data tidak sesuai"
  ),
  "ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION": new InvariantError(
    "tidak dapat membuat komentar karena properti yang dibutuhkan tidak sesuai"
  ),
  "ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND": new NotFoundError(
    "tidak dapat membuat komentar karena thread tidak valid"
  ),
  "ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat comment karena tipe data tidak sesuai"
  ),
  "COMMENT_REPOSITORY.ADD_COMMENT_TO_A_THREAD_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method addCommentToAThread"),
  "COMMENT_REPOSITORY.GET_COMMENT_BY_ID_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method getCommentById"),
  "COMMENT_REPOSITORY.VERIFY_THE_COMMENT_OWNER_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method verifyTheCommentOwner"),
  "COMMENT_REPOSITORY.DELETE_COMMENT_BY_ID_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method deleteCommentById"),
  "COMMENT_REPOSITORY.GET_COMMENT_BY_THREAD_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method getCommentByThreadId"),
  "COMMENT_REPOSITORY.VERIFY_AVAILABLE_COMMENT_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method verifyAvailableComment"),
  "USER_REPOSITORY.ADD_USER_METHOD_NOT_IMPLEMENTED": new InvariantError(
    "tidak ada method addUser"
  ),
  "USER_REPOSITORY.VERIFY_AVAILABLE_USERNAME_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method verifyAvailableUsername"),
  "USER_REPOSITORY.GET_PASSWORD_BY_USERNAME_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method getPasswordByUsername"),
  "USER_REPOSITORY.GET_ID_BY_USERNAME_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method getIdByUsername"),
  "DELETE_COMMENT_USE_CASE.NOT_FOUND": new NotFoundError(
    "tidak dapat menghapus komentar karena komentar tidak ada atau tidak valid"
  ),
  "DELETE_COMMENT_USE_CASE.NOT_THE_COMMENT_OWNER": new AuthorizationError(
    "tidak dapat menghapus komentar hanya pemilik komentar yang dapat menghapus komentar"
  ),
  "DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION": new InvariantError(
    "tidak dapat menghapus komentar karena komentar tidak ada atau tidak valid"
  ),
  "DETAIL_THREAD_USE_CASE.THREAD_NOT_FOUND": new NotFoundError(
    "tidak dapat melihat detail thread karena thread tidak ada atau tidak valid"
  ),
  "ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION": new InvariantError(
    "tidak dapat menambahkan balasan karena properti yang dibutuhkan tidak sesuai"
  ),
  "ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND": new NotFoundError(
    "tidak dapat menambahkan balasan karena komentar tidak valid"
  ),
  "ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat menambahkan balasan karena tipe data tidak sesuai"
  ),
  "REPLY_REPOSITORY.ADD_REPLY_TO_A_COMMENT_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method addReplyToComment"),
  "REPLY_REPOSITORY.VERIFY_THE_REPLY_OWNER_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method verifyTheReplyOwner"),
  "REPLY_REPOSITORY.DELETE_REPLY_BY_ID_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method deleteReplyById"),
  "REPLY_REPOSITORY.VERIFY_AVAILABLE_REPLY_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method verifyAvailableReply"),
  "REPLY_REPOSITORY.GET_REPLIES_BY_COMMENT_ID_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method getRepliesByCommentId"),
  "DELETE_REPLY_USE_CASE.NOT_FOUND": new NotFoundError(
    "tidak dapat menghapus balasan karena balasan tidak ada atau tidak valid"
  ),
  "DELETE_REPLY_USE_CASE.NOT_THE_COMMENT_OWNER": new AuthorizationError(
    "tidak dapat menghapus balasan hanya pemilik balasan yang dapat menghapus balasan"
  ),
  "DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION": new InvariantError(
    "tidak dapat menghapus balasan karena properti yang dibutuhkan tidak sesuai"
  ),
  "COMMENT_LIKE_REPOSITORY.VERIFY_COMMENT_LIKE_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method verifyCommentLike"),
  "COMMENT_LIKE_REPOSITORY.DELETE_COMMENT_LIKE_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method deleteCommentLike"),
  "COMMENT_LIKE_REPOSITORY.ADD_COOMENT_LIKE_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method addCommentLike"),
  "COMMENT_LIKE_REPOSITORY.GET_LIKE_COUNT_METHOD_NOT_IMPLEMENTED":
    new InvariantError("tidak ada method getLikeCountByCommentId"),
  "TOGGLE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_SPECIFICATION":
    new InvariantError(
      "tidak dapat menyukai/membatalkan karena properti yang dibutuhkan tidak sesuai"
    ),
};

module.exports = DomainErrorTranslator;

export enum ErrorCodes {
  // General Errors
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,

  // Database Errors
  DatabaseQueryException = 1000,
  ForeignKeyConstraintViolation = 1001,
  DuplicateKey = 1002,
  DuplicatePrimaryKey = 1003,
  NullValueViolation = 1004,
  ValueTooLong = 1005,
}

export enum DatabaseErrorCodes {
  ForeignKeyConstraintViolation = 547,
  DuplicateKey = 2601,
  DuplicatePrimaryKey = 2627,
  NullValueViolation = 515,
  ValueTooLong = 8152,
}

export enum SuccessCodes {
  Ok = 200,
  Created = 201,
  NoContent = 204,
}

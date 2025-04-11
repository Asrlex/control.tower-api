export enum AuthEnum {
  AuthHeader = 'authorization',
  AuthHeaderPrefix = 'Bearer',
  AuthAPIKey = 'x-api-key',
}

export enum AuthMessages {
  AuthEndpointWorking = 'Auth endpoint is working',
  NoTokenProvided = 'No token provided',
  InvalidToken = 'Invalid token',
  InvalidAPIKey = 'Invalid API key',
  InvalidCredentials = 'Invalid credentials',
  UserNotFound = 'User not found',
  UserAlreadyExists = 'User already exists',
  UserCreationFailed = 'User creation failed',
  PasswordHashingFailed = 'Password hashing failed',
}

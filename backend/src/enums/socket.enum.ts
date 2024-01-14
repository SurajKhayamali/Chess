export enum SocketEvent {
  // From client to server
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
  // USER_TYPING = 'user:typing',
  // USER_STOP_TYPING = 'user:stop-typing',
  //   USER_READ_MESSAGE = 'user:read-message',

  GAME_JOIN_QUEUE = 'game:join-queue',
  GAME_LEAVE_QUEUE = 'game:leave-queue',
  GAME_STARTED = 'game:started',

  // From server to client
  USER_MESSAGE = 'user:message',

  // Bidirectional
  PUBLIC_MESSAGE = 'public-message',
}

export enum SockerRoomPrefix {
  USER = 'user',
}

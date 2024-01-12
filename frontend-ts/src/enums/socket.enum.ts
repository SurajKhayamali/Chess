export enum SocketEvent {
  // From client to server
  USER_ONLINE = 'user-online',
  USER_OFFLINE = 'user-offline',
  USER_TYPING = 'user-typing',
  USER_STOP_TYPING = 'user-stop-typing',
  //   USER_READ_MESSAGE = 'user-read-message',

  // From server to client
  USER_MESSAGE = 'user-message',
}

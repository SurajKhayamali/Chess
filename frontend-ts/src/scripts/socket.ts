import { API_URL } from 'constants/config.constant';
import { io } from 'socket.io-client';

export const socket = io(API_URL, {
  withCredentials: true,
});

// client-side
socket.on('connect', () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx

  if (socket.recovered) {
    // any event missed during the disconnection period will be received now
  } else {
    // new or unrecoverable session
  }
});

// socket.on('disconnect', () => {
//   console.log(socket.id); // undefined
// });

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  if (reason === 'io server disconnect') {
    // the disconnection was initiated by the server, you need to reconnect manually
    socket.connect();
    console.log('Reconnected');
  }
  // else the socket will automatically try to reconnect
});

import { Schema } from 'joi';
import { SockerRoomPrefix } from '../enums/socket.enum';
import { validateSchema } from './joi.helper';
import { Socket } from 'socket.io';
import { JwtPayload } from '../interfaces/jwt.interface';
// import { UnauthorizedException } from '../exceptions';

export function getUserSocketRoom(userId: number | string) {
  return `${SockerRoomPrefix.USER}-${userId}`;
}

export function setUserDataInSocket(socket: Socket, user: JwtPayload) {
  socket.data.user = user;
}

export function getUserDataFromSocket(socket: Socket): JwtPayload | undefined {
  return socket.data.user;
}

// export function handleWithAck<T>(
//   callback: (data: T) => void,
//   customAckRes?: unknown
// ) {
//   return (data: T, ack: (response: unknown) => void) => {
//     callback(data);
//     console.log(ack, customAckRes);
//     ack && ack(customAckRes || { status: 'ok' });
//   };
// }

export function handleWithAck<T>(callback: (data: T) => unknown) {
  return async (data: T, ack: (response: unknown) => void) => {
    try {
      const response = await callback(data);
      ack && ack(response);
    } catch (error) {
      ack && ack({ error: (error as Error).message });
    }
  };
}

export function handleAfterValidation<T>(
  schema: Schema,
  callback: (data: T) => unknown
) {
  return async (data: T, ack?: (response: unknown) => void) => {
    try {
      const value = validateSchema(schema, data);
      const response = await callback(value);
      ack && ack(response);
    } catch (error) {
      ack && ack({ error: (error as Error).message });
    }
  };
}

export function respondUnauthorized() {
  return { error: 'Unauthorized' };
}

// export function authSocket(socket: Socket) {
//   const user = getUserDataFromSocket(socket);
//   if (!user) throw new UnauthorizedException('User not found');

//   return user;
// }

// export function handleForAuthenticatedUsersOnly<T>(callback: (data: T) => unknown) {
//   return async (data: T, ack: (response: unknown) => void) => {
//     try {
//       authSocket(socket);
//       const response = await callback();
//       ack && ack(response);
//     } catch (error) {
//       ack && ack({ error: (error as Error).message });
//     }
//   };
// }

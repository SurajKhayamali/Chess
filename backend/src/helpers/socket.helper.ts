import { Schema } from 'joi';
import { SockerRoomPrefix } from '../enums/socket.enum';
import { validateSchema } from './joi.helper';
import { Socket } from 'socket.io';
import { JwtPayload } from '../interfaces/jwt.interface';

export function getUserSocketRoom(userId: number | string) {
  return `${SockerRoomPrefix.USER}-${userId}`;
}

export function setUserDataInSocket(socket: Socket, user: JwtPayload) {
  socket.data.user = user;
}

export function getUserDataFromSocket(socket: Socket) {
  return socket.data.user;
}

export function handleWithAck<T>(
  callback: (data: T) => void,
  customAckRes?: unknown
) {
  return (data: T, ack: (response: unknown) => void) => {
    callback(data);
    console.log(ack, customAckRes);
    ack && ack(customAckRes || { status: 'ok' });
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

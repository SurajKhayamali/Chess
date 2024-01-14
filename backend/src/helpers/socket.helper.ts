import { Schema } from 'joi';
import { SockerRoomPrefix } from '../enums/socket.enum';
import { validateSchema } from './joi.helper';

export function getUserSocketRoom(userId: number) {
  return `${SockerRoomPrefix.USER}-${userId}`;
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
  callback: (data: T) => void
) {
  return (data: T, ack?: (response: unknown) => void) => {
    try {
      const value = validateSchema(schema, data);
      callback(value);
    } catch (error) {
      ack && ack({ error: (error as Error).message });
    }
  };
}

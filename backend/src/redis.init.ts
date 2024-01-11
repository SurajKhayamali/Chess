import { createClient } from 'redis';
import serverConfig from './config';

const { host, port, password } = serverConfig.redis;

export const redisClient = createClient({
  password: password,
  socket: {
    host: host,
    port: port,
  },
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis client error', err);
});

// redisClient.on('ready', () => {
//   console.log('Redis client ready');
// });

// redisClient.on('reconnecting', () => {
//   console.log('Redis client reconnecting');
// });

// redisClient.on('end', () => {
//   console.log('Redis client end');
// });

export async function initializeRedis() {
  await redisClient.connect();
}

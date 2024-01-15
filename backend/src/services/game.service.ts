import { Chess } from 'chess.js';
import { User } from '../entities/user.entity';
import { GameMode } from '../enums/gameMode.enum';
import { RedisKeys } from '../enums/redis.enum';
import { SocketEvent } from '../enums/socket.enum';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '../exceptions';
import { generateSlug } from '../helpers/slug.helper';
import { getUserSocketRoom } from '../helpers/socket.helper';
import {
  CreateGameDto,
  JoinGameQueueDto,
  QueryGameDto,
  RecordMoveDto,
  UpdateGameDto,
} from '../interfaces/game.interface';
import { redisClient } from '../redis.init';
import { GameRepository } from '../repositories/game.repository';
import { getSocketIO } from '../socket.init';
import {
  getGameStreamRoomName,
  getIsPlayerAllowedToMove,
  getIsPlayerPlaying,
  getIsPlayerWhite,
  synchronizeGameWithChess,
} from '../helpers/game.helper';

/**
 * Create a new game
 *
 * @param createGameDto
 *
 * @returns game
 */
export async function create(createGameDto: CreateGameDto) {
  const game = GameRepository.create(createGameDto);
  await GameRepository.save(game);
  return game;
}

/**
 * Get all games
 *
 * @returns games
 */
export async function getAll() {
  const games = await GameRepository.find();
  return games;
}

/**
 * Get all games by user
 *
 * @returns games
 */
export async function getAllByUser(userId: number) {
  const games = await GameRepository.createQueryBuilder('game')
    .where('game.white_player_id = :userId', { userId })
    .orWhere('game.black_player_id = :userId', { userId })
    .leftJoinAndSelect('game.whitePlayer', 'whitePlayer')
    .leftJoinAndSelect('game.blackPlayer', 'blackPlayer')
    .getMany();
  return games;
}

/**
 * Get all filtered games by query
 *
 * @param query
 *
 * @returns games
 */
export async function getAllFiltered(query: QueryGameDto) {
  const { slug } = query;
  if (!slug) return getAll();

  return getBySlugOrFail(slug);
}
/**
 * Get all filtered games by query
 *
 * @param query
 *
 * @returns games
 */
export async function getAllFilteredByUser(
  userId: number,
  query: QueryGameDto
) {
  const { slug } = query;
  if (!slug) {
    return getAllByUser(userId);
  }

  return getBySlugOrFail(slug, userId);
}

/**
 * Get game by id
 *
 * @param id
 * @param userId
 *
 * @returns game
 */
export async function getById(id: number, userId?: number) {
  if (!userId) return GameRepository.findOneBy({ id });

  return GameRepository.createQueryBuilder('game')
    .where('game.id = :id', { id })
    .andWhere(
      '(game.white_player_id = :userId OR game.black_player_id = :userId)',
      { userId }
    )
    .leftJoinAndSelect('game.whitePlayer', 'whitePlayer')
    .leftJoinAndSelect('game.blackPlayer', 'blackPlayer')
    .getOne();
}

/**
 * Get game by id or fail
 *
 * @param id
 * @param userId
 *
 * @returns game
 * @throws NotFoundException
 */
export async function getByIdOrFail(id: number, userId?: number) {
  const game = await getById(id, userId);

  if (!game) {
    throw new NotFoundException('Game not found');
  }

  return game;
}

/**
 * Get game by slug
 *
 * @param slug
 *
 * @returns game
 */
export async function getBySlug(slug: string, userId?: number) {
  if (!userId) return GameRepository.findOneBy({ slug });

  return GameRepository.createQueryBuilder('game')
    .where('game.slug = :slug', { slug })
    .andWhere(
      '(game.white_player_id = :userId OR game.black_player_id = :userId)',
      { userId }
    )
    .leftJoinAndSelect('game.whitePlayer', 'whitePlayer')
    .leftJoinAndSelect('game.blackPlayer', 'blackPlayer')
    .getOne();
}

/**
 * Get game by slug or fail
 *
 * @param slug
 *
 * @returns game
 * @throws NotFoundException
 */
export async function getBySlugOrFail(slug: string, userId?: number) {
  const game = await getBySlug(slug, userId);

  if (!game) {
    throw new NotFoundException('Game not found');
  }

  return game;
}

/**
 * Update game by id
 *
 * @param id
 * @param updateGameDto
 *
 * @returns game
 */
export async function update(id: number, updateGameDto: UpdateGameDto) {
  const game = await getByIdOrFail(id);

  GameRepository.merge(game, updateGameDto);

  await GameRepository.save(game);

  return game;
}

/**
 * Record move
 *
 * @param id
 * @param move
 * @param userId
 *
 * @returns game
 */
export async function recordMove(
  id: number,
  move: RecordMoveDto,
  userId?: number
) {
  const game = await getByIdOrFail(id, userId);

  // NOTE: Possibly redundant as it is already checked while querying database
  const isPlayerPlaying = getIsPlayerPlaying(game, userId);
  if (!isPlayerPlaying) throw new ForbiddenException('Not allowed to move');

  const isPlayerWhite = getIsPlayerWhite(game, userId);

  try {
    const chess = new Chess();
    chess.loadPgn(game.pgn || '');

    const isWhitesTurn = chess.turn() === 'w';
    const isPlayerAllowedToMove = getIsPlayerAllowedToMove(
      isWhitesTurn,
      isPlayerWhite
    );
    if (!isPlayerAllowedToMove)
      throw new ForbiddenException('Not your turn to move');

    const isValidMove = chess.move(move);

    if (!isValidMove) throw new BadRequestException('Invalid move');

    synchronizeGameWithChess(game, chess);

    await GameRepository.save(game);

    const io = getSocketIO();
    const socketRoom = getGameStreamRoomName(game.slug);
    io.to(socketRoom).emit(socketRoom, move);

    return game;
  } catch (error) {
    if (error instanceof ForbiddenException) throw error;

    throw new BadRequestException('Invalid move');
  }
}

/**
 * Delete game by id
 *
 * @param id
 */
export async function remove(id: number) {
  const game = await getByIdOrFail(id);

  await GameRepository.remove(game);

  return game;
}

// Redis related functions
export async function handleJoinQueueByUser(
  userId: number,
  data: JoinGameQueueDto
) {
  const { timeLimit } = data;
  const key = `${RedisKeys.GAMES_QUEUE}:${timeLimit}`;

  const existingUserInQueue = await redisClient.RPOP(key);
  if (existingUserInQueue && existingUserInQueue !== String(userId)) {
    const slug = generateSlug();
    const game = await create({
      slug,
      timeLimit,
      whitePlayer: Number(existingUserInQueue) as unknown as User,
      blackPlayer: userId as unknown as User,
      mode: GameMode.PLAYER_VS_PLAYER,
    });

    const io = getSocketIO();
    io.to(getUserSocketRoom(existingUserInQueue)).emit(
      SocketEvent.GAME_STARTED,
      game
    );
    return game;
  }

  await redisClient.LPUSH(
    `${RedisKeys.GAMES_QUEUE}:${timeLimit}`,
    String(userId)
  );

  return 'OK';
}

export async function handleLeaveQueueByUser(
  userId: number,
  data: JoinGameQueueDto
) {
  const key = `${RedisKeys.GAMES_QUEUE}:${data.timeLimit}`;

  await redisClient.LREM(key, 0, String(userId));

  return 'OK';
}

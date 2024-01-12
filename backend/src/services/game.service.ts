import { NotFoundException } from '../exceptions';
import { CreateGameDto, UpdateGameDto } from '../interfaces/game.interface';
import { GameRepository } from '../repositories/game.repository';

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
 * Get game by id
 *
 * @param id
 *
 * @returns game
 */
export async function getById(id: number) {
  return GameRepository.findOneBy({ id });
}

/**
 * Get game by id or fail
 *
 * @param id
 *
 * @returns game
 */
export async function getByIdOrFail(id: number) {
  const game = await getById(id);

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
 * Delete game by id
 *
 * @param id
 */
export async function remove(id: number) {
  const game = await getByIdOrFail(id);

  await GameRepository.remove(game);

  return game;
}

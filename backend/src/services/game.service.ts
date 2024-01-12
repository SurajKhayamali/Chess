import { NotFoundException } from '../exceptions';
import { CreateGameDto, UpdateGameDto } from '../interfaces/game.interface';
import { GameRepository } from '../repositories/game.repository';

export async function create(createGameDto: CreateGameDto) {
  const game = GameRepository.create(createGameDto);
  await GameRepository.save(game);
  return game;
}

export async function getAll() {
  const games = await GameRepository.find();
  return games;
}

export async function getById(id: number) {
  return GameRepository.findOneBy({ id });
}

export async function getByIdOrFail(id: number) {
  const game = await getById(id);

  if (!game) {
    throw new NotFoundException('Game not found');
  }

  return game;
}

export async function update(id: number, updateGameDto: UpdateGameDto) {
  const game = await getByIdOrFail(id);

  GameRepository.merge(game, updateGameDto);

  await GameRepository.save(game);

  return game;
}

export async function remove(id: number) {
  const game = await getByIdOrFail(id);

  await GameRepository.remove(game);
}

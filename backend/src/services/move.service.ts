import { NotFoundException } from '../exceptions';
import { CreateMoveDto, UpdateMoveDto } from '../interfaces/move.interface';
import { MoveRepository } from '../repositories/move.repository';

/**
 * Create a new move
 *
 * @param createMoveDto
 *
 * @returns move
 */
export async function create(createMoveDto: CreateMoveDto) {
  const move = MoveRepository.create(createMoveDto);
  await MoveRepository.save(move);
  return move;
}

/**
 * Get all moves
 *
 * @returns moves
 */
export async function getAll() {
  const moves = await MoveRepository.find();
  return moves;
}

/**
 * Get move by id
 *
 * @param id
 *
 * @returns move
 */
export async function getById(id: number) {
  return MoveRepository.findOneBy({ id });
}

/**
 * Get move by id or fail
 *
 * @param id
 *
 * @returns move
 */
export async function getByIdOrFail(id: number) {
  const move = await getById(id);

  if (!move) {
    throw new NotFoundException('Move not found');
  }

  return move;
}

/**
 * Update move by id
 *
 * @param id
 * @param updateMoveDto
 *
 * @returns move
 */
export async function update(id: number, updateMoveDto: UpdateMoveDto) {
  const move = await getByIdOrFail(id);

  MoveRepository.merge(move, updateMoveDto);

  await MoveRepository.save(move);

  return move;
}

/**
 * Delete move by id
 *
 * @param id
 */
export async function remove(id: number) {
  const move = await getByIdOrFail(id);

  await MoveRepository.remove(move);

  return move;
}

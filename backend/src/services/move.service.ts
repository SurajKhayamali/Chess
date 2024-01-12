import { NotFoundException } from '../exceptions';
import { CreateMoveDto, UpdateMoveDto } from '../interfaces/move.interface';
import { MoveRepository } from '../repositories/move.repository';

export async function create(createMoveDto: CreateMoveDto) {
  const move = MoveRepository.create(createMoveDto);
  await MoveRepository.save(move);
  return move;
}

export async function getAll() {
  const moves = await MoveRepository.find();
  return moves;
}

export async function getById(id: number) {
  return MoveRepository.findOneBy({ id });
}

export async function getByIdOrFail(id: number) {
  const move = await getById(id);

  if (!move) {
    throw new NotFoundException('Move not found');
  }

  return move;
}

export async function update(id: number, updateMoveDto: UpdateMoveDto) {
  const move = await getByIdOrFail(id);

  MoveRepository.merge(move, updateMoveDto);

  await MoveRepository.save(move);

  return move;
}

export async function remove(id: number) {
  const move = await getByIdOrFail(id);

  await MoveRepository.remove(move);
}

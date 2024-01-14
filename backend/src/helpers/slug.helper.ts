import {
  ALPHABET_SET,
  NUMBER_SET,
  RANDOMIZED_CHARACTER_LENGTH_FOR_SLUG,
} from '../constants/slug.constant';

const RADIX_VALUE = 36;

function getUniqueIdFromTimestamp(): string {
  return new Date().getTime().toString(RADIX_VALUE);
}

// function getTimeStampFromUniqueIdGenerated(id: string): number {
//   return parseInt(id, RADIX_VALUE);
// }

export function getRandomString(length: number): string {
  const uniqueIdFromTimestamp = getUniqueIdFromTimestamp();

  const characters = ALPHABET_SET + NUMBER_SET;

  let result = '';

  const charactersLength = characters.length;
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return `${result}-${uniqueIdFromTimestamp}`;
}

export function generateSlug(): string {
  return getRandomString(RANDOMIZED_CHARACTER_LENGTH_FOR_SLUG);
}

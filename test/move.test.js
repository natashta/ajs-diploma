import { allowedMove, allowedAttack } from '../src/js/chooseindex.js';
import { unique } from '../src/js/utils';

test('allowed attacks', () => {
  const distance = 2;
  const position = 19;

  const expected = [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 17, 18, 20, 21, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37];
  const received = allowedAttack(position, distance);
  expect(received).toEqual(expected);
});

test('allowed attacks2', () => {
  const distance = 2;
  const position = 6;

  const expected = [4, 5, 7, 12, 13, 14, 15, 20, 21, 22, 23];
  const received = allowedAttack(position, distance);
  expect(received).toEqual(expected);
});

test('allowed moves', () => {
  const distance = 1;
  const position = 10;

  const expected = [1, 2, 3, 9, 11, 17, 18, 19];
  const arr = allowedMove(position, distance);
  const received = unique(arr);
  expect(received).toEqual(expected);
});

test('allowed moves2', () => {
  const distance = 2;
  const position = 56;

  const expected = [40, 42, 48, 49, 57, 58];
  const arr = allowedMove(position, distance);
  const received = unique(arr);
  expect(received).toEqual(expected);
});

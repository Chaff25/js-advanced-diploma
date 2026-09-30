import {
  getAvailableMoves,
  getAvailableAttacks,
  toCoords,
  toIndex,
  isInBoard,
} from '../utils/positions';
import Swordsman from '../characters/Swordsman';
import Bowman from '../characters/Bowman';
import Magician from '../characters/Magician';

const BS = 8;

describe('toCoords / toIndex / isInBoard', () => {
  test('toCoords', () => {
    expect(toCoords(0, BS)).toEqual({ row: 0, col: 0 });
    expect(toCoords(9, BS)).toEqual({ row: 1, col: 1 });
  });

  test('toIndex', () => {
    expect(toIndex(0, 0, BS)).toBe(0);
    expect(toIndex(1, 1, BS)).toBe(9);
  });

  test('isInBoard', () => {
    expect(isInBoard(0, 0, BS)).toBe(true);
    expect(isInBoard(7, 7, BS)).toBe(true);
    expect(isInBoard(-1, 0, BS)).toBe(false);
    expect(isInBoard(8, 0, BS)).toBe(false);
  });
});

describe('getAvailableMoves', () => {
  test('Swordsman в центре поля ходит на 4 клетки', () => {
    const swordsman = new Swordsman(1);
    const position = toIndex(3, 3, BS); // (3,3)
    const moves = getAvailableMoves(swordsman, position, BS, new Set());
    expect(moves).toContain(toIndex(7, 3, BS));
    expect(moves).toContain(toIndex(3, 7, BS));
    expect(moves).not.toContain(toIndex(7, 7, BS));
  });

  test('Swordsman в углу ходит меньше', () => {
    const swordsman = new Swordsman(1);
    const position = 0; // (0,0)
    const moves = getAvailableMoves(swordsman, position, BS, new Set());
    expect(moves).toContain(toIndex(0, 1, BS));
    expect(moves).toContain(toIndex(1, 0, BS));
    expect(moves).not.toContain(0);
  });

  test('Bowman ходит на 2', () => {
    const bowman = new Bowman(1);
    const position = toIndex(3, 3, BS);
    const moves = getAvailableMoves(bowman, position, BS, new Set());
    expect(moves).toContain(toIndex(3, 5, BS));
    expect(moves).not.toContain(toIndex(3, 6, BS));
  });

  test('Magician ходит на 1', () => {
    const magician = new Magician(1);
    const position = toIndex(3, 3, BS);
    const moves = getAvailableMoves(magician, position, BS, new Set());
    expect(moves).toContain(toIndex(3, 4, BS));
    expect(moves).not.toContain(toIndex(3, 5, BS));
  });

  test('не проходит сквозь занятые клетки', () => {
    const swordsman = new Swordsman(1);
    const position = toIndex(3, 3, BS);
    const occupied = new Set([toIndex(3, 4, BS)]); 
    const moves = getAvailableMoves(swordsman, position, BS, occupied);
    expect(moves).not.toContain(toIndex(3, 5, BS)); 
    expect(moves).not.toContain(toIndex(3, 4, BS)); 
  });
});

describe('getAvailableAttacks', () => {
  test('Swordsman атакует только соседние клетки', () => {
    const swordsman = new Swordsman(1);
    const position = toIndex(3, 3, BS);
    const occupied = new Set([toIndex(3, 4, BS)]);
    const attacks = getAvailableAttacks(swordsman, position, BS, occupied);
    expect(attacks).toEqual([toIndex(3, 4, BS)]);
  });

  test('Bowman атакует на 2 клетки, но не через других', () => {
    const bowman = new Bowman(1);
    const position = toIndex(3, 3, BS);
    const occupied = new Set([toIndex(3, 4, BS)]);
    const attacks = getAvailableAttacks(bowman, position, BS, occupied);
    expect(attacks).toEqual([toIndex(3, 4, BS)]);
  });

  test('Magician атакует на 4 клетки', () => {
    const magician = new Magician(1);
    const position = toIndex(3, 3, BS);
    const occupied = new Set([toIndex(3, 7, BS)]);
    const attacks = getAvailableAttacks(magician, position, BS, occupied);
    expect(attacks).toContain(toIndex(3, 7, BS));
  });

  test('не атакует пустые клетки', () => {
    const swordsman = new Swordsman(1);
    const position = toIndex(3, 3, BS);
    const attacks = getAvailableAttacks(swordsman, position, BS, new Set());
    expect(attacks).toEqual([]);
  });
});
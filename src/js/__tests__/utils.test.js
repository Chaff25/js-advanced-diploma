import { calcTileType, formatCharacterInfo } from '../utils';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';

describe('formatCharacterInfo', () => {
  test('возвращает пустую строку, если персонаж не передан', () => {
    expect(formatCharacterInfo``).toBe('');
    expect(formatCharacterInfo`${undefined}`).toBe('');
    expect(formatCharacterInfo`${null}`).toBe('');
  });

  test('форматирует информацию о персонаже 1-го уровня', () => {
    const bowman = new Bowman(1);
    expect(formatCharacterInfo`${bowman}`).toBe('🎖1 ⚔25 🛡25 ❤50');
  });

  test('форматирует информацию о персонаже 3-го уровня', () => {
    const bowman = new Bowman(3);
    expect(formatCharacterInfo`${bowman}`).toBe('🎖3 ⚔81 🛡81 ❤100');
  });

  test('корректно выводит атаку/защиту Daemon', () => {
    const daemon = new Daemon(2);
    expect(formatCharacterInfo`${daemon}`).toBe('🎖2 ⚔18 🛡18 ❤100');
  });
});

describe('calcTileType', () => {
  describe('boardSize = 8', () => {
    test('index 0 — top-left', () => {
      expect(calcTileType(0, 8)).toBe('top-left');
    });

    test('index 7 — top-right', () => {
      expect(calcTileType(7, 8)).toBe('top-right');
    });

    test('index 56 — bottom-left', () => {
      expect(calcTileType(56, 8)).toBe('bottom-left');
    });

    test('index 63 — bottom-right', () => {
      expect(calcTileType(63, 8)).toBe('bottom-right');
    });

    test('index 1 — top', () => {
      expect(calcTileType(1, 8)).toBe('top');
    });

    test('index 6 — top', () => {
      expect(calcTileType(6, 8)).toBe('top');
    });

    test('index 57 — bottom', () => {
      expect(calcTileType(57, 8)).toBe('bottom');
    });

    test('index 62 — bottom', () => {
      expect(calcTileType(62, 8)).toBe('bottom');
    });

    test('index 8 — left', () => {
      expect(calcTileType(8, 8)).toBe('left');
    });

    test('index 16 — left', () => {
      expect(calcTileType(16, 8)).toBe('left');
    });

    test('index 15 — right', () => {
      expect(calcTileType(15, 8)).toBe('right');
    });

    test('index 23 — right', () => {
      expect(calcTileType(23, 8)).toBe('right');
    });

    test('index 27 — center', () => {
      expect(calcTileType(27, 8)).toBe('center');
    });
  });

  describe('boardSize = 7', () => {
    test('index 0 — top-left', () => {
      expect(calcTileType(0, 7)).toBe('top-left');
    });

    test('index 6 — top-right', () => {
      expect(calcTileType(6, 7)).toBe('top-right');
    });

    test('index 7 — left', () => {
      expect(calcTileType(7, 7)).toBe('left');
    });

    test('index 48 — bottom-right', () => {
      expect(calcTileType(48, 7)).toBe('bottom-right');
    });

    test('index 24 — center', () => {
      expect(calcTileType(24, 7)).toBe('center');
    });
  });
});
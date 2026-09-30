const MOVE_DISTANCE = {
  swordsman: 4,
  undead: 4,
  bowman: 2,
  vampire: 2,
  magician: 1,
  daemon: 1,
};

const ATTACK_DISTANCE = {
  swordsman: 1,
  undead: 1,
  bowman: 2,
  vampire: 2,
  magician: 4,
  daemon: 4,
};

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

export function toCoords(index, boardSize) {
  return { row: Math.floor(index / boardSize), col: index % boardSize };
}

export function toIndex(row, col, boardSize) {
  return row * boardSize + col;
}

export function isInBoard(row, col, boardSize) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

export function getAvailableMoves(character, position, boardSize, occupied) {
  const distance = MOVE_DISTANCE[character.type] ?? 0;
  const { row, col } = toCoords(position, boardSize);
  const result = [];

  for (const [dr, dc] of DIRECTIONS) {
    for (let step = 1; step <= distance; step += 1) {
      const r = row + dr * step;
      const c = col + dc * step;

      if (!isInBoard(r, c, boardSize)) break;

      const index = toIndex(r, c, boardSize);
      if (occupied.has(index)) break; 

      result.push(index);
    }
  }

  return result;
}

export function getAvailableAttacks(character, position, boardSize, occupied) {
  const distance = ATTACK_DISTANCE[character.type] ?? 0;
  const { row, col } = toCoords(position, boardSize);
  const result = [];

  for (const [dr, dc] of DIRECTIONS) {
    for (let step = 1; step <= distance; step += 1) {
      const r = row + dr * step;
      const c = col + dc * step;

      if (!isInBoard(r, c, boardSize)) break;

      const index = toIndex(r, c, boardSize);
      if (occupied.has(index)) {
        result.push(index);
        break; 
      }
    }
  }

  return result;
}
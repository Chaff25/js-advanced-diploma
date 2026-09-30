import GameState from '../GameState';

describe('GameState', () => {
  test('новый стейт — ход игрока', () => {
    const state = new GameState();
    expect(state.turn).toBe('player');
  });

  test('from(null) → null', () => {
    expect(GameState.from(null)).toBeNull();
  });

  test('from() восстанавливает ход', () => {
    const state = GameState.from({ turn: 'enemy' });
    expect(state.turn).toBe('enemy');
  });
});
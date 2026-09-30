import GameStateService from '../GameStateService';

describe('GameStateService', () => {
  test('save вызывает setItem с сериализованным состоянием', () => {
    const storage = { setItem: jest.fn(), getItem: jest.fn() };
    const service = new GameStateService(storage);

    service.save({ turn: 'player' });

    expect(storage.setItem).toHaveBeenCalledWith('state', JSON.stringify({ turn: 'player' }));
  });

  test('load возвращает распарсенный объект', () => {
    const storage = { setItem: jest.fn(), getItem: jest.fn(() => '{"turn":"enemy"}') };
    const service = new GameStateService(storage);

    expect(service.load()).toEqual({ turn: 'enemy' });
  });

  test('load выбрасывает ошибку при невалидном JSON', () => {
    const storage = { setItem: jest.fn(), getItem: jest.fn(() => 'not json') };
    const service = new GameStateService(storage);

    expect(() => service.load()).toThrow('Invalid state');
  });

  test('load возвращает null, если в storage пусто', () => {
    const storage = { setItem: jest.fn(), getItem: jest.fn(() => null) };
    const service = new GameStateService(storage);

    expect(service.load()).toBeNull();
  });
});
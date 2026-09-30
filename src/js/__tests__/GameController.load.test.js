import GameController from '../GameController';
import GameStateService from '../GameStateService';

describe('GameController.onLoadGameClick', () => {
  test('при ошибке load вызывается showError', () => {
    const gamePlay = {
      showError: jest.fn(),
      boardEl: { classList: { remove: jest.fn(), add: jest.fn() }, style: {} },
      redrawPositions: jest.fn(),
    };
    const stateService = { load: jest.fn(() => { throw new Error('Invalid state'); }) };

    const controller = new GameController(gamePlay, stateService);
    controller.onLoadGameClick();

    expect(gamePlay.showError).toHaveBeenCalledWith('Не удалось загрузить состояние');
  });
});
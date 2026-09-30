import GameController from '../GameController';
import GamePlay from '../GamePlay';

describe('GameController.onLoadGameClick', () => {
  beforeEach(() => {
    global.alert = jest.fn();
    jest.spyOn(GamePlay, 'showError').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('при ошибке load вызывается GamePlay.showError', () => {
    const gamePlay = {
      boardEl: { classList: { remove: jest.fn(), add: jest.fn() }, style: {} },
      redrawPositions: jest.fn(),
    };
    const stateService = { load: jest.fn(() => { throw new Error('Invalid state'); }) };

    const controller = new GameController(gamePlay, stateService);
    controller.onLoadGameClick();

    expect(GamePlay.showError).toHaveBeenCalledWith('Не удалось загрузить состояние');
  });
});
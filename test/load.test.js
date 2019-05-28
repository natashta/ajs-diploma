import GamePlay from '../src/js/GamePlay.js';
import GameController from '../src/js/GameController.js';
import GameStateService from '../src/js/GameStateService.js';


const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const GameController = new GameController(gamePlay, stateService);

jest.mock('../src/js/GameController.js');
const status = {
    level: 1, 
    turn: 'user',
    user: {attack: 10, defence: 40, distance: 1, health: 50},
    score: 30,
}

beforeEach(() => {
  jest.resetAllMocks();
});

test('load data', () => {
    GameController.onLoadGame().mockReturnValue(status);
    const expected = '{"level": 1, "turn": "user", "user": {"attack": 10, "defence": 40, "distance": 1, "health": 50}, "score": 30}';

    gameCtrl.onLoadGame().then((res) => {
    expect(res).toEqual(expected);
  });
});

test('load error', () => {
  GameController.onLoadGame().mockRejectedValue('Invalid state');

  gameCtrl.onLoadGame().catch((err) => {
  expect(err).toThrow();
  });
});
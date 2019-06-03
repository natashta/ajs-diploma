import GamePlay from '../src/js/GamePlay.js';
import GameController from '../src/js/GameController.js';
import GameStateService from '../src/js/GameStateService.js';


const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const gameController = new GameController(gamePlay, stateService);

jest.mock('../src/js/GameController.js');
const state = {
  level: 1,
  turn: 'user',
  user: {
    attack: 10, defence: 40, distance: 1, health: 50,
  },
  score: 30,
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('load data', () => {
  gameController.onLoadGame().mockReturnValue(state);
  const expected = '{"level": 1, "turn": "user", "user": {"attack": 10, "defence": 40, "distance": 1, "health": 50}, "score": 30}';

  gameController.onLoadGame().then((res) => {
    expect(res).toEqual(expected);
  });
});

test('load error', () => {
  gameController.onLoadGame().mockRejectedValue('Invalid state');

  gameController.onLoadGame().catch((err) => {
    expect(err).toThrow();
  });
});

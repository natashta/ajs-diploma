export default class GameState {
  static from(object) {
    // TODO: create object
    if (typeof (object) === 'object') {
      return {
        userPos: object.userPositionedTeam,
        enemyPos: object.enemyPositionedTeam,
        selected: object.selected,
        turn: object.turn,
        level: object.level,
        score: object.score,
      };
    }
    return null;
  }
}

export default class GameState {
  static from(object) {
    // TODO: create object
    if (typeof (object) === 'object') {
      return {
        userPos: object.userPositionedTeam,
        enemyPos: object.enemyPositionedTeam,
        allPos: object.positions,
        selected: object.selected,
        selectChar: object.selected,
        tur: object.turn,
        level: object.level,
        score: object.score,
      };
    }
    return null;
  }
}

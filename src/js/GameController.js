import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
//import Team from './Team';
import { userTeam, enemyTeam }from './classes/arrClasses';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    let theme = themes.prairie;
   
    this.gamePlay.drawUi(theme);
    this.initTeams();
    this.gamePlay.redrawPositions(this.positions);
  }

  initTeams() {
    const userPos = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    const enemyPos = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

  const getUserPos = () => {
    const random = Math.floor(Math.random() * userPos.length);
    const result = userPos[random];
    return result;
  };
  
  const getEnemyPos = () => {
    const random = Math.floor(Math.random() * enemyPos.length);
    const result = enemyPos[random];
    return result;
  };

  const user = generateTeam(userTeam, 1, 2);
  const enemy = generateTeam(enemyTeam, 1, 2);

  let userPositionedTeam = [];
  let enemyPositionedTeam = [];

    user.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getUserPos());
      userPositionedTeam.push(positionedCharacter);
    });
    enemy.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getEnemyPos());
      enemyPositionedTeam.push(positionedCharacter);
    });

    this.positions = [...userPositionedTeam, ...enemyPositionedTeam];
  }


  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}

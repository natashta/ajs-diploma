import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
// import Team from './Team';
import { userTeam, enemyTeam } from './classes/arrClasses';
import heroInfo from './classes/shortHeroInfo';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    const theme = themes.prairie;

    this.gamePlay.drawUi(theme);
    this.initTeams();
    this.gamePlay.redrawPositions(this.positions);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
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

    const userPositionedTeam = [];
    const enemyPositionedTeam = [];

    user.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getUserPos());
      userPositionedTeam.push(positionedCharacter);
    });
    enemy.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getEnemyPos());
      enemyPositionedTeam.push(positionedCharacter);
    });

    this.positions = userPositionedTeam.concat(enemyPositionedTeam);
  }


  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const pointedHero = this.positions.filter(i => i.position === index);
    console.log(pointedHero[0].character);
    const shortInfo = heroInfo(pointedHero[0].character);
    for (const i of this.positions) {
      if (i.position === index) {
        this.gamePlay.showCellTooltip(shortInfo, index);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }
}

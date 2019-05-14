import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
import { userTeam, enemyTeam }from './classes/arrClasses';

const userPos = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
const enemyPos = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
 
const getUserPos = () => {
    const userRandom = Math.floor(Math.random() * userPos.length);
    const result = userPos[userRandom];
    return result;
  };
  
const getEnemyPos = () => {
    const enemyRandom = Math.floor(Math.random() * enemyPos.length);
    const result = enemyPos[enemyRandom];
    return result;
  };

    const user = generateTeam(userTeam, 1, 2);
    const enemy = generateTeam(enemyTeam, 1, 2);

  let userPositionedTeam = [];
  let enemyPositionedTeam = [];
  let allPositions = [];

   export default class Team {
    constructor(level, count) {
        this.level = level;
        this.count = count;
    }

    getTeamPosition() {
    user.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getUserPos());
      userPositionedTeam.push(positionedCharacter);
    });
    enemy.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getEnemyPos());
      enemyPositionedTeam.push(positionedCharacter);
    });

    allPositions = [...userPositionedTeam, ...enemyPositionedTeam];
  }
}

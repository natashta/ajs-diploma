import themes from './themes';
import GamePlay from './GamePlay';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
// import Team from './Team';
import { userTeam, enemyTeam } from './classes/arrClasses';
import heroInfo from './classes/shortHeroInfo';
import cursors from './cursors';
import { allowedMove, allowedAttack } from './chooseIndex';

const userPos = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
const enemyPos = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
const userTypes = ['swordsman', 'bowman', 'magician'];
const enemyTypes = ['vampire', 'undead', 'daemon'];
const user = generateTeam(userTeam, 1, 2);
const enemy = generateTeam(enemyTeam, 1, 2);

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.turn = 'user';
    this.selected = '';
    this.level = 1;
    this.alive = 2;
    this.userPositionedTeam = [];
    this.enemyPositionedTeam = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.newGame();
    this.gamePlay.drawUi(themes.prairie);
    this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
    this.gamePlay.redrawPositions(this.positions);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  newGame(){
    if (this.level === 1) {
    this.initUserTeam();
    this.initEnemyTeam();
  }
}
 
  initUserTeam() {
    const getUserPos = () => {
      const random = Math.floor(Math.random() * userPos.length);
      const result = userPos[random];
      return result;
    };

    user.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getUserPos());
      this.userPositionedTeam.push(positionedCharacter);
    });
    
    return this.userPositionedTeam;
    
  }

  initEnemyTeam() {
    const getEnemyPos = () => {
      const random = Math.floor(Math.random() * enemyPos.length);
      const result = enemyPos[random];
      return result;
    };
    enemy.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getEnemyPos());
      this.enemyPositionedTeam.push(positionedCharacter);
    });
    return this.enemyPositionedTeam;
  }

  attack(index, attacker, target) {
    const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
    if (this.turn === undefined) {
      throw new TypeError('Что-то пошло не так');
    }
    target.health -= damage;
    if (target.health - damage <= 0) {
      //Надо убрать желтый кружок, но селектеда нет
      console.log('killed');
      this.enemyPositionedTeam = this.enemyPositionedTeam.filter(item => item.position !== index);
      this.userPositionedTeam = this.userPositionedTeam.filter(item => item.position !== index);
      this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
      this.gamePlay.redrawPositions(this.positions);
      if (this.userPositionedTeam.length === 0) {
        alert('Game over');
      } else if (this.enemyPositionedTeam.length === 0) {
        // Если 4 уровень, то алерт победа и заблокировать
        alert('Переход на следующий уровень');
        this.alive = this.userPositionedTeam.length;
        console.log(this.userPositionedTeam);
        this.levelUp();
      }
    }
    this.gamePlay.showDamage(index, damage).then(() => {
      this.gamePlay.redrawPositions(this.positions);
    });
  }

  enemyAction() {
    if (this.turn !== 'enemy') return;
    const getEnemyChar = () => {
      const random = Math.floor(Math.random() * this.enemyPositionedTeam.length);
      const result = this.enemyPositionedTeam[random];
      return result;
    };

    if (getEnemyChar()) {
      this.enemyAttackIndex = allowedAttack(getEnemyChar().position, getEnemyChar().character.distanceAttack);
      this.enemyMoveIndex = allowedMove(getEnemyChar().position, getEnemyChar().character.distance);
      // если в массиве атаки есть индекс команды игрока, то напасть
      for (const userPos of this.userPositionedTeam) {
        const attackCellKey = this.enemyAttackIndex.indexOf(userPos.position);
        if (attackCellKey !== -1) {
          const attackCell = this.enemyAttackIndex[attackCellKey];
          this.attack(attackCell, getEnemyChar().character, userPos.character);
          this.turn = 'user';
        } else {
          //хорошо бы еще убрать отсюда позиции персов игрока
      this.newPos = allowedMove(getEnemyChar().position, getEnemyChar().character.distance);
      const getEnemyPos = () => {
        const random = Math.floor(Math.random() * this.newPos.length);
        const result = this.newPos[random];
        return result;
      };
      getEnemyChar().position = getEnemyPos();
      this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
      this.gamePlay.redrawPositions(this.positions);
      this.turn = 'user';
      } 
    }
    }   
  }

  levelUpChar(arr) {
    arr.forEach((item) => {
      item.character.level += 1;
      const formula = (1.8 - item.character.health / 100);
      const attack = Math.max(item.character.attack, item.character.attack * formula);
      const defence = Math.max(item.character.defence, item.character.defence * formula);

      item.character.attack = Math.floor(attack);
      item.character.defence = Math.floor(defence);
      item.character.health += 80;

      if (item.character.health >= 100) {
        item.character.health = 100;
      }
    });
  }

  levelUp() {
    this.level += 1;
    if (this.level > 4) {
      this.level = 1;
    }

    let theme;
    if (this.level === 1) { theme = themes.prairie;}
    if (this.level === 2) { theme = themes.desert;}
    if (this.level === 3) { theme = themes.arctic;}
    if (this.level === 4) { theme = themes.mountain;}

    this.gamePlay.drawUi(theme);
    
    this.levelUpChar(this.userPositionedTeam);

    const nEnemy = this.userPositionedTeam.length + 1;
    const user = generateTeam(userTeam, this.level, 1);
    const enemy = generateTeam(enemyTeam, this.level, nEnemy);

    this.initUserTeam();
    this.initEnemyTeam();

    this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
    this.gamePlay.redrawPositions(this.positions);
    console.log(this.userPositionedTeam, this.enemyPositionedTeam);
  }

  onCellClick(index) {
    // TODO: react to click
    const selectedHero = this.positions.filter(i => i.position === index);
    if (selectedHero[0] !== undefined && userTypes.includes(selectedHero[0].character.type)) {
      if (this.selected) {
        this.gamePlay.deselectCell(this.selected.position);
      }
      this.gamePlay.selectCell(index);
      this.selected = selectedHero[0];
      this.attackIndex = allowedAttack(this.selected.position, this.selected.character.distanceAttack);
      this.moveIndex = allowedMove(this.selected.position, this.selected.character.distance);
    } else if (this.selected) {
      if (this.attackIndex.includes(index) && selectedHero.length && enemyTypes.includes(selectedHero[0].character.type)) {
        const target = this.enemyPositionedTeam.filter(item => item.position === index);
        this.attack(index, this.selected.character, target[0].character);
        this.turn = 'enemy';
        this.enemyAction();
      } else if (this.moveIndex.includes(index)) {
        if (this.turn !== 'user') {
          this.enemyAction();
        }
        this.gamePlay.deselectCell(this.selected.position);
        this.selected.position = index;
        this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
        this.gamePlay.redrawPositions(this.positions);
        this.gamePlay.selectCell(index);
        this.turn = 'enemy';
        this.enemyAction();
      } else {
        GamePlay.showError('Недопустимое действие');
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const selectedHero = this.positions.filter(i => i.position === index);
    if (selectedHero[0] !== undefined) {
      const shortInfo = heroInfo(selectedHero[0].character);

      for (const i of this.positions) {
        if (i.position === index && userTypes.includes(selectedHero[0].character.type)) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.showCellTooltip(shortInfo, index);
        } else if (i.position === index && enemyTypes.includes(selectedHero[0].character.type)) {
          this.gamePlay.setCursor(cursors.notallowed);
          this.gamePlay.showCellTooltip(shortInfo, index);
        }
      }
    }
    if (this.selected && this.moveIndex.includes(index) && !selectedHero.length) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    } else if (this.selected && this.attackIndex.includes(index) && selectedHero.length && enemyTypes.includes(selectedHero[0].character.type)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.selected.position != index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.hideCellTooltip(index);
  }
}

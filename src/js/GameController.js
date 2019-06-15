import themes from './themes';
import GamePlay from './GamePlay';
import GameState from './GameState';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
import { userTeam, enemyTeam } from './classes/arrClasses';
import heroInfo from './classes/shortHeroInfo';
import cursors from './cursors';
import { allowedMove, allowedAttack } from './chooseIndex';

const userPos = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
const enemyPos = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
const userTypes = ['swordsman', 'bowman', 'magician'];
const enemyTypes = ['daemon', 'undead', 'vampire'];
const user = generateTeam(userTeam, 1, 2);
const enemy = generateTeam(enemyTeam, 1, 2);
/* const getUserPos = () => {
  const random = Math.floor(Math.random() * userPos.length);
  const result = userPos[random];
  return result;
};

  const getEnemyPos = () => {
  const random = Math.floor(Math.random() * enemyPos.length);
  const result = enemyPos[random];
  return result;
}; */
function getUserPos(max, arr) {
  while (arr.length <= max) {
    const random = Math.floor(Math.random() * userPos.length);
    const result = userPos[random];
    if (!arr.includes(result)) {
      return result;
    }
  }
}

function getEnemyPos(max, arr) {
  while (arr.length <= max) {
    const random = Math.floor(Math.random() * enemyPos.length);
    const result = enemyPos[random];
    if (!arr.includes(result)) {
      return result;
    }
  }
}

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
    this.score = 0;
    this.lock = false;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    if (!this.lock) {
      this.onNewGame();
      this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
      this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
      this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
      this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
      this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
      this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    }
  }

  onNewGame() {
    this.level = 1;
    this.turn = 'user';
    this.selected = '';
    this.alive = 2;
    this.userPositionedTeam = [];
    this.enemyPositionedTeam = [];
    this.score = 0;
    this.lock = false;
    this.initUserTeam();
    this.initEnemyTeam();
    this.gamePlay.drawUi(themes.prairie);
    if (this.userPositionedTeam.length) {
      this.userPositionedTeam.forEach((item) => {
        item.character.health = 50;
      });
    }
    if (this.enemyPositionedTeam.length) {
      this.enemyPositionedTeam.forEach((item) => {
        item.character.health = 50;
      });
    }
    this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
    this.gamePlay.redrawPositions(this.positions);
  }

  onSaveGame() {
    const status = {
      level: this.level,
      turn: this.turn,
      selected: this.selected,
      userPos: this.userPositionedTeam,
      enemyPos: this.enemyPositionedTeam,
      score: this.score,
    };
    this.stateService.save(GameState.from(status));
    console.log('game saved');
  }

  onLoadGame() {
    const load = this.stateService.load();
    if (load) {
      this.level = load.level;
      this.turn = load.turn;
      this.themes = load.themes;
      this.score = load.score;
      this.selected = load.selected;
      this.userPositionedTeam = load.userPos;
      this.enemyPositionedTeam = load.enemyPos;
    }
    let theme;
    if (this.level === 1) { theme = themes.prairie; }
    if (this.level === 2) { theme = themes.desert; }
    if (this.level === 3) { theme = themes.arctic; }
    if (this.level === 4) { theme = themes.mountain; }
    this.gamePlay.drawUi(theme);
    this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
    this.gamePlay.redrawPositions(this.positions);
    this.gamePlay.selectCell(this.selected.position);
    if (this.turn === 'enemy') { this.enemyAction(); }
  }

  initUserTeam() {
    user.forEach((character) => {
      const checkArr = this.userPositionedTeam.map(item => item.position);
      const idx = getUserPos(user.length, checkArr);
      const positionedCharacter = new PositionedCharacter(character, idx);
      this.userPositionedTeam = this.userPositionedTeam.concat(positionedCharacter);
    });
    return this.userPositionedTeam;
  }

  initEnemyTeam() {
    enemy.forEach((character) => {
      const checkArr = this.enemyPositionedTeam.map(item => item.position);
      const idx = getEnemyPos(enemy.length, checkArr);
      const positionedCharacter = new PositionedCharacter(character, idx);
      this.enemyPositionedTeam = this.enemyPositionedTeam.concat(positionedCharacter);
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
      this.gamePlay.deselectCell(index);
      console.log('killed');
      this.enemyPositionedTeam = this.enemyPositionedTeam.filter(item => item.position !== index);
      this.userPositionedTeam = this.userPositionedTeam.filter(item => item.position !== index);
      this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
      this.gamePlay.redrawPositions(this.positions);
      if (this.userPositionedTeam.length === 0) {
        this.lock = true;
        alert('Game over');
      } else if (this.enemyPositionedTeam.length === 0) {
        this.selected = '';
        this.userPositionedTeam.forEach((item) => {
          this.score += item.character.health;
        });
        this.alive = this.userPositionedTeam.length;

        alert(`${this.level + 1} уровень. Вы набрали ${this.score} очков `);
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
      for (const userPosition of this.userPositionedTeam) {
        const attackCellKey = this.enemyAttackIndex.indexOf(userPosition.position);
        if (attackCellKey !== -1) {
          const attackCell = this.enemyAttackIndex[attackCellKey];
          this.attack(attackCell, getEnemyChar().character, userPosition.character);
          this.turn = 'user';
          return;
        }
        this.newPos = allowedMove(getEnemyChar().position, getEnemyChar().character.distance);
        this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
        const busyIndexes = this.positions.map(item => item.position);
        const vacantIndexes = this.newPos.filter(item => busyIndexes.indexOf(item) === -1);
        const getEnemyPosition = () => {
          const random = Math.floor(Math.random() * vacantIndexes.length);
          const result = vacantIndexes[random];
          return result;
        };
        getEnemyChar().position = getEnemyPosition();
        this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
        this.gamePlay.redrawPositions(this.positions);
        this.turn = 'user';
        return;
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
      alert('Ура, вы победили!');
      this.level = 4;
      this.lock = true;
    }

    let theme;
    let n;
    if (this.level === 1) { theme = themes.prairie; n = 2; }
    if (this.level === 2) { theme = themes.desert; n = 1; }
    if (this.level === 3) { theme = themes.arctic; n = 2; }
    if (this.level === 4) { theme = themes.mountain; n = 2; }

    this.gamePlay.drawUi(theme);

    this.levelUpChar(this.userPositionedTeam);

    const newUserTeam = generateTeam(userTeam, this.level - 1, n);
    const newEnemyTeam = generateTeam(enemyTeam, this.level, n + this.alive);

    newUserTeam.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getUserPos());
      this.userPositionedTeam.push(positionedCharacter);
    });

    newEnemyTeam.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getEnemyPos());
      this.enemyPositionedTeam.push(positionedCharacter);
    });

    this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
    this.gamePlay.redrawPositions(this.positions);
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.lock) this.init();
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
        this.gamePlay.deselectCell(this.selected.position);
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
    if (this.lock) this.init();
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
    if (this.selected.position !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.hideCellTooltip(index);
  }
}

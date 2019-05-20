import themes from './themes';
import GamePlay from './GamePlay';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
// import Team from './Team';
import { userTeam, enemyTeam } from './classes/arrClasses';
import heroInfo from './classes/shortHeroInfo';
import cursors from './cursors';
import { allowedMove, allowedAttack } from './chooseIndex';

const userTypes = ['swordsman', 'bowman', 'magician'];
const enemyTypes = ['vampire', 'undead', 'daemon'];


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.turn = 'user';
    this.selected = '';
    this.userPositionedTeam = [];
    this.enemyPositionedTeam = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    const theme = themes.prairie;

    this.gamePlay.drawUi(theme);
    this.initTeams();
    this.gamePlay.redrawPositions(this.positions);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
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

    user.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getUserPos());
      this.userPositionedTeam.push(positionedCharacter);
    });
    enemy.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, getEnemyPos());
      this.enemyPositionedTeam.push(positionedCharacter);
    });

    this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
  }

  attack(index, attacker, target) {
    const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
    if (this.turn === undefined) {
        throw new TypeError('Что-то пошло не так');
      }
     
    if (target.health - damage > 0) {
        target.health -= damage; 
        this.turn = 'enemy';
        console.log('attack!');
      } 
    
      else if (target.health - damage <= 0) {
        console.log('killed');
        this.enemyPositionedTeam = this.enemyPositionedTeam.filter(item => item.position !== index);
        this.userPositionedTeam = this.userPositionedTeam.filter(item => item.position !== index);
        this.positions = this.userPositionedTeam.concat(this.enemyPositionedTeam);
        this.gamePlay.redrawPositions(this.positions);
    }
    this.gamePlay.showDamage(index, damage).then(() => {
    this.gamePlay.redrawPositions(this.positions)})
}

//если очередь компьютера, он атакует, если юзер в пределах аттаки или случайно ходит в позвоенных пределах.

enemyAction() {
  if (this.turn !== 'enemy') {
    console.log('Ошибка с очередью');
    return;
}

  for (const el of this.enemyPositionedTeam) {
    this.enemyAttackIndex = allowedAttack(el.position, el.character.distanceAttack)
    this.enemyMoveIndex = allowedMove(el.position, el.character.distance)
    //если в массиве атаки есть индекс команды игрока, то напасть
    for (const userPos of this.userPositionedTeam) {
    const attackCellKey = this.enemyAttackIndex.indexOf(userPos.position);
      if(attackCellKey !== -1) {
        const attackCell = this.enemyAttackIndex[attackCellKey];
        this.attack(attackCell, el.character, userPos.character);
        this.turn = 'user';
      }
    }
  }
    const getEnemyChar = () => {
      const random = Math.floor(Math.random() * this.enemyPositionedTeam.length);
      const result = this.enemyPositionedTeam[random];
      return result;
    };
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
    //console.log(getEnemyChar().position);
}

  onCellClick(index) {
    // TODO: react to click
    const selectedHero = this.positions.filter(i => i.position === index);
    if (selectedHero[0]!== undefined && userTypes.includes(selectedHero[0].character.type)) {
      if (this.selected) {
        this.gamePlay.deselectCell(this.selected.position);
      }
      this.gamePlay.selectCell(index);
      this.selected = selectedHero[0];
      this.attackIndex = allowedAttack(this.selected.position, this.selected.character.distanceAttack)
      this.moveIndex = allowedMove(this.selected.position, this.selected.character.distance)

    } else if (this.selected) {
      if (this.attackIndex.includes(index) && selectedHero.length && enemyTypes.includes(selectedHero[0].character.type)) {
        const target = this.enemyPositionedTeam.filter(item => item.position === index);
        this.attack(index, this.selected.character, target[0].character);
        this.turn = 'enemy';
        this.enemyAction();
      } else if (this.moveIndex.includes(index)) {
        if (this.turn !== 'user') {
          console.log('Ошибка с очередью');
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
    if (this.selected.position != index){
      this.gamePlay.deselectCell(index)
    }
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.hideCellTooltip(index);
  }
}

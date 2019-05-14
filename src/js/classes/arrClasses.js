import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Daemon from './Daemon';
import Magician from './Magician';
import Undead from './Undead';
import Vampire from './Vampire';

const arrClasses = [Bowman, Swordsman, Magician, Daemon, Undead, Vampire];

export const userTeam = arrClasses.slice(0, 3);

export const enemyTeam = arrClasses.slice(3, 6);

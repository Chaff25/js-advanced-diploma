import Character from '../Character';

export default class Swordsman extends Character {
  static BASE_ATTACK = 40;
  static BASE_DEFENCE = 10;

  constructor(level) {
    super(level, 'swordsman');
  }
}
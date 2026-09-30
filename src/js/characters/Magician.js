import Character from '../Character';

export default class Magician extends Character {
  static BASE_ATTACK = 10;

  static BASE_DEFENCE = 40;

  constructor(level) {
    super(level, 'magician');
  }
}
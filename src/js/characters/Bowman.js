import Character from '../Character';

export default class Bowman extends Character {
  static BASE_ATTACK = 25;
  static BASE_DEFENCE = 25;

  constructor(level) {
    super(level, 'bowman');
  }
}
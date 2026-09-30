import Character from '../Character';

export default class Daemon extends Character {
  static BASE_ATTACK = 10;
  static BASE_DEFENCE = 10;
  constructor(level) {
    super(level, 'daemon');
  }
}
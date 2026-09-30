/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  static BASE_ATTACK = 0;
  static BASE_DEFENCE = 0;

  constructor(level, type = 'generic') {
    if (new.target === Character) {
      throw new Error('Нельзя создавать объект класса Character напрямую');
    }

    this.level = 1;
    this.attack = new.target.BASE_ATTACK;
    this.defence = new.target.BASE_DEFENCE;
    this.health = 50;
    this.type = type;

    for (let i = 1; i < level; i += 1) this.levelUp();
  }

  levelUp() {
    this.level += 1;
    this.health = Math.min(this.health + 80, 100);
    this.attack = Math.max(this.attack, (this.attack * (80 + this.health)) / 100);
    this.defence = Math.max(this.defence, (this.defence * (80 + this.health)) / 100);
  }
}
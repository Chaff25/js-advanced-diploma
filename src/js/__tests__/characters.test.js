import Character from '../Character';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Vampire from '../characters/Vampire';
import Undead from '../characters/Undead';
import Daemon from '../characters/Daemon';

describe('Character и наследники', () => {
  test('new Character() выбрасывает исключение', () => {
    expect(() => new Character(1)).toThrow();
  });

  test('new Bowman() не выбрасывает исключение', () => {
    expect(() => new Bowman(1)).not.toThrow();
  });

  test('new Swordsman() не выбрасывает исключение', () => {
    expect(() => new Swordsman(1)).not.toThrow();
  });

  test('new Magician() не выбрасывает исключение', () => {
    expect(() => new Magician(1)).not.toThrow();
  });

  test('new Vampire() не выбрасывает исключение', () => {
    expect(() => new Vampire(1)).not.toThrow();
  });

  test('new Undead() не выбрасывает исключение', () => {
    expect(() => new Undead(1)).not.toThrow();
  });

  test('new Daemon() не выбрасывает исключение', () => {
    expect(() => new Daemon(1)).not.toThrow();
  });
});

describe('Характеристики персонажей 1-го уровня', () => {
  const cases = [
    [Bowman, 'bowman', 25, 25],
    [Swordsman, 'swordsman', 40, 10],
    [Magician, 'magician', 10, 40],
    [Vampire, 'vampire', 25, 25],
    [Undead, 'undead', 40, 10],
    [Daemon, 'daemon', 10, 10],
  ];

  test.each(cases)('%p уровень 1: attack=%p, defence=%p', (Class, type, attack, defence) => {
    const character = new Class(1);
    expect(character.level).toBe(1);
    expect(character.type).toBe(type);
    expect(character.attack).toBe(attack);
    expect(character.defence).toBe(defence);
    expect(character.health).toBe(50);
  });
});
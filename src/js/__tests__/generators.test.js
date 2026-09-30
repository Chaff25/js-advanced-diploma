import { characterGenerator, generateTeam } from '../generators';
import Team from '../Team';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';

const playerTypes = [Bowman, Swordsman, Magician];

describe('characterGenerator', () => {
  test('возвращает бесконечно новых персонажей', () => {
    const generator = characterGenerator(playerTypes, 2);

    for (let i = 0; i < 100; i += 1) {
      const { value, done } = generator.next();
      expect(done).toBe(false);
      expect(value).toBeDefined();
      expect(playerTypes.some((T) => value instanceof T)).toBe(true);
    }
  });

  test('уровень персонажа в диапазоне 1..maxLevel', () => {
    const generator = characterGenerator(playerTypes, 3);

    for (let i = 0; i < 100; i += 1) {
      const { value } = generator.next();
      expect(value.level).toBeGreaterThanOrEqual(1);
      expect(value.level).toBeLessThanOrEqual(3);
    }
  });
});

describe('generateTeam', () => {
  test('возвращает экземпляр Team', () => {
    const team = generateTeam(playerTypes, 2, 4);
    expect(team).toBeInstanceOf(Team);
  });

  test('содержит нужное количество персонажей', () => {
    const team = generateTeam(playerTypes, 2, 4);
    expect(team.characters).toHaveLength(4);
  });

  test('все персонажи из allowedTypes с уровнем 1..maxLevel', () => {
    const team = generateTeam(playerTypes, 3, 10);

    team.characters.forEach((c) => {
      expect(playerTypes.some((T) => c instanceof T)).toBe(true);
      expect(c.level).toBeGreaterThanOrEqual(1);
      expect(c.level).toBeLessThanOrEqual(3);
    });
  });

  test('работает с одним классом и maxLevel = 1', () => {
    const team = generateTeam([Bowman], 1, 3);
    expect(team.characters).toHaveLength(3);
    team.characters.forEach((c) => {
      expect(c).toBeInstanceOf(Bowman);
      expect(c.level).toBe(1);
    });
  });
});
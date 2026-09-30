import { calcDamage } from '../utils/damage';
import Swordsman from '../characters/Swordsman';
import Bowman from '../characters/Bowman';

describe('calcDamage', () => {
  test('обычный случай: атака - защита', () => {
    const attacker = new Swordsman(1); 
    const target = new Bowman(1);      
    expect(calcDamage(attacker, target)).toBe(15);
  });

  test('минимум 10% атаки, если защита слишком высокая', () => {
    const attacker = new Bowman(1);   
    const target = new Swordsman(1); 
    expect(calcDamage(attacker, target)).toBe(15);
    const dummyTarget = { attack: 0, defence: 100, health: 50 };
    const dummyAttacker = { attack: 20, defence: 0, health: 50 };
    expect(calcDamage(dummyAttacker, dummyTarget)).toBe(2); 
  });
});
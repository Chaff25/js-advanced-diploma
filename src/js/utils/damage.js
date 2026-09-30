export function calcDamage(attacker, target) {
  return Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
}
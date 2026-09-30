import themes from './themes';
import cursors from './cursors';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import { generateTeam } from './generators';
import { formatCharacterInfo } from './utils';
import {
  getAvailableMoves,
  getAvailableAttacks,
  toCoords,
} from './utils/positions';
import { calcDamage } from './utils/damage';

import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';

const PLAYER_TYPES = [Bowman, Swordsman, Magician];
const ENEMY_TYPES = [Vampire, Undead, Daemon];

const PLAYER_COLUMNS = [0, 1];
const ENEMY_COLUMNS = [6, 7];

const TEAM_SIZE = 4;
const MAX_LEVEL = 1;
const MAX_GAME_LEVEL = 4;

const THEMES_BY_LEVEL = [
  themes.prairie,
  themes.desert,
  themes.arctic,
  themes.mountain,
];

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = new GameState();
    this.selectedCharacter = null;
    this.currentLevel = 1;
    this.positionedCharacters = [];

    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onNewGameClick = this.onNewGameClick.bind(this);
    this.onSaveGameClick = this.onSaveGameClick.bind(this);
    this.onLoadGameClick = this.onLoadGameClick.bind(this);
  }

  init() {
    this.currentLevel = 1;
    this.gamePlay.drawUi(THEMES_BY_LEVEL[0]);
    this.spawnTeams();

    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.addNewGameListener(this.onNewGameClick);
    this.gamePlay.addSaveGameListener(this.onSaveGameClick);
    this.gamePlay.addLoadGameListener(this.onLoadGameClick);
  }

  spawnTeams() {
    this.playerTeam = generateTeam(PLAYER_TYPES, this.currentLevel, TEAM_SIZE);
    this.enemyTeam = generateTeam(ENEMY_TYPES, this.currentLevel, TEAM_SIZE);

    this.positionedCharacters = [
      ...this.positionTeam(this.playerTeam, PLAYER_COLUMNS),
      ...this.positionTeam(this.enemyTeam, ENEMY_COLUMNS),
    ];

    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  positionTeam(team, allowedColumns) {
    const { boardSize } = this.gamePlay;
    const used = new Set();
    const positions = [];

    for (const character of team) {
      let index;
      do {
        const row = Math.floor(Math.random() * boardSize);
        const col = allowedColumns[Math.floor(Math.random() * allowedColumns.length)];
        index = row * boardSize + col;
      } while (used.has(index));

      used.add(index);
      positions.push(new PositionedCharacter(character, index));
    }

    return positions;
  }

  getPositionedCharacter(index) {
    return this.positionedCharacters.find((pc) => pc.position === index);
  }

  getOccupied() {
    return new Set(this.positionedCharacters.map((pc) => pc.position));
  }

  isPlayerCharacter(pc) {
    return pc && PLAYER_TYPES.some((T) => pc.character instanceof T);
  }

  isEnemyCharacter(pc) {
    return pc && ENEMY_TYPES.some((T) => pc.character instanceof T);
  }

  onCellEnter(index) {
    const positioned = this.getPositionedCharacter(index);

    if (positioned) {
      this.gamePlay.showCellTooltip(
        formatCharacterInfo`${positioned.character}`,
        index,
      );
    }

    if (!this.selectedCharacter) {
      this.gamePlay.setCursor(
        positioned && this.isPlayerCharacter(positioned)
          ? cursors.pointer
          : cursors.auto,
      );
      return;
    }

    const selected = this.selectedCharacter;

    if (this.isPlayerCharacter(positioned) && positioned !== selected) {
      this.gamePlay.deselectCell(index);
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }

    if (positioned === selected) {
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }

    const occupied = this.getOccupied();
    occupied.delete(selected.position);

    const moves = getAvailableMoves(
      selected.character,
      selected.position,
      this.gamePlay.boardSize,
      occupied,
    );

    if (moves.includes(index)) {
      this.gamePlay.selectCell(index, 'green');
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }

    const attacks = getAvailableAttacks(
      selected.character,
      selected.position,
      this.gamePlay.boardSize,
      occupied,
    );

    if (attacks.includes(index) && this.isEnemyCharacter(positioned)) {
      this.gamePlay.selectCell(index, 'red');
      this.gamePlay.setCursor(cursors.crosshair);
      return;
    }

    this.gamePlay.deselectCell(index);
    this.gamePlay.setCursor(cursors.notallowed);
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.deselectCell(index);
    this.gamePlay.setCursor(cursors.auto);
  }

  onCellClick(index) {
    const positioned = this.getPositionedCharacter(index);

    if (!this.selectedCharacter) {
      if (!this.isPlayerCharacter(positioned)) {
        this.gamePlay.showError('Выберите персонажа игрока');
        return;
      }
      this.selectedCharacter = positioned;
      this.gamePlay.selectCell(index);
      return;
    }

    if (this.isPlayerCharacter(positioned) && positioned !== this.selectedCharacter) {
      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.selectedCharacter = positioned;
      this.gamePlay.selectCell(index);
      return;
    }

    if (positioned === this.selectedCharacter) {
      this.gamePlay.deselectCell(index);
      this.selectedCharacter = null;
      return;
    }

    const occupied = this.getOccupied();
    occupied.delete(this.selectedCharacter.position);

    const moves = getAvailableMoves(
      this.selectedCharacter.character,
      this.selectedCharacter.position,
      this.gamePlay.boardSize,
      occupied,
    );

    if (moves.includes(index)) {
      this.moveSelected(index);
      return;
    }

    const attacks = getAvailableAttacks(
      this.selectedCharacter.character,
      this.selectedCharacter.position,
      this.gamePlay.boardSize,
      occupied,
    );

    if (attacks.includes(index) && this.isEnemyCharacter(positioned)) {
      this.attackSelected(positioned, index);
      return;
    }

    this.gamePlay.showError('Недопустимое действие');
  }

  moveSelected(targetIndex) {
    const selected = this.selectedCharacter;
    this.gamePlay.deselectCell(selected.position);
    this.gamePlay.deselectCell(targetIndex);

    selected.position = targetIndex;
    this.selectedCharacter = null;

    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.changeTurn();
  }

  async attackSelected(target, targetIndex) {
    const attacker = this.selectedCharacter;
    const damage = calcDamage(attacker.character, target.character);

    target.character.health -= damage;
    if (target.character.health < 0) target.character.health = 0;

    await this.gamePlay.showDamage(targetIndex, Math.round(damage));

    if (target.character.health === 0) {
      this.state.score += 1;
      this.positionedCharacters = this.positionedCharacters.filter((pc) => pc !== target);
    }

    this.gamePlay.deselectCell(attacker.position);
    this.gamePlay.deselectCell(targetIndex);
    this.selectedCharacter = null;
    this.gamePlay.redrawPositions(this.positionedCharacters);

    if (this.checkLevelEnd()) return;

    this.changeTurn();
  }

  checkLevelEnd() {
    const enemies = this.positionedCharacters.filter((pc) => this.isEnemyCharacter(pc));
    const players = this.positionedCharacters.filter((pc) => this.isPlayerCharacter(pc));

    if (players.length === 0) {
      this.gameOver(false);
      return true;
    }

    if (enemies.length === 0) {
      if (this.currentLevel >= MAX_GAME_LEVEL) {
        this.gameOver(true);
        return true;
      }
      this.nextLevel();
      return true;
    }

    return false;
  }

  nextLevel() {
    this.currentLevel += 1;

    const players = this.positionedCharacters.filter((pc) => this.isPlayerCharacter(pc));
    for (const pc of players) {
      pc.character.levelUp();
    }

    const boardEl = this.gamePlay.boardEl;
    boardEl.classList.remove(...THEMES_BY_LEVEL);
    boardEl.classList.add(THEMES_BY_LEVEL[this.currentLevel - 1]);

    this.enemyTeam = generateTeam(ENEMY_TYPES, this.currentLevel, TEAM_SIZE);
    const enemies = this.positionTeam(this.enemyTeam, ENEMY_COLUMNS);

    this.positionedCharacters = [...players, ...enemies];
    this.gamePlay.redrawPositions(this.positionedCharacters);

    this.state.turn = 'player';
  }

  gameOver(isWin) {
    this.gamePlay.setCursor('default');
    this.gamePlay.boardEl.style.pointerEvents = 'none';
    this.gamePlay.showMessage(isWin ? 'Победа!' : 'Поражение');
  }

  changeTurn() {
    this.state.turn = this.state.turn === 'player' ? 'enemy' : 'player';

    if (this.state.turn === 'enemy') {
      setTimeout(() => {
        this.enemyTurn().catch(() => {});
      }, 500);
    }
  }

  async enemyTurn() {
    const enemies = this.positionedCharacters.filter((pc) => this.isEnemyCharacter(pc));
    const players = this.positionedCharacters.filter((pc) => this.isPlayerCharacter(pc));

    if (enemies.length === 0 || players.length === 0) return;

    const occupied = this.getOccupied();

    for (const enemy of enemies) {
      const attacks = getAvailableAttacks(
        enemy.character,
        enemy.position,
        this.gamePlay.boardSize,
        occupied,
      );

      const target = players.find((p) => attacks.includes(p.position));

      if (target) {
        const damage = calcDamage(enemy.character, target.character);
        target.character.health -= damage;
        if (target.character.health < 0) target.character.health = 0;

        // eslint-disable-next-line no-await-in-loop
        await this.gamePlay.showDamage(target.position, Math.round(damage));

        if (target.character.health === 0) {
          this.positionedCharacters = this.positionedCharacters.filter(
            (pc) => pc !== target,
          );
        }
        break;
      }

      const nearest = players[0];
      const moves = getAvailableMoves(
        enemy.character,
        enemy.position,
        this.gamePlay.boardSize,
        occupied,
      );

      if (moves.length > 0) {
        const { row: pr, col: pc } = toCoords(nearest.position, this.gamePlay.boardSize);

        moves.sort((a, b) => {
          const { row: ar, col: ac } = toCoords(a, this.gamePlay.boardSize);
          const { row: br, col: bc } = toCoords(b, this.gamePlay.boardSize);
          const da = Math.abs(ar - pr) + Math.abs(ac - pc);
          const db = Math.abs(br - pr) + Math.abs(bc - pc);
          return da - db;
        });

        enemy.position = moves[0];
        break;
      }
    }

    this.gamePlay.redrawPositions(this.positionedCharacters);

    if (this.checkLevelEnd()) return;

    this.changeTurn();
  }

  onNewGameClick() {
    const bestScore = this.state.score;

    this.state = new GameState();
    this.state.score = bestScore;

    this.currentLevel = 1;
    this.selectedCharacter = null;
    this.gamePlay.boardEl.style.pointerEvents = '';

    const boardEl = this.gamePlay.boardEl;
    boardEl.classList.remove(...THEMES_BY_LEVEL);
    boardEl.classList.add(THEMES_BY_LEVEL[0]);

    this.spawnTeams();
  }

  onSaveGameClick() {
    const stateObj = {
      turn: this.state.turn,
      currentLevel: this.currentLevel,
      score: this.state.score,
      positionedCharacters: this.positionedCharacters.map((pc) => ({
        position: pc.position,
        character: {
          type: pc.character.type,
          level: pc.character.level,
          attack: pc.character.attack,
          defence: pc.character.defence,
          health: pc.character.health,
        },
      })),
    };

    this.stateService.save(stateObj);
  }

  onLoadGameClick() {
    try {
      const loaded = this.stateService.load();
      if (!loaded) return;

      this.currentLevel = loaded.currentLevel;
      this.state.score = loaded.score ?? 0;

      const classMap = {
        bowman: Bowman,
        swordsman: Swordsman,
        magician: Magician,
        vampire: Vampire,
        undead: Undead,
        daemon: Daemon,
      };

      this.positionedCharacters = loaded.positionedCharacters.map((pc) => {
        const CharacterClass = classMap[pc.character.type];
        const character = Object.create(CharacterClass.prototype);
        Object.assign(character, pc.character);
        return new PositionedCharacter(character, pc.position);
      });

      const boardEl = this.gamePlay.boardEl;
      boardEl.classList.remove(...THEMES_BY_LEVEL);
      boardEl.classList.add(THEMES_BY_LEVEL[this.currentLevel - 1]);

      this.gamePlay.redrawPositions(this.positionedCharacters);
    } catch (e) {
      this.gamePlay.showError('Не удалось загрузить состояние');
    }
  }
}
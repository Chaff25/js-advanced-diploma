export default class GameState {
  constructor() {
    this.turn = 'player';          
    this.currentLevel = 1;         
    this.score = 0;                 
    this.positionedCharacters = []; 
  }


  static from(object) {
    if (!object) {
      return null;
    }

    const state = new GameState();
    state.turn = object.turn ?? 'player';
    state.currentLevel = object.currentLevel ?? 1;
    state.score = object.score ?? 0;
    state.positionedCharacters = object.positionedCharacters ?? [];
    return state;
  }
}
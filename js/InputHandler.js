export default class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = new Set();
    this.jumpPressed = false;

    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    const code = e.code;

    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(code)) {
      e.preventDefault();
    }

    switch (code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.add('left');
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.add('right');
        break;
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        this.jumpPressed = true;
        break;
      case 'KeyP':
        this.game.togglePause();
        break;
      case 'KeyR':              
        this.game.restart();
        break;
    }
  }

  handleKeyUp(e) {
    const code = e.code;
    switch (code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.delete('left');
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.delete('right');
        break;
      default:
        break;
    }
  }

  isLeftPressed() {
    return this.keys.has('left');
  }

  isRightPressed() {
    return this.keys.has('right');
  }

  consumeJump() {
    const jp = this.jumpPressed;
    this.jumpPressed = false;
    return jp;
  }
}

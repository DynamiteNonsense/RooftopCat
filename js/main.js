import Game from './Game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');

const game = new Game(canvas, ctx, {
  scoreElement,
  livesElement,
  levelElement,
});

let lastTime = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  game.update(deltaTime);
  game.render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

document.getElementById('startButton').addEventListener('click', () => {
  game.start();
});

document.getElementById('pauseButton').addEventListener('click', () => {
  game.togglePause();
});

document.getElementById('restartButton').addEventListener('click', () => {
  game.restart();
});

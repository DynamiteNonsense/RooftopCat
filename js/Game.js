import InputHandler from './InputHandler.js';
import Player from './Player.js';
import Platform from './Platform.js';
import Collectible from './Collectible.js';
import Enemy from './Enemy.js';
import Obstacle from './Obstacle.js';
import Renderer from './Renderer.js';
import { LEVELS } from './LevelData.js';
import {
  aabbIntersect,
  resolvePlayerPlatforms,
  handlePlayerCollectibles,
  handlePlayerEnemies,
  handlePlayerObstacles,
} from './Collision.js';

export const GAME_STATE = {
  MENU: 'menu',
  RUNNING: 'running',
  PAUSED: 'paused',
  GAME_OVER: 'gameover',
  LEVEL_COMPLETE: 'level_complete',
  WON: 'won',
};

export default class Game {
  constructor(canvas, ctx, uiElements) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;

    this.ui = uiElements;

    this.gravity = 2000; 
    this.state = GAME_STATE.MENU;
    this.levelIndex = 0;
    this.score = 0;
    this.lives = 3;

    this.platforms = [];
    this.collectibles = [];
    this.enemies = [];
    this.obstacles = [];
    this.goal = null;
    this.player = null;

    this.images = {};
    this.input = new InputHandler(this);
    this.initAudio();
    this.loadAssets();

    this.renderer = new Renderer(this, ctx);
    this.updateUI();
  }

  initAudio() {
    this.sounds = {
      jump: new Audio('assets/sounds/jump.wav'),
      collect: new Audio('assets/sounds/collect.wav'),
      hit: new Audio('assets/sounds/hit.wav'),
      gameover: new Audio('assets/sounds/gameover.wav'),
      levelComplete: new Audio('assets/sounds/level_complete.wav'),
    };

    this.music = new Audio('assets/sounds/bg_music.mp3');
    this.music.loop = true;
    this.music.volume = 0.5;
  }

  loadImage(key, src) {
    const img = new Image();
    img.src = src;
    this.images[key] = img;
  }

  loadAssets() {
    this.loadImage('bg_city', 'assets/images/bg_city.png');

    this.loadImage('cat_idle', 'assets/images/cat_idle.png');
    this.loadImage('cat_run', 'assets/images/cat_run.png');
    this.loadImage('cat_run2', 'assets/images/cat_run_2.png');
    this.loadImage('cat_jump', 'assets/images/cat_jump.png');
    this.loadImage('cat_fall', 'assets/images/cat_fall.png');

    this.loadImage('crow', 'assets/images/crow.png');
    this.loadImage('crow2', 'assets/images/crow_2.png');       
    this.loadImage('fish', 'assets/images/fish.png');
    this.loadImage('fish_gold', 'assets/images/fish_gold.png');
    this.loadImage('roof_tile', 'assets/images/tiles_roof.png');
    this.loadImage('goal_door', 'assets/images/goal_door.png');
  }

  start() {
  if (this.state === GAME_STATE.MENU) {
    this.reset();
    this.loadLevel(this.levelIndex);
  } else if (this.state === GAME_STATE.LEVEL_COMPLETE) {
    this.loadLevel(this.levelIndex);
  } else if (this.state === GAME_STATE.GAME_OVER || this.state === GAME_STATE.WON) {
    this.reset();
    this.loadLevel(this.levelIndex);
  }

  this.state = GAME_STATE.RUNNING;
  this.playMusic();
}

  restart() {
    this.reset();
    this.loadLevel(this.levelIndex);
    this.state = GAME_STATE.RUNNING;
    this.playMusic();
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.levelIndex = 0;
    this.updateUI();
  }

  loadLevel(index) {
    const data = LEVELS[index];
    if (!data) return;

    this.platforms = data.platforms.map(
      (p) => new Platform(this, p.x, p.y, p.width, p.height)
    );
    this.collectibles = (data.collectibles || []).map(
      (c) => new Collectible(this, c.x, c.y, c.type)
    );
    this.enemies = (data.enemies || []).map((e) => new Enemy(this, e));
    this.obstacles = (data.obstacles || []).map((o) => new Obstacle(this, o));

    this.player = new Player(this, data.playerStart.x, data.playerStart.y);
    this.goal = data.goal ? { ...data.goal } : null;

    this.updateUI();
  }

  update(deltaTime) {
    if (deltaTime > 0.05) deltaTime = 0.05;

    if (this.state === GAME_STATE.RUNNING) {
      if (this.player) {
        this.player.update(deltaTime);

        resolvePlayerPlatforms(this.player, this.platforms);
        handlePlayerCollectibles(this);
        handlePlayerEnemies(this);
        handlePlayerObstacles(this);

        if (this.player.y > this.height + 100) {
          this.onPlayerDeath();
          return;
        }

        if (this.goal && aabbIntersect(this.player, this.goal)) {
          this.onLevelComplete();
        }
      }

      for (const enemy of this.enemies) enemy.update(deltaTime);
      for (const obstacle of this.obstacles) obstacle.update(deltaTime);
    }
  }

  render() {
    this.renderer.render();
  }

  togglePause() {
    if (this.state === GAME_STATE.RUNNING) {
      this.state = GAME_STATE.PAUSED;
      this.pauseMusic();
    } else if (this.state === GAME_STATE.PAUSED) {
      this.state = GAME_STATE.RUNNING;
      this.playMusic();
    }
  }

  onPlayerDeath() {
  this.lives--;
  this.updateUI();

  if (this.lives <= 0) {
    this.state = GAME_STATE.GAME_OVER;
    this.pauseMusic();

    const s = this.sounds.gameover;
    if (s) {
      s.currentTime = 0;
      s.volume = 1.0;        
      s.play().catch(() => {});
    }
  } else {
    this.playHitSound();
    this.loadLevel(this.levelIndex);
  }
}

onLevelComplete() {
  if (this.sounds.levelComplete) {
    this.sounds.levelComplete.currentTime = 0;
    this.sounds.levelComplete.play().catch(() => {});
  }

  this.levelIndex++;
  if (this.levelIndex >= LEVELS.length) {
    this.state = GAME_STATE.WON;
    this.pauseMusic();
  } else {
    this.state = GAME_STATE.LEVEL_COMPLETE;
  }
}

  addScore(amount) {
    this.score += amount;
    this.updateUI();
  }

  updateUI() {
    if (this.ui.scoreElement) this.ui.scoreElement.textContent = this.score;
    if (this.ui.livesElement) this.ui.livesElement.textContent = this.lives;
    if (this.ui.levelElement) this.ui.levelElement.textContent = this.levelIndex + 1;
  }

  playJumpSound() {
    if (!this.sounds.jump) return;
    this.sounds.jump.currentTime = 0;
    this.sounds.jump.play().catch(() => {});
  }

  playCollectSound() {
    if (!this.sounds.collect) return;
    this.sounds.collect.currentTime = 0;
    this.sounds.collect.play().catch(() => {});
  }

  playHitSound() {
    if (!this.sounds.hit) return;
    this.sounds.hit.currentTime = 0;
    this.sounds.hit.play().catch(() => {});
  }

  playMusic() {
    if (!this.music) return;
    if (this.state !== GAME_STATE.RUNNING) return;
    const p = this.music.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {});
    }
  }

  pauseMusic() {
    if (!this.music) return;
    this.music.pause();
  }
}

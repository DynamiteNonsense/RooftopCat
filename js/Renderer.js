export default class Renderer {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;

    this.buildings = [];
    this.initBuildings();
  }

  initBuildings() {
    const { width, height } = this.game;
    this.buildings = [];
    const count = 12;
    const baseY = height - 50;

    for (let i = 0; i < count; i++) {
      const w = 60 + Math.random() * 80;
      const h = 100 + Math.random() * 200;
      const x = (width / count) * i + Math.random() * 20;
      const y = baseY - h;

      this.buildings.push({ x, y, w, h });
    }
  }

  render() {
    const ctx = this.ctx;
    const { width, height } = this.game;

    ctx.clearRect(0, 0, width, height);
    this.drawBackground();

    for (const platform of this.game.platforms) platform.draw(ctx);
    for (const obstacle of this.game.obstacles) obstacle.draw(ctx);
    for (const collectible of this.game.collectibles) collectible.update(0) || collectible.draw(ctx);
    for (const enemy of this.game.enemies) enemy.draw(ctx);

    if (this.game.goal) this.drawGoal();

    if (this.game.player) this.game.player.draw(ctx);

    this.drawStateOverlay();
  }

  drawBackground() {
    const ctx = this.ctx;
    const { width, height } = this.game;
    const bg = this.game.images['bg_city'];

    if (bg && bg.complete) {
      ctx.save();
      ctx.drawImage(bg, 0, 0, width, height);
      ctx.restore();
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#020617');
    gradient.addColorStop(0.5, '#020617');
    gradient.addColorStop(1, '#030712');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.fillStyle = '#0f172a';
    for (const b of this.buildings) {
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.arc(width - 80, 80, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawGoal() {
    const ctx = this.ctx;
    const goal = this.game.goal;
    const img = this.game.images['goal_door'];

    if (!img || !img.complete) {
      ctx.save();
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.drawImage(img, goal.x, goal.y, goal.width, goal.height);
    ctx.restore();
  }

  drawStateOverlay() {
    const ctx = this.ctx;
    const { width, height, state } = this.game;

    if (state === 'running') return;

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let title = '';
    let subtitle = '';

    switch (state) {
      case 'menu':
        title = 'Кот на крыше';
        subtitle = 'Нажмите Start, чтобы начать';
        break;
      case 'paused':
        title = 'Пауза';
        subtitle = 'Нажмите Pause или P, чтобы продолжить';
        break;
      case 'gameover':
        title = 'Игра окончена';
        subtitle = 'Нажмите Restart, чтобы начать заново';
        break;
      case 'level_complete':
        title = 'Уровень пройден!';
        subtitle = 'Нажмите Start для следующего уровня';
        break;
      case 'won':
        title = 'Игра пройдена!';
        subtitle = 'Нажмите Restart или Start, чтобы сыграть ещё раз';
        break;
    }

    ctx.font = '28px system-ui, sans-serif';
    ctx.fillText(title, width / 2, height / 2 - 20);

    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText(subtitle, width / 2, height / 2 + 20);

    ctx.restore();
  }
}

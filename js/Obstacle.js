export default class Obstacle {
  constructor(game, config) {
    this.game = game;
    this.type = config.type; 
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;

    if (this.type === 'waterJet') {
      this.active = false;
      this.timer = 0;
      this.activeDuration = config.activeDuration ?? 0.6;
      this.interval = config.interval ?? 1.2;
    }
  }

  update(deltaTime) {
    if (this.type === 'waterJet') {
      this.timer += deltaTime;
      const cycle = this.activeDuration + this.interval;
      const t = this.timer % cycle;
      this.active = t < this.activeDuration;
    }
  }

  draw(ctx) {
    if (this.type === 'chimney') {
      ctx.save();
      ctx.fillStyle = '#6b7280';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.height);                 
      ctx.lineTo(this.x + this.width / 2, this.y);             
      ctx.lineTo(this.x + this.width, this.y + this.height);    
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (this.type === 'waterJet') {
      ctx.save();
      ctx.fillStyle = '#6b7280';
      ctx.fillRect(this.x, this.y + this.height - 10, this.width, 10);

      if (this.active) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(
          this.x + this.width / 3,
          this.y,
          this.width / 3,
          this.height - 10
        );
      }

      ctx.restore();
    }
  }
}

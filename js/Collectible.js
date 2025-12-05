export default class Collectible {
  constructor(game, x, y, type = 'fish') {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.type = type; 
    this.collected = false;

    this.anim = {
      frameWidth: 32,
      frameHeight: 32,
      frames: 4,
      fps: 6,
      timer: 0,
      currentFrame: 0,
    };

    this.floatTimer = 0;
  }

  update(deltaTime) {
    if (this.collected) return;

    this.floatTimer += deltaTime;
    const amplitude = 4;
    const offsetY = Math.sin(this.floatTimer * 3) * amplitude;
    this.renderY = this.y + offsetY;

    const frameDuration = 1 / this.anim.fps;
    this.anim.timer += deltaTime;
    while (this.anim.timer >= frameDuration) {
      this.anim.timer -= frameDuration;
      this.anim.currentFrame = (this.anim.currentFrame + 1) % this.anim.frames;
    }
  }

  draw(ctx) {
    if (this.collected) return;

    const key = this.type === 'gold_fish' ? 'fish_gold' : 'fish';
    const image = this.game.images[key];
    const y = this.renderY ?? this.y;

    if (!image || !image.complete) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, y + this.height / 2);
      ctx.fillStyle =
        this.type === 'gold_fish' ? '#facc15' : '#f97316';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    const frameX = this.anim.currentFrame * this.anim.frameWidth;
    const frameY = 0;

    ctx.save();
    ctx.drawImage(
      image,
      frameX,
      frameY,
      this.anim.frameWidth,
      this.anim.frameHeight,
      this.x,
      y,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

export default class Enemy {
  constructor(game, config) {
    this.game = game;

    this.x = config.x;
    this.y = config.y;
    this.width = 64;
    this.height = 32;

    this.minX = config.minX ?? this.x - 50;
    this.maxX = config.maxX ?? this.x + 50;
    this.speed = config.speed ?? 80;
    this.direction = 1;

    this.anim = {
      keys: ['crow', 'crow2'], 
      fps: 6,
      frameIndex: 0,
      timer: 0,
    };
  }

  update(deltaTime) {
    this.x += this.speed * this.direction * deltaTime;

    if (this.x < this.minX) {
      this.x = this.minX;
      this.direction = 1;
    } else if (this.x + this.width > this.maxX) {
      this.x = this.maxX - this.width;
      this.direction = -1;
    }

    const frameDuration = 1 / this.anim.fps;
    this.anim.timer += deltaTime;
    while (this.anim.timer >= frameDuration) {
      this.anim.timer -= frameDuration;
      this.anim.frameIndex =
        (this.anim.frameIndex + 1) % this.anim.keys.length;
    }
  }

  draw(ctx) {
    const key = this.anim.keys[this.anim.frameIndex];
    const image = this.game.images[key];

    if (!image || !image.complete) {
      ctx.save();
      ctx.fillStyle = '#000000';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (this.direction < 0) ctx.scale(-1, 1);

    ctx.drawImage(
      image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

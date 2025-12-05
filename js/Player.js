export default class Player {
  constructor(game, x, y) {
    this.game = game;

    this.width = 64;
    this.height = 48;

    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.speed = 260;
    this.jumpStrength = 650;
    this.onGround = false;

    this.prevX = this.x;
    this.prevY = this.y;

    this.facing = 1; 

    this.animations = {
      idle: { keys: ['cat_idle'], fps: 1 },
      run:  { keys: ['cat_run', 'cat_run2'], fps: 8 },
      jump: { keys: ['cat_jump'], fps: 1 },
      fall: { keys: ['cat_fall'], fps: 1 },
    };

    this.currentAnimName = 'idle';
    this.currentFrameIndex = 0;
    this.animTimer = 0;
  }

  update(deltaTime) {
    this.prevX = this.x;
    this.prevY = this.y;

    const input = this.game.input;
    let dir = 0;

    if (input.isLeftPressed()) dir -= 1;
    if (input.isRightPressed()) dir += 1;

    this.vx = dir * this.speed;

    if (dir > 0) this.facing = 1;
    else if (dir < 0) this.facing = -1;

    if (input.consumeJump() && this.onGround) {
      this.vy = -this.jumpStrength;
      this.onGround = false;
      this.game.playJumpSound();
    }

    this.vy += this.game.gravity * deltaTime;

    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.game.width) {
      this.x = this.game.width - this.width;
    }

    this.updateAnimation(deltaTime);
  }

  updateAnimation(deltaTime) {
    let newAnim = this.currentAnimName;

    if (!this.onGround) {
      newAnim = this.vy < 0 ? 'jump' : 'fall';
    } else if (Math.abs(this.vx) > 5) {
      newAnim = 'run';
    } else {
      newAnim = 'idle';
    }


    if (newAnim !== this.currentAnimName) {
      this.currentAnimName = newAnim;
      this.currentFrameIndex = 0;
      this.animTimer = 0;
    }

    const anim = this.animations[this.currentAnimName];
    const fps = anim.fps || 1;
    const frameDuration = 1 / fps;

    this.animTimer += deltaTime;
    while (this.animTimer >= frameDuration) {
      this.animTimer -= frameDuration;
      this.currentFrameIndex =
        (this.currentFrameIndex + 1) % anim.keys.length;
    }
  }

  draw(ctx) {
    const anim = this.animations[this.currentAnimName];
    const key = anim.keys[this.currentFrameIndex % anim.keys.length];
    const image = this.game.images[key];

    if (!image || !image.complete) {
      ctx.save();
      ctx.fillStyle = '#facc15';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (this.facing === -1) ctx.scale(-1, 1);

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

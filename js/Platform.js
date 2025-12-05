export default class Platform {
  constructor(game, x, y, width, height) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.tileWidth = 64;  
    this.tileHeight = 32;
  }

  draw(ctx) {
    const tileImg = this.game.images['roof_tile'];

    if (!tileImg || !tileImg.complete) {
      ctx.save();
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.restore();
      return;
    }

    ctx.save();
    const cols = Math.ceil(this.width / this.tileWidth);
    const rows = Math.ceil(this.height / this.tileHeight);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const drawX = this.x + i * this.tileWidth;
        const drawY = this.y + j * this.tileHeight;
        ctx.drawImage(tileImg, drawX, drawY, this.tileWidth, this.tileHeight);
      }
    }

    ctx.restore();
  }
}

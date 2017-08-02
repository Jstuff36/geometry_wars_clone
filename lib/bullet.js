const MovingObject = require("./moving_object");

class Bullet extends MovingObject {
  constructor(options) {
    options.radius = Bullet.RADIUS;
    super(options);
    this.image = 'images/bullets.png';
  }

  move(timeDelta) {
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
       offsetX = this.vel[0] * velocityScale,
       offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    if (this.game.isOutOfBounds(this.pos)) {
      this.remove();
    }
  }

  draw(ctx) {
    let background = new Image();
    background.src = this.image;
    ctx.drawImage(background, 115, 5, 25, 25, this.pos[0], this.pos[1], 50, 50);
  }

}
const NORMAL_FRAME_TIME_DELTA = 1000/120;

Bullet.RADIUS = 2;
Bullet.SPEED = 5;




module.exports = Bullet;

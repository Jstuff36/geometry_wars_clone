const Util = require("./util");

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.type = options.type;
    this.speed = options.speed;
    this.friction = 0.98;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  move(timeDelta) {
  }

  isCollideWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return (this.radius + otherObject.radius > centerDist);
  }

  collideWith(otherObject) {
  }

  remove() {
    this.game.remove(this);
  }

}
const NORMAL_FRAME_TIME_DELTA = 1000/120;

module.exports = MovingObject;

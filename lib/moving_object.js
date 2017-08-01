const Util = require("./util");

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.friction = 0.98;
    this.isWrappable = true;
    this.type = options.type;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  move() {
    let wrappedPos = this.game.wrap(this.pos);
    if (this.type === 'SHIP') {
      this.vel[0] *= this.friction;
      this.vel[1] *= this.friction;
    }
    wrappedPos[0] += this.vel[0];
    wrappedPos[1] += this.vel[1];
    this.pos = [wrappedPos[0], wrappedPos[1]];
    if (this.game.isOutOfBounds(this.pos)) {
      if (!this.isWrappable) {
        this.remove();
      }
    }
  }

  // move() {
  //   let bouncedObject = this.game.wrap(this.pos);
  //   this.vel[0] = bouncedObject[0][1];
  //   this.vel[1] = bouncedObject[1][1];
  //   this.pos[0] = bouncedObject[0][0];
  //   this.pos[1] = bouncedObject[1][0];
  //   if (this.color === "#32cd32") {
  //     this.vel[0] *= this.friction;
  //     this.vel[1] *= this.friction;
  //   }
  //   this.pos[0] += this.vel[0];
  //   this.pos[1] += this.vel[1];
  //   if (this.game.isOutOfBounds(this.pos)) {
  //     if (!this.isWrappable) {
  //       this.remove();
  //     }
  //   }dd
  // }

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

module.exports = MovingObject;

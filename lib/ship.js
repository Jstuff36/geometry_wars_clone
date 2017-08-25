const MovingObject = require("./moving_object");
const Util = require("./util");
const Bullet = require("./bullet");

class Ship extends MovingObject {
  constructor(options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0,0];
    options.color = options.color || '#32cd32';
    options.pos = options.pos || [0,0];
    options.type = 'SHIP';
    options.game = options.game;
    options.speed = Ship.SPEED;
    super(options);
    this.image = 'images/snapchat.jpg';
    this.lives = 1;
    this.bombs = 3;
  }

  relocate() {
    this.pos = [this.game.dim_x / 2, this.game.dim_y / 2];
    this.vel = [0, 0];
    this.lives--;
    this.game.clearScreen();
  }

   move(timeDelta) {
     this.vel[0] *= this.friction;
     this.vel[1] *= this.friction;
     const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
        offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;

     this.pos = [this.bounding(this.pos[0] + offsetX, this.game.dim_x),
      this.bounding(this.pos[1] + offsetY, this.game.dim_y)];
   }

   bounding(coord, max) {
     if (coord > max) {
       this.vel[0] = 0
       this.vel[1] = 0
       return max - Ship.RADIUS / 2;
     } else if (coord  < 0) {
       this.vel[0] = 0
       this.vel[1] = 0
       return 0 + Ship.RADIUS;
     } else {
      return coord;
    }
   }

   bomb() {
     if (this.bombs > 0) {
       this.game.bombed();
      this.bombs--;
     }

   }

  fireBullet(dir) {
    let relVel;

    if (dir[0] && dir[1] && Math.sign(dir[0] !== Math.sign(dir[1]))) {
      relVel = [this.vel[0] + Bullet.SPEED * Math.sign(dir[1]) * -1,
       this.vel[1] + Bullet.SPEED * Math.sign(dir[0])];
    } else if (dir[0] && dir[1]) {
      relVel = [this.vel[0] + Bullet.SPEED * Math.sign(dir[1]),
       this.vel[1] + Bullet.SPEED * Math.sign(dir[0]) * -1];
    } else if (dir[0]) {
      relVel = [this.vel[0] + Bullet.SPEED * Math.sign(dir[0]), this.vel[1]];
    } else {
      relVel = [this.vel[0], this.vel[1] + Bullet.SPEED * Math.sign(dir[1]) * -1];
    }

    const bullet = new Bullet({
      pos: this.pos,
      vel: relVel,
      color: this.color,
      game: this.game
    });
    this.game.bullets.push(bullet);
    this.game.objectsInPlay.push(bullet);
  }

  keypress(keys) {
    if (keys[37] && keys[38]) {
      this.fireBullet([-1, 1]);
    } else if (keys[38] && keys[39]) {
      this.fireBullet([1,1]);
    } else if (keys[39] && keys[40]) {
      this.fireBullet([1, -1]);
    } else if (keys[37] && keys[40]) {
      this.fireBullet([-1, -1]);
    } else if (keys[37]) {
      this.fireBullet([-1,0]);
    } else if (keys[38]) {
      this.fireBullet([0,1]);
    } else if (keys[39]) {
      this.fireBullet([1,0]);
    } else if (keys[40]) {
      this.fireBullet([0,-1]);
    }

    if (keys[32] && this.bombs > 0) {
      this.game.clearScreen();
      this.bombs--;
    }

    if (keys[87]) {
            if (this.vel[1] > -Ship.SPEED) {
                this.vel[1]--;
            }
        }

    if (keys[83]) {
        if (this.vel[1] < Ship.SPEED) {
            this.vel[1]++;
        }
    }
    if (keys[68]) {
        if (this.vel[0] < Ship.SPEED) {
            this.vel[0]++;
        }
    }
    if (keys[65]) {
        if (this.vel[0] > -Ship.SPEED) {
            this.vel[0]--;
        }
    }
  }
}
const NORMAL_FRAME_TIME_DELTA = 1000/120;

Ship.SPEED = 4;
Ship.RADIUS = 15;
module.exports = Ship;

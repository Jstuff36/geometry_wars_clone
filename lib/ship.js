const MovingObject = require("./moving_object");
const Util = require("./util");
const Bullet = require("./bullet");

class Ship extends MovingObject {
  constructor(options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0,0];
    options.color = options.color || '#32cd32';
    options.type = 'SHIP';
    super(options);
  }

  relocate() {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
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
    this.game.add(bullet);
  }

  keypress(keys) {
    let dir;
    console.log(keys);
    if (keys[37] && keys[38]) {
      dir = [-1, 1];
      this.fireBullet(dir);
    } else if (keys[38] && keys[39]) {
      dir = [1,1];
      this.fireBullet(dir);
    } else if (keys[39] && keys[40]) {
      dir = [1, -1];
      this.fireBullet(dir);
    } else if (keys[37] && keys[40]) {
      dir = [-1, -1];
      this.fireBullet(dir);
    } else if (keys[37]) {
      dir = [-1,0];
      this.fireBullet(dir);
    } else if (keys[38]) {
      dir = [0,1];
      this.fireBullet(dir);
    } else if (keys[39]) {
      dir = [1,0];
      this.fireBullet(dir);
    } else if (keys[40]) {
      dir = [0,-1];
      this.fireBullet(dir);
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

Ship.SPEED = 2;
Ship.RADIUS = 15;
module.exports = Ship;

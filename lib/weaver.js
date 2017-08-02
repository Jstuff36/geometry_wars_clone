const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");
const Bullet = require("./bullet");

const DEFAULTS = {
  COLOR: '#ff0000',
  RADIUS: 25,
  SPEED: 1
};

class Weaver extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.radius = DEFAULTS.RADIUS;
    options.pos = options.pos || options.game.randomPosition();
    options.vel = [0,0];
    options.type = "WEAVER";
    super(options);
    this.ship = options.ship;
    this.speed = DEFAULTS.SPEED;
    this.bullets = options.bullets;
    this.image = "images/apple.jpg";
  }

  collideWith(otherObject) {
    if (otherObject instanceof Ship) {
      otherObject.relocate();
        return true;
    } else if (otherObject instanceof Bullet) {
        this.remove();
        otherObject.remove();
        return true;
    }
  }

  move(timeDelta) {
    if (this.bullets.length !== 0) {
      let someVectorCalc = this.pointBetween();
      console.log(someVectorCalc);
      if (someVectorCalc) {
        if (someVectorCalc > 0) {
          this.vel[0] = this.vel[0] + (8 * Math.sign(someVectorCalc));
          this.vel[1] = this.vel[1] + (8 * Math.sign(someVectorCalc));
        } else {
          this.vel[0] = this.vel[0] + (8 * Math.sign(someVectorCalc));
          this.vel[1] = this.vel[1] + (8 * Math.sign(someVectorCalc));
        }
      } else {
        const velTowardsShip = Util.findShipVec(this.pos, this.speed, this.ship);
        this.vel[0] = velTowardsShip[0];
        this.vel[1] = velTowardsShip[1];
      }
    } else {
      const velTowardsShip = Util.findShipVec(this.pos, this.speed, this.ship);
      this.vel[0] = velTowardsShip[0];
      this.vel[1] = velTowardsShip[1];
    }
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
       offsetX = this.vel[0] * velocityScale,
       offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

  }

  pointBetween() {
    for (let i = 0; i < this.bullets.length; i++) {
      let dxc = this.bullets[i].pos[0] - this.pos[0];
      let dyc = this.bullets[i].pos[1] - this.pos[1];

      let dxl = this.ship.pos[0] - this.pos[0];
      let dyl = this.ship.pos[1] - this.pos[1];

      let cross = dxc * dyl - dyc * dxl;
      let threshold = 1000;
      if (Math.abs(cross) < threshold) {
        let between;
        if (Math.abs(dxl) > Math.abs(dyl)) {
          between = dxl > 0 ?
            this.pos[0] <= this.bullets[i].pos[0] && this.bullets[i].pos[0] <= this.ship.pos[0] :
            this.ship.pos[0] <= this.bullets[i].pos[0] && this.bullets[i].pos[0] <= this.pos[0];
        } else  {
          between = dyl > 0 ?
            this.pos[1] <= this.bullets[i].pos[1] && this.bullets[i].pos[1] <= this.ship.pos[1] :
            this.ship.pos[1] <= this.bullets[i].pos[1] && this.bullets[i].pos[1] <= this.pos[1];
        }
        if (between) {
          return cross;
        }
      }
    }
  }

}
const NORMAL_FRAME_TIME_DELTA = 1000/120;

module.exports = Weaver;

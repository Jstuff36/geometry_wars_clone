const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");
const Bullet = require("./bullet");

const DEFAULTS = {
  COLOR: '#505050',
  RADIUS: 25,
  SPEED: 2
};

class Wanderer extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.radius = DEFAULTS.RADIUS;
    options.pos = options.pos || options.game.randomPosition();
    options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
    options.speed = DEFAULTS.SPEED;
    super(options);
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
    let bouncedObject = this.game.wallBounce(this.pos,this.vel);
    this.vel[0] = bouncedObject[0][1];
    this.vel[1] = bouncedObject[1][1];
    this.pos = [bouncedObject[0][0], bouncedObject[1][0]];
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
       offsetX = this.vel[0] * velocityScale,
       offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
  }
}
const NORMAL_FRAME_TIME_DELTA = 1000/120;

module.exports = Wanderer;

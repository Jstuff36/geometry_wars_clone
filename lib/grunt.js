const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");
const Bullet = require("./bullet");

const DEFAULTS = {
  COLOR: '#0000ff',
  RADIUS: 25,
  SPEED: 1.5
};

class Grunt extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.radius = DEFAULTS.RADIUS;
    options.pos = options.pos || options.game.spawnEnemy();
    options.vel = [0,0];
    options.type = "GRUNT";
    super(options);
    this.ship = options.ship;
    this.speed = DEFAULTS.SPEED;
    this.tracks = true;
    this.image = "images/google.jpg";
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
    const velTowardsShip = Util.findShipVec(this.pos, this.speed, this.ship);
    this.vel[0] = velTowardsShip[0];
    this.vel[1] = velTowardsShip[1];
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
       offsetX = this.vel[0] * velocityScale,
       offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
  }

}
const NORMAL_FRAME_TIME_DELTA = 1000/120;

module.exports = Grunt;

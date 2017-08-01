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
    super(options);
  }

  collideWith(otherObject) {
    if (otherObject instanceof Ship) {
      otherObject.relocate();
          return true;
    } else if (otherObject instanceof Bullet) {
          console.log(this);
          this.remove();
          otherObject.remove();
          return true;
      }
    }
}

module.exports = Wanderer;

const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");

const DEFAULTS = {
  COLOR: '#505050',
  RADIUS: 25,
  SPEED: 4
};

class Asteroid extends MovingObject {
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
    }
  }

}

module.exports = Asteroid;

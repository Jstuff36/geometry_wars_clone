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
    options.pos = options.pos || options.game.randomPosition();
    options.vel = [0,0];
    options.type = "GRUNT";
    super(options);
    this.ship = options.ship;
    this.speed = DEFAULTS.SPEED;
    this.tracks = true;
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
}

module.exports = Grunt;

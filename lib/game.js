const Wanderer = require("./wanderer");
const Ship = require("./ship");
const Bullet = require("./bullet");
const Grunt = require("./grunt");

class Game {
  constructor() {
    this.wanderers = [];
    this.ships = [];
    this.bullets = [];
    this.grunts = [];
    this.addGrunts();
    this.addWanderers();
    this.dim_x = Game.DIM_X;
    this.dim_y = Game.DIM_Y;

  }

  add(object) {
    if( object instanceof Wanderer) {
      this.wanderers.push(object);
    } else if (object instanceof Bullet) {
      this.bullets.push(object);
    } else if (object instanceof Ship) {
      this.ships.push(object);
    } else if (object instanceof Grunt) {
      this.grunts.push(object);
    } else {
      throw "unkown type of object";
    }
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Wanderer) {
      this.wanderers.splice(this.wanderers.indexOf(object), 1);
    } else if (object instanceof Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    } else {
      throw "unknown type of object";
    }
  }

  addWanderers() {
    for (let i = 0; i < Game.NUM_WANDERERS; i++) {
      this.add(new Wanderer({game: this}));
    }
  }

  addGrunts() {
    for (let i = 0; i < Game.NUM_GRUNTS; i++) {
      this.add(new Grunt({game: this,
        ship: this.ships[0]
      }));
    }
  }

  randomPosition() {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach( object => {
      object.draw(ctx);
    });
  }

  moveObjects(delta) {
    this.allObjects().forEach( object => {
      object.move(delta);
    });
  }

  wallBounce(pos, vel) {
    return([this.boundCalculator(pos[0], vel[0], Game.DIM_X),
      this.boundCalculator(pos[1], vel[1], Game.DIM_Y)]);
  }

  boundCalculator(coord, vel, max) {
    if (coord < 0) {
      return ([Math.abs(coord % max), -vel]);
    } else if (coord > max) {
      return([max - (coord % max), -vel]);
    } else {
      return([coord, vel]);
    }
  }

  checkCollisions() {
    for (let i = 0; i < this.allObjects().length; i++) {
      for (let j = 0; j < this.allObjects().length; j++) {
        if (i === j) {
          continue;
        } else if (this.allObjects()[i].isCollideWith(this.allObjects()[j])) {
          this.allObjects()[i].collideWith(this.allObjects()[j]);
        }
      }
    }
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
  }

  addShip() {
    const ship = new Ship({
      pos: [Game.DIM_X / 2, Game.DIM_Y / 2],
      game: this
    });

    this.add(ship);
    return ship;
  }

  allObjects() {
    return [].concat(this.ships, this.wanderers, this.bullets, this.grunts);
  }

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
  (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_WANDERERS = 1;
Game.NUM_GRUNTS = 1;
module.exports = Game;

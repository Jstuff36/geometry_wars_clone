const Asteroid = require("./asteroid");
const Ship = require("./ship");
const Bullet = require("./bullet");

class Game {
  constructor() {
    this.asteroids = [];
    this.addAsteroids();
    this.ships = [];
    this.bullets = [];
  }

  add(object) {
    if( object instanceof Asteroid) {
      this.asteroids.push(object);
    } else if (object instanceof Bullet) {
      this.bullets.push(object);
    } else if (object instanceof Ship) {
      this.ships.push(object);
    } else {
      throw "unkown type of object";
    }
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Asteroid) {
      this.asteroids.splice(this.asteroids.indexOf(object), 1);
    } else if (object instanceof Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    } else {
      throw "unknown type of object";
    }
  }

  addAsteroids() {
    for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
      this.add(new Asteroid({game: this}));
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

  moveObjects() {
    this.allObjects().forEach( object => {
      object.move();
    });
  }

  wrap(pos) {
    return([this.boundCalculator(pos[0], Game.DIM_X),
      this.boundCalculator(pos[1], Game.DIM_Y)]);
  }

  boundCalculator(coord, max) {
    if (coord < 0) {
      return(max - Math.abs(coord % max));
    } else if (coord > max) {
      return(coord % max);
    } else {
      return(coord);
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

  step() {
    this.moveObjects();
    this.checkCollisions();
  }

  addShip() {
    const ship = new Ship({
      pos: this.randomPosition(),
      game: this
    });

    this.add(ship);
    return ship;
  }

  allObjects() {
    return [].concat(this.ships, this.asteroids, this.bullets);
  }

}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_ASTEROIDS = 2;

module.exports = Game;

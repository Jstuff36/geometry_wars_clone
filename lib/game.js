const Wanderer = require("./wanderer");
const Ship = require("./ship");
const Bullet = require("./bullet");
const Grunt = require("./grunt");
const Util = require("./util");
const Weaver = require("./weaver");

class Game {
  constructor() {
    this.wanderers = [];
    this.ships = [];
    this.bullets = [];
    this.grunts = [];
    this.weavers = [];
    this.dim_x = Game.DIM_X;
    this.dim_y = Game.DIM_Y;
    this.addWanderers = this.addWanderers.bind(this);
    this.addGrunts = this.addGrunts.bind(this);
    this.level = 0;

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
    } else if (object instanceof Weaver) {
      this.weavers.push(object);
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
    } else if (object instanceof Grunt) {
      this.grunts.splice(this.grunts.indexOf(object), 1);
    } else if (object instanceof Weaver) {
      this.weavers.splice(this.weavers.indexOf(object), 1);
    } else {
      throw "unknown type of object";
    }
  }

  addWanderers() {
    for (let i = 0; i < Game.NUM_WANDERERS; i++) {
      this.add(new Wanderer({ game: this }));
    }
  }

  addGrunts() {
    for (let i = 0; i < Game.NUM_GRUNTS; i++) {
      this.add(new Grunt({
        game: this,
        ship: this.ships[0]
      }));
    }
  }

  addWeavers() {
    for (let i = 0; i < Game.NUM_WEAVERS; i++) {
      this.add(new Weaver({
        bullets: this.bullets,
        game: this,
        ship: this.ships[0]
      }));
    }
  }

  spawnEnemy() {
    let vertPos = this.randomBinary() === 0 ?
      0 + 100 * Math.random() :
      Game.DIM_Y - 100 * Math.random();
    let horzPos = this.randomBinary() === 0 ?
      0 + 400 * Math.random() :
      Game.DIM_X - 400 * Math.random();
    return [horzPos, vertPos];
  }

  randomBinary () {
    return Math.floor(Math.random() * 2);
  }

  draw(ctx, background) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.drawImage(background, 0, 0, 1000, 600);

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
    const allObjects = this.allObjects();
    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        if (i === j) {
          continue;
        } else if (allObjects[i].isCollideWith(allObjects[j])) {
          allObjects[i].collideWith(allObjects[j]);
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
    this.addGrunts();
    this.addWanderers();
    this.addWeavers();
    return ship;
  }

  allObjects() {
    return [].concat(this.ships, this.wanderers, this.bullets, this.grunts, this.weavers);
  }

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
  (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  chaseShip(pos, SPEED){
    Util.findShipVec(this.pos, SPEED, this.ships);
  }

  bombed() {
    this.wanderers = [];
    this.grunts = [];
    this.weavers = [];
  }

}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_WANDERERS = 2;
Game.NUM_GRUNTS = 2;
Game.NUM_WEAVERS = 1;
module.exports = Game;

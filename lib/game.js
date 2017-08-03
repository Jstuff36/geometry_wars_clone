const Wanderer = require("./wanderer");
const Ship = require("./ship");
const Bullet = require("./bullet");
const Grunt = require("./grunt");
const Util = require("./util");
const Weaver = require("./weaver");
const Levels = require('./levels');

class Game {
  constructor() {
    this.wanderers = ['wanderer', 0];
    this.ships = [];
    this.bullets = [];
    this.grunts = ['grunt', 0];
    this.weavers = ['weaver', 0];
    this.objectsInPlay = [];
    this.dim_x = Game.DIM_X;
    this.dim_y = Game.DIM_Y;
    this.level = 0;
    this.spawnTime = 0;
    this.lives = 3;

  }

  setUpRound(currLevel) {
    currLevel.enemies.forEach( (enemy) => {
      if (enemy[0] === 'wanderer') {
        this.wanderers = enemy;
      } else if (enemy[0] === 'grunt') {
        this.grunts = enemy;
      } else {
        this.weavers = enemy;
      }
    });
  }

  gameLogic() {
    let currLevel = Levels()[this.level];
    if (!this.enemiesLeft()) {
      if (this.objectsInPlay.length === 1) {
        this.level++;
        this.setUpRound(currLevel);
      }
    } else {
      if (this.spawnTime > currLevel.spawnRate) {
        this.spawnEnemy(currLevel);
        this.spawnTime = 0;
      } else {
        this.spawnTime++;
      }
    }
  }

  add(object) {
    this.objectsInPlay.push(object);
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    }
    this.objectsInPlay.splice(this.objectsInPlay.indexOf(object), 1);
  }

  addWanderer() {
    this.objectsInPlay.push(new Wanderer({
      game: this,
      pos: this.spawnEnemyPosition()
    }));
  }

  addGrunt() {
    this.objectsInPlay.push(new Grunt({
      game: this,
      ship: this.ships[0],
      pos: this.spawnEnemyPosition()
    }));
  }

  addWeaver() {
    this.objectsInPlay.push(new Weaver({
      bullets: this.bullets,
      game: this,
      ship: this.ships[0],
      pos: this.spawnEnemyPosition()
    }));
  }

  spawnEnemy(enemy) {
    let allEnemies = [this.wanderers, this.weavers, this.grunts];
    let randomNum = Math.floor(Math.random() * 3);
    while (allEnemies[randomNum][1] === 0) {
      randomNum = Math.floor(Math.random() * 3);
    }
    let newEnemy = allEnemies[randomNum][0];
    allEnemies[randomNum][1] -= 1;
    switch (newEnemy) {
      case "wanderer": this.addWanderer(); break;
      case "grunt": this.addGrunt(); break;
      case "weaver": this.addWeaver(); break;
    }
  }

  spawnEnemyPosition() {
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
    let health = new Image();
    health.src = "images/snaphealth.png";
    ctx.drawImage(background, 0, 0, 1000, 600);
    for (let i = 0; i < this.lives; i++) {
      ctx.drawImage(health, 10 + i * 30, 10, 30, 30);
    }
    this.objectsInPlay.forEach( object => {
      object.draw(ctx);
    });
  }

  moveObjects(delta) {
    this.objectsInPlay.forEach( object => {
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
    for (let i = 0; i < this.objectsInPlay.length; i++) {
      for (let j = 0; j < this.objectsInPlay.length; j++) {
        if (i === j) {
          continue;
        } else if (this.objectsInPlay[i].isCollideWith(this.objectsInPlay[j])) {
          this.objectsInPlay[i].collideWith(this.objectsInPlay[j]);
        }
      }
    }
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
    this.gameLogic();
  }

  addShip() {
    const ship = new Ship({
      pos: [Game.DIM_X / 2, Game.DIM_Y / 2],
      game: this
    });

    this.ships.push(ship);
    this.objectsInPlay.push(ship);
    this.setUpRound(Levels()[this.level]);
    return ship;
  }

  allObjects() {
    return [].concat(this.ships, this.wanderers, this.bullets, this.grunts, this.weavers);
  }

  enemiesLeft() {
    let enemies = [this.wanderers, this.grunts, this.weavers];
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i][1] !== 0) {
        return true;
      }
    }
    return false;
  }

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
  (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  chaseShip(pos, SPEED){
    Util.findShipVec(this.pos, SPEED, this.ships);
  }

  // bombed() {
  //   this.wanderers = [];
  //   this.grunts = [];
  //   this.weavers = [];
  // }

}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_WANDERERS = 2;
Game.NUM_GRUNTS = 2;
Game.NUM_WEAVERS = 1;
module.exports = Game;

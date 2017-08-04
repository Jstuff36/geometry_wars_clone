const Wanderer = require("./wanderer");
const Ship = require("./ship");
const Bullet = require("./bullet");
const Grunt = require("./grunt");
const Util = require("./util");
const Weaver = require("./weaver");
const Levels = require('./levels');
const GameView = require('./game_view');

class Game {
  constructor(ctx) {
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
    this.ctx = ctx;
    this.score = 0;
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
    if (this.ships[0].lives === 0) {
      this.gameOver();
    } else if (!this.enemiesLeft()) {
      if (this.objectsInPlay.length === 1) {
        // cancelAnimationFrame(window.requestId);
        // this.ctx.save();
        // this.ctx.font = "42px serif";
        // this.ctx.fillStyle = "#FFFFFF";
        // this.ctx.textAlign='center';
        // this.ctx.fillText(`Round ${this.level + 1}`, Game.DIM_X / 2, Game.DIM_Y / 2);
        // this.ctx.restore();

        this.setUpRound(currLevel);
        this.level++;
        // window.setTimeout( () => {
        //   this.level++;
        //   this.setUpRound(currLevel);
        // }, 1000);
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
    } else if (object instanceof Wanderer) {
      this.score += 1;
      this.ctx.save();
      this.ctx.font = "25px Verdana";
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.textAlign='center';
      this.ctx.textBaseline='middle';
      this.ctx.fillText('50',object.pos[0],object.pos[1]);
      this.ctx.restore();
    } else if (object instanceof Grunt) {
      this.score += 2;
    } else if (object instanceof Weaver) {
      this.score += 4;
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
    ctx.drawImage(background, 0, 0, Game.DIM_X, Game.DIM_Y);
    let health = new Image();
    health.src = "images/snaphealth.png";
    let bombs = new Image();
    bombs.src = "images/bullets.png";
    for (let i = 0; i < this.ships[0].lives; i++) {
      ctx.drawImage(health, 10 + i * 30, 10, 30, 30);
    }
    for (let i = 0; i < this.ships[0].bombs; i++) {
      ctx.drawImage(bombs, 5, 175, 30, 30, 120 + i * 30, -8, 50, 50);
    }

    ctx.font = "25px Verdana";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Score ${this.score}.00`, Game.DIM_X - 150, 30);//Game.DIM_X - 100, Game.DIM_Y - 10);

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

  clearScreen() {
    this.objectsInPlay = [this.objectsInPlay[0]];
  }

  gameOver() {
    // cancelAnimationFrame(window.requestId);
    // this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    // const canvasEl = document.getElementById("game-canvas");
    // const ctx = canvasEl.getContext("2d");
    //
    // canvasEl.width = Game.DIM_X;
    // canvasEl.height = Game.DIM_Y;
    //
    // ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    // let newGameBackground = new Image();
    // newGameBackground.src = "images/space.jpg";
    // newGameBackground.onload = () => {
    //   ctx.drawImage(newGameBackground, 0, 0, Game.DIM_X, Game.DIM_Y);
    // };
    //
    // this.ctx.font = "42px serif";
    // this.ctx.fillStyle = "#FFFFFF";
    // this.ctx.textAlign='center';
    // this.ctx.fillText(`Gave Over`, Game.DIM_X / 2, Game.DIM_Y / 2);
    // window.addEventListener('keydown', (e) => {
    //   e.preventDefault();
    //   new GameView(new Game(ctx), ctx).start();
    // });
  }

}

Game.DIM_X = window.innerWidth;
Game.DIM_Y = window.innerHeight;
Game.NUM_WANDERERS = 2;
Game.NUM_GRUNTS = 2;
Game.NUM_WEAVERS = 1;
module.exports = Game;

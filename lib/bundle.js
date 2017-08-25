/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const Util = {

  dir (vec) {
    const norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  },

  norm (vec) {
    return Util.dist([0, 0], vec);
  },

  scale(vec, m) {
    return( [vec[0] * m, vec[1] * m]);
  },

  randomVec(length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },

  dist(pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  },

  findShipVec(pos, length, ship) {
    let xVelBig = ship.pos[0] - pos[0];
    let yVelBig = ship.pos[1] - pos[1];
    let mBig = Util.dist(ship.pos, pos);
    let xVelScaled = length * xVelBig / mBig;
    let yVelScaled = length * yVelBig / mBig;
    return([xVelScaled, yVelScaled]);
  }

};

module.exports = Util;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.type = options.type;
    this.speed = options.speed;
    this.friction = 0.98;
  }

  draw(ctx) {
    let background = new Image();
    background.src = this.image;
    ctx.drawImage(background, this.pos[0] - 20, this.pos[1] - 20, 50, 50);
  }

  move(timeDelta) {
  }

  isCollideWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return (this.radius + otherObject.radius > centerDist);
  }

  collideWith(otherObject) {
  }

  remove() {
    this.game.remove(this);
  }

}
const NORMAL_FRAME_TIME_DELTA = 1000/120;

module.exports = MovingObject;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);

class Bullet extends MovingObject {
  constructor(options) {
    options.radius = Bullet.RADIUS;
    super(options);
    this.image = 'images/bullets.png';
  }

  move(timeDelta) {
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
       offsetX = this.vel[0] * velocityScale,
       offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    if (this.game.isOutOfBounds(this.pos)) {
      this.remove();
    }
  }

  draw(ctx) {
    let background = new Image();
    background.src = this.image;
    ctx.drawImage(background, 115, 5, 25, 25, this.pos[0], this.pos[1], 50, 50);
  }

}
const NORMAL_FRAME_TIME_DELTA = 1000/120;

Bullet.RADIUS = 2;
Bullet.SPEED = 5;




module.exports = Bullet;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const Util = __webpack_require__(0);
const Bullet = __webpack_require__(2);

class Ship extends MovingObject {
  constructor(options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0,0];
    options.color = options.color || '#32cd32';
    options.pos = options.pos || [0,0];
    options.type = 'SHIP';
    options.game = options.game;
    options.speed = Ship.SPEED;
    super(options);
    this.image = 'images/snapchat.jpg';
    this.lives = 3;
    this.bombs = 3;
  }

  relocate() {
    this.pos = [this.game.dim_x / 2, this.game.dim_y / 2];
    this.vel = [0, 0];
    this.lives--;
    this.game.clearScreen();
  }

   move(timeDelta) {
     this.vel[0] *= this.friction;
     this.vel[1] *= this.friction;
     const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
        offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;

     this.pos = [this.bounding(this.pos[0] + offsetX, this.game.dim_x),
      this.bounding(this.pos[1] + offsetY, this.game.dim_y)];
   }

   bounding(coord, max) {
     if (coord > max) {
       this.vel[0] = 0
       this.vel[1] = 0
       return max - Ship.RADIUS / 2;
     } else if (coord  < 0) {
       this.vel[0] = 0
       this.vel[1] = 0
       return 0 + Ship.RADIUS;
     } else {
      return coord;
    }
   }

   bomb() {
     if (this.bombs > 0) {
       this.game.bombed();
      this.bombs--;
     }

   }

  fireBullet(dir) {
    let relVel;

    if (dir[0] && dir[1] && Math.sign(dir[0] !== Math.sign(dir[1]))) {
      relVel = [this.vel[0] + Bullet.SPEED * Math.sign(dir[1]) * -1,
       this.vel[1] + Bullet.SPEED * Math.sign(dir[0])];
    } else if (dir[0] && dir[1]) {
      relVel = [this.vel[0] + Bullet.SPEED * Math.sign(dir[1]),
       this.vel[1] + Bullet.SPEED * Math.sign(dir[0]) * -1];
    } else if (dir[0]) {
      relVel = [this.vel[0] + Bullet.SPEED * Math.sign(dir[0]), this.vel[1]];
    } else {
      relVel = [this.vel[0], this.vel[1] + Bullet.SPEED * Math.sign(dir[1]) * -1];
    }

    const bullet = new Bullet({
      pos: this.pos,
      vel: relVel,
      color: this.color,
      game: this.game
    });
    this.game.bullets.push(bullet);
    this.game.objectsInPlay.push(bullet);
  }

  keypress(keys) {
    if (keys[37] && keys[38]) {
      this.fireBullet([-1, 1]);
    } else if (keys[38] && keys[39]) {
      this.fireBullet([1,1]);
    } else if (keys[39] && keys[40]) {
      this.fireBullet([1, -1]);
    } else if (keys[37] && keys[40]) {
      this.fireBullet([-1, -1]);
    } else if (keys[37]) {
      this.fireBullet([-1,0]);
    } else if (keys[38]) {
      this.fireBullet([0,1]);
    } else if (keys[39]) {
      this.fireBullet([1,0]);
    } else if (keys[40]) {
      this.fireBullet([0,-1]);
    }

    if (keys[32] && this.bombs > 0) {
      this.game.clearScreen();
      this.bombs--;
    }

    if (keys[87]) {
            if (this.vel[1] > -Ship.SPEED) {
                this.vel[1]--;
            }
        }

    if (keys[83]) {
        if (this.vel[1] < Ship.SPEED) {
            this.vel[1]++;
        }
    }
    if (keys[68]) {
        if (this.vel[0] < Ship.SPEED) {
            this.vel[0]++;
        }
    }
    if (keys[65]) {
        if (this.vel[0] > -Ship.SPEED) {
            this.vel[0]--;
        }
    }
  }
}
const NORMAL_FRAME_TIME_DELTA = 1000/120;

Ship.SPEED = 4;
Ship.RADIUS = 15;
module.exports = Ship;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.addShip();
  }

  start() {
    this.bindKeyHandlers();
    requestAnimationFrame(this.game.animate);
  }

  bindKeyHandlers() {
    const ship = this.ship;
    let keys = {};
    window.keys = keys;
    let timeId = 0;
    window.addEventListener('keydown', (e) => {
      if (GameView.keys.includes(e.keyCode)) {
        e.preventDefault();
      }
      keys[e.keyCode] = e.type === 'keydown';
      clearTimeout(timeId);
      timeId = window.setTimeout( () => {
        this.ship.keypress(keys);
      }, 50);
    });
    window.addEventListener('keyup', (e) => {
      keys[e.keyCode] = e.type !== 'keyup';
    });
  }
}

GameView.keys = [32, 37, 38, 39, 40, 87, 83, 68, 65];

module.exports = GameView;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(6);
const GameView = __webpack_require__(4);

document.addEventListener("DOMContentLoaded", function(){

  const canvasEl = document.getElementById("game-canvas");
  const ctx = canvasEl.getContext("2d");

  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  function drawText(text,centerX,centerY, font, fill) {
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(text,centerX,centerY);
    ctx.restore();
  }

  let startUpBackground = new Image();
  let controls = new Image();
  let arrowKeys = new Image();
  let spaceBar = new Image();
  startUpBackground.onload = () => {

    ctx.drawImage(startUpBackground, 0, 0, Game.DIM_X, Game.DIM_Y);
    drawText('IPO DEFENDER', Game.DIM_X / 2, Game.DIM_Y / 8, '48px serif');
    ctx.drawImage(controls, Game.DIM_X / 2 - 300, Game.DIM_Y / 3, 150, 100);
    drawText('To Move', Game.DIM_X / 2 - 225, Game.DIM_Y / 3 + 130, '28px serif');
    ctx.drawImage(arrowKeys, Game.DIM_X / 2 - 75, Game.DIM_Y / 3, 150, 100);
    drawText('To shoot', Game.DIM_X / 2, Game.DIM_Y / 3 + 132, '28px serif');
    ctx.drawImage(spaceBar, Game.DIM_X / 2 + 150, Game.DIM_Y / 3 + 50, 150, 50);
    drawText('To bomb', Game.DIM_X / 2 + 220, Game.DIM_Y / 3 + 132, '28px serif');

    drawText('Press Enter To Start', Game.DIM_X / 2, Game.DIM_Y / 2 + 200, '32px serif');
  };
  startUpBackground.src = "images/space.jpg";
  controls.src = "images/movement.png";
  arrowKeys.src = "images/arrow_keys.png";
  spaceBar.src = "images/spacebar.png";

  let startScreenListener = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
      window.addEventListener('keyup', (e2) => {
        e2.preventDefault();
        window.removeEventListener('keydown', startScreenListener);
      });
      const game = new Game(ctx);
      new GameView(game, ctx).start();
    };
  };

  window.addEventListener('keydown', startScreenListener);

});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Wanderer = __webpack_require__(7);
const Ship = __webpack_require__(3);
const Bullet = __webpack_require__(2);
const Grunt = __webpack_require__(8);
const Util = __webpack_require__(0);
const Weaver = __webpack_require__(9);
const Levels = __webpack_require__(10);
const GameView = __webpack_require__(4);

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
    this.lastTime = 0;
    this.paused = false;
    this.animate = this.animate.bind(this);
  }

  animate(time) {
    const timeDelta = time - this.lastTime;
    this.step(timeDelta);
    this.lastTime = time;
    console.log(this.paused);
    if (!this.paused) {
      this.draw(this.ctx);
      requestAnimationFrame(this.animate.bind(this));
    }
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
        //Upon pausing the game need to set it so the elements stay in the same position
        this.paused = true;
        this.ctx.save();
        this.ctx.font = "42px serif";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign='center';
        this.ctx.fillText(`Round ${this.level + 1}`, Game.DIM_X / 2, Game.DIM_Y / 4);
        window.setTimeout( () => {
          this.level++;
          this.setUpRound(currLevel);
          this.paused = false;
          this.ctx.restore();
          requestAnimationFrame(this.animate.bind(this));
        }, 2000);
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

  spawnEnemy() {
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

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    let background = new Image();
    background.src = "images/space.jpg";
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
    let objectsInPlay = this.objectsInPlay;
    for (let i = 0; i < objectsInPlay.length; i++) {
      for (let j = 0; j < objectsInPlay.length; j++) {
        if (i === j) {
          continue;
        } else if (!objectsInPlay[i] || !objectsInPlay[j]) {
          continue;
        } else if (objectsInPlay[i].isCollideWith(objectsInPlay[j])) {
          objectsInPlay[i].collideWith(objectsInPlay[j]);
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
    this.paused = true;
    this.ctx.save();
    this.ctx.font = "42px serif";
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.textAlign='center';
    this.ctx.fillText(`Game Over! Your score was ${this.score}.00`, Game.DIM_X / 2, Game.DIM_Y / 3);
    this.ctx.fillText(`Press enter to play again.`, Game.DIM_X / 2, Game.DIM_Y / 3 + 80);
    let newGameListener = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.ships[0].lives = 3;
        this.ships[0].bombs = 3;
        this.level = 0;
        this.score = 0;
        this.ships[0].pos = [Game.DIM_X / 2, Game.DIM_Y / 2];
        this.ships[0].vel = [0,0];
        this.paused = false;
        window.addEventListener('keyup', (e2) => {
          e2.preventDefault();
          window.removeEventListener('keydown', newGameListener);
        });
        window.setTimeout( () => {
          requestAnimationFrame(this.animate);
        }, 1000);
      }
    };


    window.addEventListener('keydown', newGameListener);
  }

}

Game.DIM_X = window.innerWidth;
Game.DIM_Y = window.innerHeight;
Game.NUM_WANDERERS = 2;
Game.NUM_GRUNTS = 2;
Game.NUM_WEAVERS = 1;
module.exports = Game;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);
const Ship = __webpack_require__(3);
const Bullet = __webpack_require__(2);

const DEFAULTS = {
  COLOR: '#505050',
  RADIUS: 25,
  SPEED: 2
};

class Wanderer extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.radius = DEFAULTS.RADIUS;
    options.pos = options.pos || options.game.spawnEnemy();
    options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
    options.speed = DEFAULTS.SPEED;
    super(options);
    this.image = 'images/yahoo.jpg';
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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);
const Ship = __webpack_require__(3);
const Bullet = __webpack_require__(2);

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


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);
const Ship = __webpack_require__(3);
const Bullet = __webpack_require__(2);

const DEFAULTS = {
  COLOR: '#ff0000',
  RADIUS: 25,
  SPEED: 1
};

class Weaver extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.radius = DEFAULTS.RADIUS;
    options.pos = options.pos || options.game.spawnEnemy();
    options.vel = [0,0];
    options.type = "WEAVER";
    super(options);
    this.ship = options.ship;
    this.speed = DEFAULTS.SPEED;
    this.bullets = options.bullets;
    this.image = "images/apple.jpg";
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
    if (this.bullets.length !== 0) {
      let someVectorCalc = this.pointBetween();
      if (someVectorCalc) {
        if (someVectorCalc > 0) {
          this.vel[0] = this.vel[0] + (5 * Math.sign(someVectorCalc));
          this.vel[1] = this.vel[1] + (5 * Math.sign(someVectorCalc));
        } else {
          this.vel[0] = this.vel[0] + (5 * Math.sign(someVectorCalc));
          this.vel[1] = this.vel[1] + (5 * Math.sign(someVectorCalc));
        }
      } else {
        const velTowardsShip = Util.findShipVec(this.pos, this.speed, this.ship);
        this.vel[0] = velTowardsShip[0];
        this.vel[1] = velTowardsShip[1];
      }
    } else {
      const velTowardsShip = Util.findShipVec(this.pos, this.speed, this.ship);
      this.vel[0] = velTowardsShip[0];
      this.vel[1] = velTowardsShip[1];
    }
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
       offsetX = this.vel[0] * velocityScale,
       offsetY = this.vel[1] * velocityScale;

    this.pos = [this.bounding(this.pos[0] + offsetX, this.game.dim_x),
      this.bounding(this.pos[1] + offsetY, this.game.dim_y)];
  }

  bounding(coord, max) {
    if (coord > max) {
      return max;
    } else if (coord  < 0) {
      return 0;
    } else {
     return coord;
   }
  }

  pointBetween() {
    for (let i = 0; i < this.bullets.length; i++) {
      let dxc = this.bullets[i].pos[0] - this.pos[0];
      let dyc = this.bullets[i].pos[1] - this.pos[1];

      let dxl = this.ship.pos[0] - this.pos[0];
      let dyl = this.ship.pos[1] - this.pos[1];

      let cross = dxc * dyl - dyc * dxl;
      let threshold = 1000;
      if (Math.abs(cross) < threshold) {
        let between;
        if (Math.abs(dxl) > Math.abs(dyl)) {
          between = dxl > 0 ?
            this.pos[0] <= this.bullets[i].pos[0] && this.bullets[i].pos[0] <= this.ship.pos[0] :
            this.ship.pos[0] <= this.bullets[i].pos[0] && this.bullets[i].pos[0] <= this.pos[0];
        } else  {
          between = dyl > 0 ?
            this.pos[1] <= this.bullets[i].pos[1] && this.bullets[i].pos[1] <= this.ship.pos[1] :
            this.ship.pos[1] <= this.bullets[i].pos[1] && this.bullets[i].pos[1] <= this.pos[1];
        }
        if (between) {
          return cross;
        }
      }
    }
  }

}
const NORMAL_FRAME_TIME_DELTA = 1000/120;

module.exports = Weaver;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

const levels = () => {
  return [
    //level 0
    {
      score: 0,
      spawnRate: 80,
      enemies: [
        ['wanderer', 20],
        ['grunt', 10],
        ['weaver', 5]
      ]
    },
    //level 1
    {
      score: 0,
      spawnRate: 75,
      enemies: [
        ['wanderer', 30],
        ['grunt', 20],
        ['weaver', 5]
      ]
    },
    //level 2
    {
      score: 0,
      spawnRate: 70,
      enemies: [
        ['wanderer', 50],
        ['grunt', 40],
        ['weaver', 10]
      ]
    },
    //level 3
    {
      score: 0,
      spawnRate: 60,
      enemies: [
        ['wanderer', 20],
        ['grunt', 30],
        ['weaver', 10]
      ]
    },
    //level 4
    {
      score: 0,
      spaw_rate: 50,
      enemies: [
        ['wanderer', 25],
        ['grunt', 30],
        ['weaver', 10]
      ]
    },
    //level 5
    {
      score: 0,
      spawnRate: 45,
      enemies: [
        ['wanderer', 20],
        ['grunt', 30],
        ['weaver', 20]
      ]
    }
  ];
};

module.exports = levels;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
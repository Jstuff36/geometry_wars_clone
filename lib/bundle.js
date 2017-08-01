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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
  
  //normalize vector to 1
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
    this.friction = 0.98;
    this.isWrappable = true;
    this.type = options.type;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  move() {
    let wrappedPos = this.game.wrap(this.pos);
    if (this.type === 'SHIP') {
      this.vel[0] *= this.friction;
      this.vel[1] *= this.friction;
    }
    wrappedPos[0] += this.vel[0];
    wrappedPos[1] += this.vel[1];
    this.pos = [wrappedPos[0], wrappedPos[1]];
    if (this.game.isOutOfBounds(this.pos)) {
      if (!this.isWrappable) {
        this.remove();
      }
    }
  }

  // move() {
  //   let bouncedObject = this.game.wrap(this.pos);
  //   this.vel[0] = bouncedObject[0][1];
  //   this.vel[1] = bouncedObject[1][1];
  //   this.pos[0] = bouncedObject[0][0];
  //   this.pos[1] = bouncedObject[1][0];
  //   if (this.color === "#32cd32") {
  //     this.vel[0] *= this.friction;
  //     this.vel[1] *= this.friction;
  //   }
  //   this.pos[0] += this.vel[0];
  //   this.pos[1] += this.vel[1];
  //   if (this.game.isOutOfBounds(this.pos)) {
  //     if (!this.isWrappable) {
  //       this.remove();
  //     }
  //   }dd
  // }

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

module.exports = MovingObject;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);

class Bullet extends MovingObject {
  constructor(options) {
    options.radius = Bullet.RADIUS;
    super(options);
    this.isWrappable = false;
  }
}

Bullet.RADIUS = 2;
Bullet.SPEED = 15;

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
    options.type = 'SHIP';
    super(options);
  }

  relocate() {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
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
    this.game.add(bullet);
  }

  keypress(keys) {
    let dir;
    console.log(keys);
    if (keys[37] && keys[38]) {
      dir = [-1, 1];
      this.fireBullet(dir);
    } else if (keys[38] && keys[39]) {
      dir = [1,1];
      this.fireBullet(dir);
    } else if (keys[39] && keys[40]) {
      dir = [1, -1];
      this.fireBullet(dir);
    } else if (keys[37] && keys[40]) {
      dir = [-1, -1];
      this.fireBullet(dir);
    } else if (keys[37]) {
      dir = [-1,0];
      this.fireBullet(dir);
    } else if (keys[38]) {
      dir = [0,1];
      this.fireBullet(dir);
    } else if (keys[39]) {
      dir = [1,0];
      this.fireBullet(dir);
    } else if (keys[40]) {
      dir = [0,-1];
      this.fireBullet(dir);
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

Ship.SPEED = 2;
Ship.RADIUS = 15;
module.exports = Ship;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(5);
const GameView = __webpack_require__(7);

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById("game-canvas");
  const ctx = canvasEl.getContext("2d");

  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const game = new Game();
  new GameView(game, ctx).start();
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Wanderer = __webpack_require__(6);
const Ship = __webpack_require__(3);
const Bullet = __webpack_require__(2);

class Game {
  constructor() {
    this.wanderers = [];
    this.addWanderers();
    this.ships = [];
    this.bullets = [];
  }

  add(object) {
    if( object instanceof Wanderer) {
      this.wanderers.push(object);
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
  //
  // wrap(pos, vel) {
  //
  //
  //   return([this.boundCalculator(pos[0], vel[0], Game.DIM_X),
  //     this.boundCalculator(pos[1], vel[1], Game.DIM_Y)]);
  // }
  //
  // boundCalculator(coord, vel, max) {
  //   if (coord < 0) {
  //     return ([Math.abs(coord % max), -vel]);
  //   } else if (coord > max) {
  //     return([max - (coord % max), -vel]);
  //   } else {
  //     return(coord);
  //   }
  // }

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
    return [].concat(this.ships, this.wanderers, this.bullets);
  }

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
  (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_WANDERERS = 1;

module.exports = Game;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);
const Ship = __webpack_require__(3);
const Bullet = __webpack_require__(2);

const DEFAULTS = {
  COLOR: '#505050',
  RADIUS: 25,
  SPEED: 4
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


/***/ }),
/* 7 */
/***/ (function(module, exports) {

class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.addShip();
  }

  start() {
    this.bindKeyHandlers();
    setInterval(() => {
      this.game.draw(this.ctx);
      this.game.step();
    }, 10);
  }

  bindKeyHandlers() {
    const ship = this.ship;
    let keys = {};
    window.keys = keys;
    window.addEventListener('keydown', (e) => {
      keys[e.keyCode] = e.type === 'keydown';
      this.ship.keypress(keys);
    });
    window.addEventListener('keyup', (e) => {
      keys[e.keyCode] = e.type !== 'keyup';
    });
  }
}

module.exports = GameView;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.addShip();
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
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

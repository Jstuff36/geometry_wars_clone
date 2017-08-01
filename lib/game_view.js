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

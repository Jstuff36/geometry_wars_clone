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
    let keys = [];
    window.addEventListener('keydown', (e) => {
      keys[e.keyCode] = true;
      this.ship.keypress(keys);
    });
    window.addEventListener('keyup', (e) => {
      keys[e.keyCode] = false;
    });
  }
}

module.exports = GameView;

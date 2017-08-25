const Game = require("./game");
const GameView = require("./game_view");

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

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
  startUpBackground.onload = () => {

    ctx.drawImage(startUpBackground, 0, 0, Game.DIM_X, Game.DIM_Y);
    drawText('IPO DEFENDER', Game.DIM_X / 2, Game.DIM_Y / 8, '48px serif');
    drawText('Controls', Game.DIM_X / 2, Game.DIM_Y / 4, '32px serif');
    drawText('A W S D to move around', Game.DIM_X / 2, Game.DIM_Y / 4 + 30, '28px serif');
    drawText('Arrow keys to shoot', Game.DIM_X / 2, Game.DIM_Y / 4 + 60, '28px serif');
    drawText('Space Bar to bomb', Game.DIM_X / 2, Game.DIM_Y / 4 + 90, '28px serif');

    drawText('Press Any Key To Start', Game.DIM_X / 2, Game.DIM_Y / 2, '32px serif');
  };
  startUpBackground.src = "images/space.jpg";

  let startScreenListener = (e) => {
    e.preventDefault();
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    window.addEventListener('keyup', (e2) => {
      e2.preventDefault();
      window.removeEventListener('keydown', startScreenListener);
    });
    const game = new Game(ctx);
    new GameView(game, ctx).start();
  };

  window.addEventListener('keydown', startScreenListener);

});

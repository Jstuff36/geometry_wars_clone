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

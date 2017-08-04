const levels = () => {
  return [
    //level 0
    {
      score: 0,
      spawnRate: 60,
      enemies: [
        ['wanderer', 0],
        ['grunt', 1]
      ]
    },
    //level 1
    {
      score: 0,
      spawnRate: 55,
      enemies: [
        ['wanderer', 1],
        ['grunt', 0]
      ]
    },
    //level 2
    {
      score: 0,
      spawnRate: 50,
      enemies: [
        ['wanderer', 50],
        ['grunt', 40],
        ['weaver', 10]
      ]
    },
    //level 3
    {
      score: 0,
      spawnRate: 40,
      enemies: [
        ['wanderer', 20],
        ['grunt', 30],
        ['weaver', 10]
      ]
    },
    //level 4
    {
      score: 0,
      spaw_rate: 35,
      enemies: [
        ['wanderer', 25],
        ['grunt', 30],
        ['weaver', 10]
      ]
    },
    //level 5
    {
      score: 0,
      spawnRate: 30,
      enemies: [
        ['wanderer', 20],
        ['grunt', 30],
        ['weaver', 20]
      ]
    }
  ];
};

module.exports = levels;

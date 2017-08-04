const levels = () => {
  return [
    //level 0
    {
      score: 0,
      spawnRate: 80,
      enemies: [
        ['wanderer', 20],
        ['grunt', 10]
      ]
    },
    //level 1
    {
      score: 0,
      spawnRate: 75,
      enemies: [
        ['wanderer', 30],
        ['grunt', 20]
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

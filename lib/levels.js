const levels = () => {
  return [
    //level 0
    {
      score: 0,
      spaw_rate: 60,
      level_end_span: ['wanderer', 10],
      enemies: [
        ['wanderer', 50],
        ['grunt', 30]
      ]
    },
    //level 1
    {
      score: 0,
      spaw_rate: 55,
      level_end_span: ['grunt', 5],
      enemies: [
        ['wanderer', 50],
        ['grunt', 40]
      ]
    },
    //level 2
    {
      score: 0,
      spaw_rate: 50,
      level_end_span: ['grunt', 8],
      enemies: [
        ['wanderer', 50],
        ['grunt', 40],
        ['weaver', 10]
      ]
    },
    //level 3
    {
      score: 0,
      spaw_rate: 40,
      level_end_span: ['weaver', 5],
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
      level_end_span: ['grunt', 15],
      enemies: [
        ['wanderer', 25],
        ['grunt', 30],
        ['weaver', 10]
      ]
    },
    //level 5
    {
      score: 0,
      spaw_rate: 30,
      level_end_span: ['weaver', 8],
      enemies: [
        ['wanderer', 20],
        ['grunt', 30],
        ['weaver', 20]
      ]
    }
  ];
};

module.exports = levels;

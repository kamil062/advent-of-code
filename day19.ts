export {};

let input = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

enum Option {
  ORE_ROBOT,
  CLAY_ROBOT,
  OBSIDIAN_ROBOT,
  GEODE_ROBOT,
  NOTHING,
}

type Blueprint = {
  id: number;
  oreRobotCost: number;
  clayRobotCost: number;
  obsidianRobotCost: [number, number];
  geodeRobotCost: [number, number];
};

class Resources {
  constructor(
    public ore: number = 0,
    public clay: number = 0,
    public obsidian: number = 0,
    public geode: number = 0
  ) {}

  static from(resources: Resources) {
    return new Resources(
      resources.ore,
      resources.clay,
      resources.obsidian,
      resources.geode
    );
  }
}
class Robots {
  constructor(
    public ore: number = 1,
    public clay: number = 0,
    public obsidian: number = 0,
    public geode: number = 0
  ) {}

  static from(robots: Robots) {
    return new Robots(robots.ore, robots.clay, robots.obsidian, robots.geode);
  }
}

function simulate(
  blueprint: Blueprint,
  resources: Robots,
  robots: Robots,
  minute: number = 1,
  limit: number = 24,
  bestResultAtLimit = { value: 0 },
  steps: { value: number } = { value: 0 }
) {
  steps.value++;

  const canBuyOreRobot = resources.ore >= blueprint.oreRobotCost;
  const canBuyClayRobot = resources.ore >= blueprint.clayRobotCost;
  const canBuyObsidianRobot =
    resources.ore >= blueprint.obsidianRobotCost[0] &&
    resources.clay >= blueprint.obsidianRobotCost[1];
  const canBuyGeodeRobot =
    resources.ore >= blueprint.geodeRobotCost[0] &&
    resources.obsidian >= blueprint.geodeRobotCost[1];

  const options: Option[] = [];

  const orePerMinute = robots.ore;
  const clayPerMinute = robots.clay;
  const obsidianPerMinute = robots.obsidian;

  const maxOreCost = Math.max(
    blueprint.oreRobotCost,
    blueprint.clayRobotCost,
    blueprint.obsidianRobotCost[0],
    blueprint.geodeRobotCost[0]
  )
  const maxClayCost = blueprint.obsidianRobotCost[1];
  const maxObsidianCost = blueprint.geodeRobotCost[1];

  if (canBuyGeodeRobot) options.push(Option.GEODE_ROBOT);
  if (canBuyObsidianRobot && obsidianPerMinute < maxObsidianCost) options.push(Option.OBSIDIAN_ROBOT);
  if (canBuyClayRobot && clayPerMinute < maxClayCost) options.push(Option.CLAY_ROBOT);
  if (canBuyOreRobot && orePerMinute < maxOreCost) options.push(Option.ORE_ROBOT);

  options.push(Option.NOTHING);

  options.forEach((option) => {
    const newResources = Resources.from(resources);
    const newRobots = Robots.from(robots);

    // Buy robot
    switch (option) {
      case Option.ORE_ROBOT:
        newResources.ore -= blueprint.oreRobotCost;
        break;
      case Option.CLAY_ROBOT:
        newResources.ore -= blueprint.clayRobotCost;
        break;
      case Option.OBSIDIAN_ROBOT:
        newResources.ore -= blueprint.obsidianRobotCost[0];
        newResources.clay -= blueprint.obsidianRobotCost[1];
        break;
      case Option.GEODE_ROBOT:
        newResources.ore -= blueprint.geodeRobotCost[0];
        newResources.obsidian -= blueprint.geodeRobotCost[1];
        break;
    }

    // Increase resources
    newResources.ore += robots.ore;
    newResources.clay += robots.clay;
    newResources.obsidian += robots.obsidian;
    newResources.geode += robots.geode;

    // Increase robots amount
    if (option == Option.ORE_ROBOT) newRobots.ore++;
    if (option == Option.CLAY_ROBOT) newRobots.clay++;
    if (option == Option.OBSIDIAN_ROBOT) newRobots.obsidian++;
    if (option == Option.GEODE_ROBOT) newRobots.geode++;

    // Update best result
    if (newResources.geode > bestResultAtLimit.value) {
      bestResultAtLimit.value = newResources.geode;
    }

    // Branch
    if (minute < limit) {
      const timeRemaining = limit - minute;
      const bestPossibleResultAtLimit =
        newResources.geode +
        newRobots.geode * timeRemaining +
        (timeRemaining * (timeRemaining + 1)) / 2;

      if (bestPossibleResultAtLimit >= bestResultAtLimit.value) {
        simulate(
          blueprint,
          newResources,
          newRobots,
          minute + 1,
          limit,
          bestResultAtLimit,
          steps
        );
      }
    }
  });
}

const pareInput = (input: string) => {
  const blueprints: Blueprint[] = [];

  input.split("\n").forEach((line, index) => {
    const pattern = /(\d+)/g;
    const result: number[] | undefined = line
      .match(pattern)
      ?.map((e) => Number(e));

    if (result) {
      blueprints.push({
        id: index + 1,
        oreRobotCost: result[1],
        clayRobotCost: result[2],
        obsidianRobotCost: [result[3], result[4]],
        geodeRobotCost: [result[5], result[6]],
      });
    }
  });

  return blueprints;
};

// Part 1
if(false) {
  const blueprints = pareInput(input);

  let result = 0;

  for (let blueprint in blueprints) {
    const resources = new Resources();
    const robots = new Robots();

    const steps = { value: 0 };
    const bestResult = { value: 0 };
    const start = performance.now();
    simulate(
      blueprints[blueprint],
      resources,
      robots,
      1,
      24,
      bestResult,
      steps
    );
    const end = performance.now();

    result += (Number(blueprint) + 1) * bestResult.value;

    console.log(
      `[${Number(blueprint) + 1}] Finished simulation after ${(
        (end - start) /
        1000
      ).toFixed(2)} seconds with ${Intl.NumberFormat("pl-PL").format(
        steps.value
      )} iterations with best result of ${bestResult.value} | ${result}`
    );
  }
}

// Part 2
if(true) {
  const blueprints = pareInput(input);

  let result = 1;

  for (let blueprint in blueprints.slice(3)) {
    const resources = new Resources();
    const robots = new Robots();

    const steps = { value: 0 };
    const bestResult = { value: 0 };
    const start = performance.now();
    simulate(
      blueprints[blueprint],
      resources,
      robots,
      1,
      32,
      bestResult,
      steps
    );
    const end = performance.now();

    result *= bestResult.value;

    console.log(
      `[${Number(blueprint) + 1}] Finished simulation after ${(
        (end - start) /
        1000
      ).toFixed(2)} seconds with ${Intl.NumberFormat("pl-PL").format(
        steps.value
      )} iterations with best result of ${bestResult.value} | ${result}`
    );
  }
}
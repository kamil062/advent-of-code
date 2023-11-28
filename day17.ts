export {};

let input = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

type AABB = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Rock = {
  parts: AABB[];
  position: AABB;
};

const rocks: Rock[] = [
  {
    /*
            ####
        */
    parts: [{ x: 0, y: 0, w: 4, h: 1 }],
    position: { x: 0, y: 0, w: 4, h: 1 },
  },
  {
    /*
            .#.
            ###
            .#.
        */
    parts: [
      { x: 1, y: 0, w: 1, h: 3 },
      { x: 0, y: 1, w: 3, h: 1 },
    ],
    position: { x: 0, y: 0, w: 3, h: 3 },
  },
  {
    /*
            ..#
            ..#
            ###
        */
    parts: [
      { x: 2, y: 0, w: 1, h: 3 },
      { x: 0, y: 2, w: 3, h: 1 },
    ],
    position: { x: 0, y: 0, w: 3, h: 3 },
  },
  {
    /*
            #
            #
            #
            #
        */
    parts: [{ x: 0, y: 0, w: 1, h: 4 }],
    position: { x: 0, y: 0, w: 1, h: 4 },
  },
  {
    /*
            ##
            ##
        */
    parts: [
      { x: 0, y: 0, w: 2, h: 1 },
      { x: 0, y: 1, w: 2, h: 1 },
    ],
    position: { x: 0, y: 0, w: 2, h: 2 },
  },
];

const copy = <T>(element: T): T => {
  return JSON.parse(JSON.stringify(element));
};

const highestElement = (map: string[][]) => {
  for (let y = 0; y < map.length; y++) {
    if (map[map.length - y - 1].every((cell) => cell === ".")) return y - 1;
  }

  return 0;
};

const mapPart = (map: string[][], rock: Rock) => {
  return map
    .slice(
      map.length - rock.position.y - rock.position.h,
      map.length - rock.position.y
    )
    .map((row) => {
      return row.slice(rock.position.x, rock.position.x + rock.position.w);
    });
};

const putRockOnMap = (map: string[][], rock: Rock, symbol: string = "#") => {
  let yStart = map.length - rock.position.y - rock.position.h;
  let xStart = rock.position.x;

  for (let part of rock.parts) {
    for (let partY = part.y; partY < part.y + part.h; partY++) {
      for (let partX = part.x; partX < part.x + part.w; partX++) {
        map[yStart + partY][xStart + partX] = symbol;
      }
    }
  }
};

const isMapPartFree = (map: string[][], rock: Rock) => {
  let _part = mapPart(map, rock);

  for (let part of rock.parts) {
    for (let partY = part.y; partY < part.y + part.h; partY++) {
      for (let partX = part.x; partX < part.x + part.w; partX++) {
        if (_part[partY][partX] == "#") return false;
      }
    }
  }

  return true;
};

{
  console.clear();

  let jets = input.split("");
  let jetIndex = 0;

  let map = Array(1)
    .fill(null)
    .map(() => {
      return Array(7)
        .fill(null)
        .map(() => `.`);
    });

  let totalHeight = 0;

  let iterations = 1_000_000_000_000;

  let topRows: Map<string, { position: number; towerHeight: number }> | null =
    new Map();

  let skippedHeight = 0;

  let realIterations = 0;

  for (let i = 0; i < iterations; i++, realIterations++) {
    let rock = copy(rocks[i % 5]);

    rock.position.x = 2;
    rock.position.y = highestElement(map) + 4;

    if (rock.position.y + rock.position.h > map.length) {
      let difference = rock.position.y + rock.position.h - map.length;
      for (let i = 0; i < difference; i++) {
        map.unshift(Array(7).fill("."));
      }
    }

    const increaseByJet = (rock: Rock) => {
      let jet = jets[jetIndex % jets.length];
      let delta = jet == ">" ? 1 : -1;

      if (
        rock.position.x + delta >= 0 &&
        rock.position.x + rock.position.w - 1 + delta < 7
      ) {
        rock.position.x += delta;
        if (!isMapPartFree(map, rock)) {
          rock.position.x -= delta;
        }
      } else {
      }

      jetIndex++;
    };

    while (true) {
      if (isMapPartFree(map, rock)) {
        increaseByJet(rock);
        rock.position.y -= 1;
      } else {
        rock.position.y += 1;
        break;
      }

      if (rock.position.y < 0) {
        rock.position.y = 0;
        break;
      }
    }

    putRockOnMap(map, rock);

    let towerHeight = highestElement(map);
    let n = 32;
    let offset = 0;

    let start = map.length - towerHeight + offset;
    let end = start + n;

    if (towerHeight > n + offset && topRows != null) {
      let top = map.slice(start, end).flat().join("");

      if (!topRows.has(top)) {
        topRows.set(top, { position: i, towerHeight });
      } else {
        let occurence = topRows.get(top) ?? { position: 0, towerHeight: 0 };

        let posDiff = i - occurence.position;

        if (posDiff > n) {
          console.log("repeat", topRows.get(top), i, towerHeight);
          topRows = null;

          let toSkip = Math.floor((iterations - i) / posDiff) * posDiff;
          let posIncrease = towerHeight - occurence?.towerHeight;

          skippedHeight = Math.floor((iterations - i) / posDiff) * posIncrease;

          console.log({ toSkip, posDiff, posIncrease, skippedHeight });

          i += toSkip;
          continue;
        }
      }
    }
  }

  let h = totalHeight + highestElement(map) + 1 + skippedHeight;

  console.log({ h, realIterations });
}

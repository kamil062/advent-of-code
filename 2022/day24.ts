export { }

let input = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

type Position = {
    x: number,
    y: number,
    parent?: Position
}

type Blizzard = {
    position: Position,
    direction: string
}

const compare = (posA: Position, posB: Position) => {
    return posA.x === posB.x && posA.y === posB.y
};

const parseInput = (input: string) => {
    let map: string[][] = input.split("\n").map(row => row.split(''));

    let playerPos = {
        x: map[0].indexOf('.'),
        y: 0
    } as Position;

    let endPos = {
        x: map[map.length - 1].indexOf('.'),
        y: map.length - 1
    } as Position;

    let blizzards: (Blizzard | null)[] = map
        .map((row, y) => {
            return row.map((cell, x) => {
                if (cell != '.' && cell != "#") {
                    return {
                        position: { x, y } as Position,
                        direction: cell
                    } as Blizzard
                } else {
                    return null;
                }
            })
        })
        .reduce((a, b) => a.concat(b), [])
        .filter(blizzard => blizzard != null);

    map = map.map((row: string[]) => {
        return row.map((cell: string) => {
            return cell.replace(">", ".")
                .replace("<", ".")
                .replace("v", ".")
                .replace("^", ".")
        })
    });

    return {
        map,
        playerPos,
        endPos,
        blizzards: blizzards as Blizzard[]
    }
}

const moveBlizzards = (map: string[][], blizzards: Blizzard[], iterations: number = 1) => {
    let w = map[0].length;
    let h = map.length;

    for (let it = 0; it < iterations; it++) {
        for (let i = 0; i < blizzards.length; i++) {
            let blizzard = blizzards[i];

            if (blizzard.direction == '>') {
                blizzard.position.x++;
                if (blizzard.position.x == w - 1) blizzard.position.x = 1;
            }
            if (blizzard.direction == '<') {
                blizzard.position.x--;
                if (blizzard.position.x == 0) blizzard.position.x = w - 2;
            }
            if (blizzard.direction == '^') {
                blizzard.position.y--;
                if (blizzard.position.y == 0) blizzard.position.y = h - 2;
            }
            if (blizzard.direction == 'v') {
                blizzard.position.y++;
                if (blizzard.position.y == h - 1) blizzard.position.y = 1;
            }
        }
    }

    return blizzards;
}

const movePlayer = (map: string[][], playerPos: Position): Position[] => {
    let neighbours: Position[] = [
        { x: playerPos.x + 1, y: playerPos.y },
        { x: playerPos.x - 1, y: playerPos.y },
        { x: playerPos.x, y: playerPos.y + 1 },
        { x: playerPos.x, y: playerPos.y - 1 },
        { x: playerPos.x, y: playerPos.y },
    ];

    let availablePositions = neighbours.filter(neighbour => {
        if (map[neighbour.y]?.[neighbour.x] == null) return false;
        if (map[neighbour.y][neighbour.x] == "#") return false;

        return true;
    });

    return availablePositions;
}

const greatestCommonDivisor = (a: number, b: number): number => {
    return a ? greatestCommonDivisor(b % a, a) : b
};

const leastCommonMultiple = (a: number, b: number): number => {
    return a * b / greatestCommonDivisor(a, b)
};

const findPath = (map: string[][], startPos: Position, targetPos: Position, blizzards: Blizzard[], trips: number = 1) => {
    let Q: [number, Position][] = [[0, startPos]];

    let w = map[0].length - 2;
    let h = map.length - 2;
    let lcm = leastCommonMultiple(w, h);

    let blizzardStates: Map<number, Blizzard[]> = new Map();

    let stage = 0;
    let target = targetPos;

    while (Q.length != 0) {
        let [level, currentPos] = Q.shift() as NonNullable<[number, Position]>;

        let blizzardState = blizzardStates.get(level % lcm);

        if (blizzardState == null) {
            blizzardStates.set(level % lcm, moveBlizzards(map, JSON.parse(JSON.stringify(blizzards)), level % lcm));
            blizzardState = blizzardStates.get(level % lcm);
        }

        if (blizzardState?.some(b => compare(b.position, currentPos))) {
            continue
        }

        if (compare(currentPos, target)) {
            if (stage == trips - 1) {
                return level;
            } else {
                target = (stage % 2 == 0) ? startPos : targetPos;
                stage++;
                Q = [[level, currentPos]];

                continue;
            }
        }

        let availablePositions = movePlayer(map, currentPos);

        for (let position of availablePositions) {
            if (Q.some(([qLevel, qPos]) => qLevel == (level + 1) && compare(qPos, position))) {
                continue;
            }

            Q.push([level + 1, position]);
        }
    }
}

{
    console.clear();

    let { map, playerPos, endPos, blizzards } = parseInput(input);

    console.log({ "1 trip": findPath(map, playerPos, endPos, blizzards, 1) })
    console.log({ "3 trips": findPath(map, playerPos, endPos, blizzards, 3) })
    // console.log({ "10 trips": findPath(map, playerPos, endPos, blizzards, 10) })
}
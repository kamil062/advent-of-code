let input = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

type Position = { x: number, y: number };
type Path = Position[];
type Cave = string[][];
type BBox = {
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    w: number,
    h: number
}

const inputToPaths = (input: string): Path[] => {
    return input
        .split("\n")
        .map(line => {
            return line.split(' -> ')
                .map(coord => {
                    let [x, y] = coord.split(',').map(e => parseInt(e));

                    return { x, y } as Position;
                });
        });
}

const initCave = (bbox: BBox, paths: Path[]): Cave => {
    let cave = Array(bbox.h + 1).fill(undefined).map(_ => {
        return Array(bbox.w + 1).fill('.');
    });

    for (let path of paths) {
        for (let i = 0; i < path.length - 1; i++) {
            let from = path[i];
            let to = path[i + 1];

            for (let x = Math.min(from.x, to.x); x <= Math.max(from.x, to.x); x++) {
                for (let y = Math.min(from.y, to.y); y <= Math.max(from.y, to.y); y++) {
                    cave[y - bbox.minY][x - bbox.minX] = "#";
                }
            }
        }
    }

    return cave;
}

const bounds = (paths: Path[]): BBox => {
    let minX = paths.flat().reduce((a, b) => Math.min(a, b.x), Infinity);
    let maxX = paths.flat().reduce((a, b) => Math.max(a, b.x), -Infinity);
    let minY = paths.flat().reduce((a, b) => Math.min(a, b.y), 0);
    let maxY = paths.flat().reduce((a, b) => Math.max(a, b.y), -Infinity);

    return {
        minX, maxX,
        minY, maxY,
        w: maxX - minX,
        h: maxY - minY
    }
}

const drawCave = (cave: Cave) => {
    console.log(
        "\n" + cave
            .map(e => e.join(''))
            .join('\n') + "\n"
    );
}

const isPositionFree = (position: Position, cave: Cave, bbox: BBox) => {
    return cave?.[position.y - bbox.minY]?.[position.x - bbox.minX] == '.';
}

const isInsideBounds = (position: Position, bbox: BBox) => {
    return position.x >= bbox.minX && position.x <= bbox.maxX
        && position.y >= bbox.minY && position.y <= bbox.maxY;
}

const simulateSandParticle = (cave: Cave, bbox: BBox) => {
    let particlePosition: Position = { x: 500, y: 0 };

    while (true) {
        let oneStepDown: Position = { x: particlePosition.x, y: particlePosition.y + 1 };
        let oneStepDownLeft: Position = { x: particlePosition.x - 1, y: particlePosition.y + 1 };
        let oneStepDownRight: Position = { x: particlePosition.x + 1, y: particlePosition.y + 1 };

        let shouldContinue = false;

        for (let nextPosition of [oneStepDown, oneStepDownLeft, oneStepDownRight]) {
            // console.log(nextPosition, isInsideBounds(nextPosition, bbox), isPositionFree(nextPosition, cave, bbox), cave?.[nextPosition.y - bbox.minY]?.[nextPosition.x - bbox.minX])
            if (isInsideBounds(nextPosition, bbox)) {
                if (isPositionFree(nextPosition, cave, bbox)) {
                    particlePosition = nextPosition;
                    shouldContinue = true;
                    break;
                }
            } else {
                return null;
            }
        }

        if (shouldContinue) continue;

        if (particlePosition.x == 500 && particlePosition.y == 0) {
            cave[particlePosition.y - bbox.minY][particlePosition.x - bbox.minX] = "o";
            return null;
        }

        // Particle settled
        cave[particlePosition.y - bbox.minY][particlePosition.x - bbox.minX] = "o";
        return particlePosition;
    }
}

const performSimulation = (cave: Cave, bbox: BBox) => {
    let particlesThatCameToRest = 0;
    while (true) {
        let particlePosition = simulateSandParticle(cave, bbox);

        if (particlePosition == null) {
            // drawCave(cave);
            return particlesThatCameToRest;
        } else {
            particlesThatCameToRest++;
        }
    }
}

console.clear();

// Part 1
{
    let paths = inputToPaths(input);
    let bbox = bounds(paths);
    let cave = initCave(bbox, paths);

    console.log(performSimulation(cave, bbox));
}

// Part 2
{
    let paths = inputToPaths(input);
    let bbox = bounds(paths);

    paths.push([
        {
            x: bbox.minX - bbox.w * 3,
            y: bbox.maxY + 2
        },
        {
            x: bbox.maxX + bbox.w * 3,
            y: bbox.maxY + 2
        }
    ])

    bbox = bounds(paths);
    let cave = initCave(bbox, paths);

    console.log(performSimulation(cave, bbox) + 1);
}

let input = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

const MAX_X = 20;
const MAX_Y = 20;
const PART1_ROW = 10;

type Position = { x: number, y: number };
type Sensor = Position;
type Beacon = Position;

type Pair = {
    beacon: Beacon,
    sensor: Sensor,
    distance: number
};

type BBox = {
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
};

const manhattanDistance = (p1: Position, p2: Position) => {
    return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
}

const parseInput = (input: string) => {
    return input
        .split("\n")
        .map(line => {
            line = line
                .replace("Sensor at ", "")
                .replace(": closest beacon is at ", ", ");

            let positions = line
                .split(", ")
                .map(p => parseInt(p.split("=")[1]));

            let sensor: Sensor = { x: positions[0], y: positions[1] };
            let beacon: Beacon = { x: positions[2], y: positions[3] };

            return {
                sensor,
                beacon,
                distance: manhattanDistance(sensor, beacon)
            } as Pair;
        });
}

const checkRow = (pairs: Pair[], bbox: BBox, rowIndex: number) => {
    let visibleCells = 0;

    for (let x = bbox.minX; x <= bbox.maxX; x++) {
        let position: Position = {
            x,
            y: rowIndex
        };

        let isSensorAtPosition = pairs.filter(pair => pair.sensor.x == position.x && pair.sensor.y == position.y).length > 0;
        let isBeaconAtPosition = pairs.filter(pair => pair.beacon.x == position.x && pair.beacon.y == position.y).length > 0;

        for (let pair of pairs) {
            let isCellInRange = isPositionVisibleBySensor(position, pair);

            if (isCellInRange && (!isSensorAtPosition && !isBeaconAtPosition)) {
                visibleCells++;
                break;
            }
        }
    }

    return visibleCells;
}

const isPositionVisibleBySensor = (position: Position, pair: Pair) => {
    let distance = manhattanDistance(position, pair.sensor);

    return distance <= pair.distance;
}

const isPositionVisibleByAnySensor = (position: Position, pairs: Pair[]) => {
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];

        if (isPositionVisibleBySensor(position, pair)) {
            return true;
        }
    }

    return false;
}

{
    console.clear();

    let pairs: Pair[] = parseInput(input);

    // PART 1
    {
        let bbox = pairs.map(pair => {
            let minX = pair.sensor.x - pair.distance;
            let maxX = pair.sensor.x + pair.distance;
            let minY = pair.sensor.y - pair.distance;
            let maxY = pair.sensor.y + pair.distance;

            return { minX, maxX, minY, maxY } as BBox;
        }).reduce((bboxA, bboxB) => {
            let minX = Math.min(bboxA.minX, bboxB.minX);
            let maxX = Math.max(bboxA.maxX, bboxB.maxX);
            let minY = Math.min(bboxA.minY, bboxB.minY);
            let maxY = Math.max(bboxA.maxY, bboxB.maxY);

            return { minX, maxX, minY, maxY } as BBox;
        });

        console.log("part 1", checkRow(pairs, bbox, PART1_ROW));
    }

    // PART 2
    // https://www.reddit.com/r/adventofcode/comments/zmcn64/comment/j0ags92/?utm_source=share&utm_medium=web2x&context=3
    {
        let limit: BBox = {
            minX: 0, maxX: MAX_X,
            minY: 0, maxY: MAX_Y
        };

        let positionsToCheck: Position[] = []

        for (let pair of pairs) {
            let distance = pair.distance + 1;
            let sensor = pair.sensor;

            for (let dX = 0; dX <= distance; dX++) {
                let dY = distance - dX;

                let position1: Position = { x: sensor.x + dX, y: sensor.y + dY };
                let position2: Position = { x: sensor.x + dX, y: sensor.y - dY };
                let position3: Position = { x: sensor.x - dX, y: sensor.y + dY };
                let position4: Position = { x: sensor.x - dX, y: sensor.y - dY };

                positionsToCheck.push(position1, position2, position3, position4)
            }
        }

        positionsToCheck = positionsToCheck.filter(position => {
            return position.x >= limit.minX && position.x <= limit.maxX
                && position.y >= limit.minY && position.y <= limit.maxY
        });

        for (let i = 0; i < positionsToCheck.length; i++) {
            let position = positionsToCheck[i];

            let visible = false;
            if (isPositionVisibleByAnySensor(position, pairs)) {
                visible = true;
            }

            if (!visible) {
                console.log("part 2", position.x * 4000000 + position.y);
                break;
            }
        }
    }
}
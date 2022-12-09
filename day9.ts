let input = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

type Direction = 'R' | 'L' | 'U' | 'D';
type Position = [number, number];

const manhattanDistance = (pos1: Position, pos2: Position): number => {
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}

const translate = (position: Position, translation: Position): Position => {
    return [position[0] + translation[0], position[1] + translation[1]];
}

const nextHeadPosition = (position: Position, direction: Direction): Position => {
    if (direction == 'R') return [position[0] + 1, position[1]];
    if (direction == 'L') return [position[0] - 1, position[1]];
    if (direction == 'U') return [position[0], position[1] + 1];
    if (direction == 'D') return [position[0], position[1] - 1];

    return position;
}

const nextTailPosition = (headPosition: Position, tailPosition: Position): Position => {
    let horizontalDifference = headPosition[0] - tailPosition[0];
    let verticalDifference = headPosition[1] - tailPosition[1];

    let isOnTheSameAxis = horizontalDifference == 0 || verticalDifference == 0;
    let distance = manhattanDistance(headPosition, tailPosition);

    let translation: Position = [0, 0];

    if (isOnTheSameAxis && distance == 2) {
        // On the same axis and two cells away - move tail towards head
        translation = [
            (horizontalDifference != 0) ? Math.sign(horizontalDifference) : 0,
            (verticalDifference != 0) ? Math.sign(verticalDifference) : 0
        ];
    } else if (!isOnTheSameAxis && distance > 2) {
        // On different axes and more than 2 cells away (not touching) - move diagonally towards head
        translation = [
            Math.sign(horizontalDifference),
            Math.sign(verticalDifference)
        ];
    }

    return translate(tailPosition, translation);
}

const visualize = (positions: Position[], gridSize: Position) => {
    let grid: string[][] = [];

    for (let i = 0; i < gridSize[0]; i++) grid[i] = Array(gridSize[1]).fill('.')

    for (let i = positions.length - 1; i >= 0; i--) {
        let position = positions[i];
        grid[position[1]][position[0]] = (i == 0 ? 'H' : (i)).toString();
    }

    console.log("\n" + grid.reverse().map(row => row.join('')).join('\n') + "\n");
}

const simulateRope = (numberOfKnots: number, steps: string[]): number => {
    let ropePositions: Position[] = Array(numberOfKnots).fill([0, 0]);
    let tailVisitedUniquePositions: Set<string> = new Set();

    // Track initial tail position
    tailVisitedUniquePositions.add(ropePositions[numberOfKnots - 1].toString());

    for (let step of steps) {
        let direction: Direction = <Direction>step.split(' ')[0];
        let numberOfSteps: number = parseInt(step.split(' ')[1]);

        for (let i = 0; i < numberOfSteps; i++) {
            // Move head
            ropePositions[0] = nextHeadPosition(ropePositions[0], direction);

            // Move other knots to follow
            for (let j = 1; j < ropePositions.length; j++) {
                ropePositions[j] = nextTailPosition(ropePositions[j - 1], ropePositions[j]);
            }

            // Track tail position
            tailVisitedUniquePositions.add(ropePositions[numberOfKnots - 1].toString());
        }
    }

    return tailVisitedUniquePositions.size;
}

console.clear();
console.log(
    simulateRope(2, input.split('\n')),
    simulateRope(10, input.split('\n'))
)
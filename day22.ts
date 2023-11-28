import * as fs from "fs";
import * as path from "path";

export { };

type Board = string[][];
type Position = { x: number, y: number };

const directions: Map<'right' | 'bottom' | "left" | "top", Position> = new Map([
    ["right", { x: 1, y: 0 }], // facing right
    ["bottom", { x: 0, y: 1 }], // facing bottom
    ["left", { x: -1, y: 0 }], // facing left
    ["top", { x: 0, y: -1 }], // facing top
]);

const parseInput = (input: string) => {
    let parts = input.split("\n\n");

    let rows: string[] = parts[0]
        .split('\n');

    let longestRow = rows.reduce((total, row) => Math.max(total, row.length), -Infinity);

    let board = rows.map(row => {
        return row.padEnd(longestRow, ' ').split("")
    })

    let commands = parts[1].match(/([\d]+|[RL])/g) as string[];

    return {
        board,
        commands,
    }
};

const getCell = (board: Board, position: Position) => {
    return board?.[position.y]?.[position.x] ?? ' ';
}

const isNumber = (value: string) => {
    return !Number.isNaN(parseInt(value));
}

const translate = (posA: Position, posB: Position) => {
    return {
        x: posA.x + posB.x,
        y: posA.y + posB.y
    }
}

const scale = (pos: Position, factor: number) => {
    return {
        x: pos.x * factor,
        y: pos.y * factor
    }
}

Array.prototype.findLastIndex = function (predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): number {
    let lastIndex = -1;

    thisArg = thisArg || this;

    for (let index = 0; index < thisArg.length; index++) {
        let value = thisArg[index];
        if (predicate(value, index, thisArg) === true) {
            lastIndex = index;
        }
    }

    return lastIndex;
}

const move = (board: Board, currentPos: Position, direction: Position, directionIndex: number, faceSize: number, wrap3D: boolean): [Position, Position, number] => {
    let nextPos = translate(currentPos, direction);
    let nextCell = getCell(board, nextPos);

    if (nextCell == '.') {
        return [
            nextPos,
            direction,
            directionIndex
        ];
    } else if (nextCell == '#') {
        return [
            currentPos,
            direction,
            directionIndex
        ];
    } else {
        if (wrap3D) {
            let face = (Math.floor(currentPos.y / faceSize) * 2 + Math.floor(currentPos.x / faceSize));

            const directionIs = (direction: Position, name: "right" | "bottom" | "left" | "top") => {
                return direction.x == directions.get(name)?.x && direction.y == directions.get(name)?.y
            }

            const mapping = (face: number, direction: Position, currentPos: Position): [Position, Position, number] => {
                let lastPos = translate(currentPos, scale(direction, -1));

                // https://www.reddit.com/r/adventofcode/comments/zsql2o/comment/j1baddi/?utm_source=share&utm_medium=web2x&context=3
                let changes: { [name: string]: [number, number, "right" | "bottom" | "left" | "top"] } = {
                    '1 top': [0, faceSize * 2 + lastPos.x, 'right'],
                    '1 left': [0, (faceSize * 3 - 1) - lastPos.y, 'right'],
                    '2 top': [lastPos.x - faceSize * 2, faceSize * 4 - 1, 'top'],
                    '2 right': [faceSize * 2 - 1, (faceSize * 3 - 1) - lastPos.y, 'left'],
                    '2 bottom': [faceSize * 2 - 1, lastPos.x - faceSize, 'left'],
                    '3 right': [lastPos.y + faceSize, faceSize - 1, 'top'],
                    '3 left': [lastPos.y - faceSize, faceSize * 2, 'bottom'],
                    '4 top': [faceSize, lastPos.x + faceSize, 'right'],
                    '4 left': [faceSize, (faceSize * 3 - 1) - lastPos.y, 'right'],
                    '5 right': [(faceSize * 3 - 1), (faceSize * 3 - 1) - lastPos.y, 'left'],
                    '5 bottom': [(faceSize - 1), lastPos.x + faceSize * 2, 'left'],
                    '6 bottom': [lastPos.x + faceSize * 2, 0, 'bottom'],
                    '6 right': [lastPos.y - faceSize * 2, (faceSize * 3 - 1), 'top'],
                    '6 left': [lastPos.y - faceSize * 2, 0, 'bottom']
                }

                let dir: string = "top";
                if (directionIs(direction, "bottom")) dir = "bottom";
                if (directionIs(direction, "left")) dir = "left";
                if (directionIs(direction, "right")) dir = "right";

                let [x, y, newDirectionName] = changes[`${face} ${dir}`];

                return [
                    { x, y } as Position,
                    directions.get(newDirectionName) as NonNullable<Position>,
                    [...directions.keys()].indexOf(newDirectionName)
                ]
            }

            let [nextPos, newDirection, directionIndex] = mapping(face, direction, currentPos);

            if (getCell(board, nextPos) != "#")
                return [
                    nextPos,
                    newDirection,
                    directionIndex
                ];
        } else {
            if (direction.x > 0) nextPos.x = board[currentPos.y].findIndex(e => e != ' ')
            if (direction.x < 0) nextPos.x = board[currentPos.y].findLastIndex(e => e != ' ')
            if (direction.y > 0) nextPos.y = board.findIndex((_, y) => getCell(board, { x: currentPos.x, y }) != ' ')
            if (direction.y < 0) nextPos.y = board.findLastIndex((_, y) => getCell(board, { x: currentPos.x, y }) != ' ')

            if (getCell(board, nextPos) != "#")
                return [
                    nextPos,
                    direction,
                    directionIndex
                ];
        }
    }

    return [
        currentPos,
        direction,
        directionIndex
    ];
}

const followPath = (board: Board, commands: string[], faceSize: number, wrap3D: boolean) => {
    let boardCopy: Board = JSON.parse(JSON.stringify(board));

    let currentPos: Position = {
        x: board[0].findIndex(cell => cell !== ' '),
        y: 0
    };
    let directionIndex = 0;
    let direction = directions.get([...directions.keys()][directionIndex]) as NonNullable<Position>;

    boardCopy[currentPos.y][currentPos.x] = ['>', 'v', '<', '^'][directionIndex];

    for (let command of commands) {
        if (isNumber(command)) {
            for (let i = 0; i < parseInt(command); i++) {
                [currentPos, direction, directionIndex] = move(board, currentPos, direction, directionIndex, faceSize, wrap3D);
                boardCopy[currentPos.y][currentPos.x] = ['>', 'v', '<', '^'][directionIndex];
            }
        } else {
            directionIndex = command == 'R'
                ? (directionIndex + 1)
                : (directionIndex - 1);

            if (directionIndex >= directions.size) directionIndex = 0;
            if (directionIndex < 0) directionIndex = directions.size - 1;

            direction = directions.get([...directions.keys()][directionIndex]) as NonNullable<Position>;
        }
    }

    return {
        finalPosition: {
            x: currentPos.x + 1,
            y: currentPos.y + 1
        } as Position,
        directionIndex: directionIndex,
    };
}

{
    console.clear();

    let input = fs.readFileSync("day22.txt").toString();

    {
        let { board, commands } = parseInput(input);
        let { finalPosition, directionIndex } = followPath(board, commands, 50, false);

        console.log("part1", 1000 * finalPosition.y + 4 * finalPosition.x + directionIndex)
    }

    {
        let { board, commands } = parseInput(input);
        let { finalPosition, directionIndex } = followPath(board, commands, 50, true);

        console.log("part2", 1000 * finalPosition.y + 4 * finalPosition.x + directionIndex)
    }
}
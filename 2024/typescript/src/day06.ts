{
    let data = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

    enum Cell {
        GUARD = '^',
        FLOOR = '.',
        OBJECT = '#',
        VISITED = 'X'
    };
    enum Direction { UP, DOWN, LEFT, RIGHT };
    type Map = Cell[][];

    const map: Map = data.split("\n")
        .map(row => {
            return row.split("").map(cell => {
                return cell as Cell;
            })
        });

    const simulateMoves = (map: Map) => {
        let guardX = 0, guardY = 0,
            direction = Direction.UP,
            w = map[0].length, h = map.length;
        const obstructions: number[][] = [];
        const visited: number[][] = [];
        const corners: number[][] = [];

        map.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell == '^') {
                    guardX = x, guardY = y;
                    visited.push([guardX, guardY, direction]);
                }

                if (cell == '#') {
                    obstructions.push([x, y]);
                }
            });
        });

        while (true) {
            let dX = 0, dY = 0;

            if (direction == Direction.UP) dY--;
            if (direction == Direction.DOWN) dY++;
            if (direction == Direction.LEFT) dX--;
            if (direction == Direction.RIGHT) dX++;

            const nextX = guardX + dX, nextY = guardY + dY;

            if (nextX < 0 || nextX >= w || nextY < 0 || nextY >= h) {
                break;
            }

            if (obstructions.find(o => (o[0] == nextX) && (o[1] == nextY))) {
                switch (direction) {
                    case Direction.UP: direction = Direction.RIGHT; break;
                    case Direction.RIGHT: direction = Direction.DOWN; break;
                    case Direction.DOWN: direction = Direction.LEFT; break;
                    case Direction.LEFT: direction = Direction.UP; break;
                }
                corners.push([guardX, guardY]);
            } else {
                guardX = nextX, guardY = nextY;

                const isNextPositionVisitedAndSameDirection = visited.find(o => (o[0] == guardX) && (o[1] == guardY) && o[2] == direction) != null;
                if (isNextPositionVisitedAndSameDirection) return null;

                if (visited.find(o => (o[0] == guardX) && (o[1] == guardY)) == null) {
                    visited.push([guardX, guardY, direction]);
                }
            }
        }

        return visited;
    }


    console.clear();
    const simulation = simulateMoves(map);
    console.log(
        simulation?.length,
        simulation
            ?.filter((option, i) => {
                const copy: Cell[][] = structuredClone(map);
                copy[option[1]][option[0]] = Cell.OBJECT;

                return simulateMoves(copy) == null
            })
            .length
    );
}
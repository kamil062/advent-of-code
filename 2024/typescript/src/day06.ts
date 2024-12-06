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
        OBSTACLE = '#',
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

    const comparePositions = (pos1: number[], pos2: number[]) => pos1[0] == pos2[0] && pos1[1] == pos2[1]

    const simulateMoves = (map: Map) => {
        const obstacles: number[][] = [];
        const visited: number[][] = [];

        let guardX = 0;
        let guardY = 0;
        let direction = Direction.UP;
        let w = map[0].length;
        let h = map.length;

        map.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell == Cell.GUARD) {
                    guardX = x, guardY = y;
                    visited.push([guardX, guardY, direction]);
                }

                if (cell == Cell.OBSTACLE) {
                    obstacles.push([x, y]);
                }
            });
        });

        while (true) {
            let dX = 0;
            let dY = 0;

            switch (direction) {
                case Direction.UP: dY--; break;
                case Direction.DOWN: dY++; break;
                case Direction.LEFT: dX--; break;
                case Direction.RIGHT: dX++; break;
            }

            const nextX = guardX + dX;
            const nextY = guardY + dY;

            if (nextX < 0 || nextX >= w || nextY < 0 || nextY >= h) break;

            if (obstacles.find(o => comparePositions(o, [nextX, nextY]))) {
                switch (direction) {
                    case Direction.UP: direction = Direction.RIGHT; break;
                    case Direction.RIGHT: direction = Direction.DOWN; break;
                    case Direction.DOWN: direction = Direction.LEFT; break;
                    case Direction.LEFT: direction = Direction.UP; break;
                }
            } else {
                guardX = nextX;
                guardY = nextY;

                const visitedPosition = visited.find(o => comparePositions(o, [guardX, guardY]));
                if (visitedPosition?.[2] == direction) return null;

                if (visitedPosition == null) {
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
            ?.filter(option => {
                const copy: Cell[][] = structuredClone(map);
                copy[option[1]][option[0]] = Cell.OBSTACLE;

                return simulateMoves(copy) == null
            })
            .length
    );
}
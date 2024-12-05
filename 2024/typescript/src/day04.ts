{
    const data1 = `....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX`;

    const data2 = `.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`;


    type Letter = 'X' | 'M' | 'A' | 'S' | '.';
    type Grid = Letter[][];
    enum Direction { N = "N", S = "S", W = "W", E = "E", NW = "NW", NE = "NE", SW = "SW", SE = "SE" };

    const gridSize = (grid: Grid) => ({ w: grid[0].length, h: grid.length });

    const get = (grid: Grid, y: number, x: number) => grid[y]?.[x];

    const getLettersInDirection = (grid: Grid, x: number, y: number, direction: Direction) => {
        const letters = [];

        switch (direction) {
            case Direction.N: letters.push(get(grid, y, x), get(grid, y - 1, x), get(grid, y - 2, x), get(grid, y - 3, x)); break;
            case Direction.S: letters.push(get(grid, y, x), get(grid, y + 1, x), get(grid, y + 2, x), get(grid, y + 3, x)); break;
            case Direction.W: letters.push(get(grid, y, x), get(grid, y, x - 1), get(grid, y, x - 2), get(grid, y, x - 3)); break;
            case Direction.E: letters.push(get(grid, y, x), get(grid, y, x + 1), get(grid, y, x + 2), get(grid, y, x + 3)); break;

            case Direction.NW: letters.push(get(grid, y, x), get(grid, y - 1, x - 1), get(grid, y - 2, x - 2), get(grid, y - 3, x - 3)); break;
            case Direction.SW: letters.push(get(grid, y, x), get(grid, y + 1, x - 1), get(grid, y + 2, x - 2), get(grid, y + 3, x - 3)); break;
            case Direction.NE: letters.push(get(grid, y, x), get(grid, y - 1, x + 1), get(grid, y - 2, x + 2), get(grid, y - 3, x + 3)); break;
            case Direction.SE: letters.push(get(grid, y, x), get(grid, y + 1, x + 1), get(grid, y + 2, x + 2), get(grid, y + 3, x + 3)); break;
        }

        return letters
            .filter(e => e)
            .join('');
    }

    const xmasesAtPoint = (grid: Grid, x: number, y: number) => {
        return [
            Direction.N, Direction.S, Direction.W, Direction.E,
            Direction.NW, Direction.SW, Direction.NE, Direction.SE
        ]
            .map(direction => getLettersInDirection(grid, x, y, direction))
            .filter(letters => letters == "XMAS")
            .length;
    }

    const totalXmases = (grid: Grid) => {
        let total = 0;
        const { w, h } = gridSize(grid);

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                total += xmasesAtPoint(grid, x, y);
            }
        }

        return total;
    }

    const subGrid = (grid: Grid, x: number, y: number, size: number) => grid
        .slice(y, y + size)
        .map(row => row.slice(x, x + size));

    const comparePatternToGrid = (grid: Grid, pattern: string) => {
        const { w, h } = gridSize(grid);

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                const cell = get(grid, y, x);
                const patternCell = pattern[y * w + x];

                if (patternCell != '.' && cell != patternCell) {
                    return false;
                }
            }
        }

        return true;
    }

    const totalXDashMases = (grid: Grid) => {
        const patterns = [
            `M.S
             .A.
             M.S`,

            `M.M
             .A.
             S.S`,

            `S.M
             .A.
             S.M`,

            `S.S
             .A.
             M.M`
        ].map(p => p.replace(/\s/g, ''));
        const { w, h } = gridSize(grid);
        let total = 0;

        for (let y = 0; y <= h - 3; y++) {
            for (let x = 0; x <= w - 3; x++) {
                for (let pattern of patterns) {
                    const part = subGrid(grid, x, y, 3);
                    if (comparePatternToGrid(part, pattern)) {
                        total++;
                    }
                }
            }
        }

        return total;
    }

    const grid: Grid = data1
        .split('\n')
        .map(line => line.split('')
            .map(letter => letter as Letter));

    const grid2: Grid = data2
        .split('\n')
        .map(line => line.split('')
            .map(letter => letter as Letter));

    console.clear();
    console.log(
        totalXmases(grid),
        totalXDashMases(grid2)
    )
}
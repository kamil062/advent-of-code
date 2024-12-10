{
    let data = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

    type Cell = {
        x: number,
        y: number,
        value: number,
        visited: boolean
    }
    type Map = Cell[][];

    const map: Map = data.split("\n").map((row, y) => {
        return row.split('').map((cell, x) => ({
            x, y,
            value: +cell,
            visited: false
        } as Cell))
    });

    const get = (map: Map, x: number, y: number) => map[y]?.[x];

    const findTrails = (map: Map, x: number, y: number, distinct: boolean = true): number | number[] => {
        const currentCell = get(map, x, y);
        currentCell.visited = true;

        if (currentCell.value == 9) return 1;

        const possibleNextPositions = [
            get(map, x - 1, y),
            get(map, x + 1, y),
            get(map, x, y - 1),
            get(map, x, y + 1)
        ]
            .filter(cell => cell != null && cell.value - currentCell.value == 1)
            .filter(cell => distinct ? true : !cell.visited)

        if (possibleNextPositions.length == 0) return 0;

        return possibleNextPositions.map(nextPosition => {
            return findTrails(map, nextPosition.x, nextPosition.y, distinct);
        }).flat()
    }

    const findScore = (map: Map, distinct: boolean) => {
        return map.map(row => {
            return row.map(cell => {
                if (cell.value == 0) {
                    const result = findTrails(structuredClone(map), cell.x, cell.y, distinct);
                    if (Array.isArray(result)) {
                        return result.flat().reduce((a, b) => a + b)
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            })
        }).flat().reduce((a, b) => a + b)
    }

    console.clear();
    console.log(
        findScore(map, false),
        findScore(map, true)
    )
}
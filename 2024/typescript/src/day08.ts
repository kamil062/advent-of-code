{
    const data = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

    type Node = {
        x: number,
        y: number,
        elements: string[];
    }
    type Map = Node[][];

    const map: Map = data.split("\n")
        .map((row, y) => {
            return row.split('').map((cell, x) => {
                return {
                    x, y,
                    elements: cell == '.'
                        ? []
                        : [cell]
                }
            })
        });

    const makeAntinodes = (map: Map, n1: Node, n2: Node, repeat: boolean = false) => {
        const dX = n2.x - n1.x;
        const dY = n2.y - n1.y;

        for(let i = 1;;i++) {
            const isPushed1 = map[n1.y - dY * i]?.[n1.x - dX * i]?.elements.push('#');
            const isPushed2 = map[n2.y + dY * i]?.[n2.x + dX * i]?.elements.push('#');

            if(!repeat || (isPushed1 == null && isPushed2 == null)) break;
        }

        if(repeat) {
            map[n1.y][n1.x].elements.push('#');
            map[n2.y][n2.x].elements.push('#');
        }
    }

    const groupNodes = (map: Map): { [element: string]: Node[] } => {
        const nodes: { [element: string]: Node[] } = {}

        map.forEach(row => {
            row.forEach(node => {
                node.elements.forEach(element => {
                    const group = nodes[element];
                    if (group == null) {
                        nodes[element] = []
                    }

                    nodes[element].push(node);
                })
            })
        })

        return nodes;
    }

    const groups = groupNodes(map);

    console.clear();

    // Part 1
    const mapPart1 = structuredClone(map);
    for (let group of Object.values(groups)) {
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                makeAntinodes(
                    mapPart1,
                    mapPart1[group[i].y][group[i].x],
                    mapPart1[group[j].y][group[j].x]
                );
            }
        }
    }
    console.log(
        mapPart1.map(row => {
            return row.filter(node => node.elements.includes('#')).length
        }).reduce((a, b) => a + b)
    )

    // Part2
    const mapPart2 = structuredClone(map);
    for (let group of Object.values(groups)) {
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                makeAntinodes(
                    mapPart2,
                    mapPart1[group[i].y][group[i].x],
                    mapPart1[group[j].y][group[j].x],
                    true
                );
            }
        }
    }
    console.log(
        mapPart2.map(row => {
            return row.filter(node => node.elements.includes('#')).length
        }).reduce((a, b) => a + b)
    )
}
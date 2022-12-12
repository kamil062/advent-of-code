let input = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

type Position = { x: number, y: number };

type NodeOnMap = {
    position: Position,
    visited: boolean,
    elevation: number,
    distanceTo: number
};

const parseInput = (input: string) => {
    let startingPos: Position = { x: 0, y: 0 };
    let targetPos: Position = { x: 0, y: 0 };

    let mapOfNodes = input
        .split('\n')
        .map((row, y) => {
            return row
                .split('')
                .map((pos, x) => {
                    let elevation: number = 0;

                    if (pos == 'S') {
                        startingPos = { x, y };
                        elevation = 0;
                    } else if (pos == 'E') {
                        targetPos = { x, y };
                        elevation = 'z'.charCodeAt(0) - 'a'.charCodeAt(0);
                    } else {
                        elevation = pos.charCodeAt(0) - 'a'.charCodeAt(0)
                    }

                    return <NodeOnMap>{
                        position: { x, y },
                        visited: false,
                        elevation,
                        distanceTo: Infinity
                    };
                });
        });

    return {
        startingPos,
        targetPos,
        mapOfNodes
    }
}

const unvisitedNodes = (nodes: NodeOnMap[]) => {
    return nodes
        .filter(node => !node.visited);
}

const nodeAtPos = (map: NodeOnMap[][], position: Position) => {
    return map[position.y]?.[position.x];
}

const nodeWithSmallestDistance = (map: NodeOnMap[]) => {
    return unvisitedNodes(map)
        .reduce((nodeA, nodeB) => (nodeA.distanceTo < nodeB.distanceTo) ? nodeA : nodeB);
}

const canGoToPosition = (startPosition: Position, targetPosition: Position, map: NodeOnMap[][]) => {
    let currentNode = nodeAtPos(mapOfNodes, startPosition);
    let targetNode = nodeAtPos(mapOfNodes, targetPosition);

    return ((targetNode.elevation - currentNode.elevation) <= 1)
}

const unvisitedNeighbours = (currentNode: NodeOnMap, map: NodeOnMap[][]) => {
    let position = currentNode.position;

    let leftNeighbour: NodeOnMap = nodeAtPos(map, { x: position.x - 1, y: position.y });
    let rightNeighbour: NodeOnMap = nodeAtPos(map, { x: position.x + 1, y: position.y });
    let upNeighbour: NodeOnMap = nodeAtPos(map, { x: position.x, y: position.y - 1 });
    let downNeighbour: NodeOnMap = nodeAtPos(map, { x: position.x, y: position.y + 1 });

    let [w, h] = [map[0].length, map.length];

    return [
        leftNeighbour,
        rightNeighbour,
        upNeighbour,
        downNeighbour
    ].filter(node => {
        let pos = node?.position;

        return node != null
            && !node.visited
            && pos.x >= 0 && pos.x < w && pos.y >= 0 && pos.y < h
            && canGoToPosition(currentNode.position, node.position, map)
    });
}

const resetMapOfNodes = (map: NodeOnMap[][]) => {
    for (let row of map) {
        for (let cell of row) {
            cell.visited = false;
            cell.distanceTo = Infinity;
        }
    }
}

const dijkstrasAlgorithm = (mapOfNodes: NodeOnMap[][], startingPos: Position, targetPos: Position) => {
    let startingNode = nodeAtPos(mapOfNodes, startingPos);
    let targetNode = nodeAtPos(mapOfNodes, targetPos);
    let currentNode: NodeOnMap = startingNode;
    let unvisitedNodes = mapOfNodes.flat();

    startingNode.distanceTo = 0;

    let it = 0;

    for (; ;) {
        let neighbours = unvisitedNeighbours(currentNode, mapOfNodes);

        for (let node of neighbours) {
            let distanceTo = currentNode.distanceTo + 1;
            if (distanceTo < node.distanceTo) {
                node.distanceTo = distanceTo;
            }
        }

        currentNode.visited = true;

        if (targetNode.visited == true || targetNode.distanceTo < Infinity) {
            // console.log("end");
            // showMapOfNodes(mapOfNodes);
            return targetNode.distanceTo;
        }

        currentNode = nodeWithSmallestDistance(unvisitedNodes);

        if (currentNode.distanceTo == Infinity) {
            // console.error("No solution");
            return Infinity;
        }
    }
}


let { startingPos, targetPos, mapOfNodes } = parseInput(input);

// part 1
console.clear();
console.log(
    dijkstrasAlgorithm(mapOfNodes, startingPos, targetPos)
);

// part 2
let lowestPositions = mapOfNodes
    .flat()
    .filter(node => node.elevation == 0);

let shortestPath = lowestPositions
    .map((node, i) => {
        console.log(`${i + 1} / ${lowestPositions.length}`)
        resetMapOfNodes(mapOfNodes);
        return dijkstrasAlgorithm(mapOfNodes, node.position, targetPos)
    })
    .reduce((a, b) => Math.min(a, b))

console.log(
    shortestPath
);

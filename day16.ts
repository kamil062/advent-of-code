let input = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

export { }

type Valve = {
    name: string,
    flowRate: number,
    nextValves: string[],
    opened: boolean,
    intermediate?: boolean
};

type Node = {
    valve: Valve,
    visited: boolean,
    distance: number,
    previousNode: Node | null
}

type ShortestPath = { path: Valve[], totalPressure: number, time: number };

const parseInput = (input: string) => {
    let valves: Valve[] = [];

    for (let line of input.split("\n")) {
        line = line.replace("Valve ", "");

        let name = line.substring(0, 2);
        let flowRate = parseInt(line.split(";")[0].split("=")[1])
        let nextValves = line.split("valves ")[1]?.split(', ') ?? [line.split("valve ")[1]];

        valves.push({
            name,
            flowRate,
            nextValves,
            opened: false
        })
    }

    return valves;
}

const dijkstrasAlgorithm = (valves: Valve[], from: Valve, to: Valve): Valve[] => {
    let unvisitedNodes: Node[] = valves.map(valve => {
        return {
            valve,
            visited: false,
            distance: valve.name == from.name ? 0 : Infinity,
            previousNode: null
        }
    });

    let destinationNode = unvisitedNodes.find(node => node.valve.name == to.name) as NonNullable<Node>;

    let currentNode = unvisitedNodes.find(node => node.valve.name == from.name) as NonNullable<Node>;

    while (true) {
        let unvisitedNeighbours = unvisitedNodes.filter(node => currentNode.valve.nextValves.includes(node.valve.name));

        for (let neighbour of unvisitedNeighbours) {
            let distance = currentNode.distance + 1;
            if (distance < neighbour.distance) {
                neighbour.distance = distance;
                neighbour.previousNode = currentNode;
            }
        }

        currentNode.visited = true;
        unvisitedNodes = unvisitedNodes.filter(node => node.valve.name != currentNode.valve.name);

        if (destinationNode.visited) {
            let path: Valve[] = [destinationNode.valve];
            let currentNode = destinationNode;

            while (true) {
                if (currentNode.previousNode != null) {
                    path.unshift(currentNode.previousNode.valve);
                    currentNode = currentNode.previousNode;
                } else {
                    break;
                }
            }

            return path;
        }

        let smallestUnvisitedNode = unvisitedNodes.reduce((nodeA, nodeB) => nodeA.distance < nodeB.distance ? nodeA : nodeB);

        if (smallestUnvisitedNode.distance == Infinity) {
            return [];
        }

        currentNode = smallestUnvisitedNode;
    }
}

const simulatePath = (path: Valve[], combinations: Map<string, Valve[]>, max: number, limit: number, log: boolean = false) => {
    let pressure = 0;
    let flowRate = 0;
    let time = 1;
    let finishedAt = null;
    let pressureAt30 = 0;

    let currentNodeIndex = 0;

    const logMinute = () => {
        if (log) console.log(`\n== Minute ${time} ==`);

        if (flowRate > 0) {
            if (log) console.log(`Releasing ${flowRate} pressure`);
            pressure += flowRate;
            if (time == limit) pressureAt30 = pressure;
        }
    }

    const moveToValve = () => {
        let previousNode = path[currentNodeIndex - 1];
        let currentNode = path[currentNodeIndex];

        if (previousNode && currentNode) {
            let name = `${previousNode.name}-${currentNode.name}`;
            let route = combinations.get(name)?.slice(1);

            if (route) {
                for (let routeValve of route) {
                    if (time <= max) {
                        logMinute();

                        if (log) console.log(`Move to valve ${routeValve.name}`);
                        time++;
                    }
                }
            }
        }
    }

    const openValve = () => {
        let currentNode = path[currentNodeIndex];

        if (currentNode) {
            logMinute();

            if (time <= max) {
                if (log) console.log(`Open valve ${currentNode.name}`);
                time++;
                flowRate += currentNode.flowRate;
            }
        }
    }

    for (time = 1; time <= max; currentNodeIndex++) {
        let currentNode = path[currentNodeIndex];

        // Skip first node which should be AA
        if (currentNode && currentNode.flowRate <= 0) {
            continue;
        }

        moveToValve();
        openValve();

        if (time > max) break;

        if (!currentNode) {
            finishedAt = finishedAt == null ? time : finishedAt;
            logMinute();
            time++
        }
    }

    return {
        pressure,
        pps: flowRate,
        time: time - 1,
        finishedAt: finishedAt ?? (time - 1),
        pressureAt30
    };
}

const findShortestPath = (path: Valve[], combinations: Map<string, Valve[]>, howLong: number = 30, level: number = 0, shortestPath: ShortestPath, except?: string[], roads: Valve[][] = []) => {
    let lastNode = path[path.length - 1];

    let nextOptions = [...combinations.keys()]
        .filter(option => option.startsWith(lastNode.name));

    for (let option of nextOptions) {
        let combination = combinations.get(option) as NonNullable<Valve[]>;
        let lastElement = combination[combination.length - 1];

        if (!path.includes(lastElement)) {
            let nextPath = path.concat(combination[combination.length - 1]);
            let simulation = simulatePath(nextPath, combinations, 100, howLong);

            if ((simulation.finishedAt ?? 0) >= howLong && simulation.pressureAt30 <= shortestPath.totalPressure) {
                continue;
            }

            let overlaps = except == null
                ? []
                : nextPath.map(p => p.name).slice(1).filter(n => except.slice(1).includes(n))

            if (roads != null)
                roads.push(nextPath);

            if (simulation.pressureAt30 > shortestPath.totalPressure && overlaps.length == 0) {
                shortestPath.totalPressure = simulation.pressureAt30;
                shortestPath.path = nextPath;
                shortestPath.time = simulation.time;
            }

            findShortestPath(nextPath, combinations, howLong, level + 1, shortestPath, except, roads);
        }
    }

    return shortestPath;
}

{
    console.clear();

    let valves: Valve[] = parseInput(input);

    let AA: Valve = valves.find(valve => valve.name == "AA") as NonNullable<Valve>;

    let valvesWithPositiveFlowrate = valves.filter(valve => valve.flowRate > 0).concat(AA);
    let names = valvesWithPositiveFlowrate.map(valve => valve.name);

    let combinations: Map<string, Valve[]> = new Map();

    for (let i = 0; i < valvesWithPositiveFlowrate.length; i++) {
        for (let j = 0; j < valvesWithPositiveFlowrate.length; j++) {
            let name = `${names[i]}-${names[j]}`;

            if (i != j && !combinations.has(name)) {
                let from: Valve = valves.find(valve => valve.name == names[i]) as NonNullable<Valve>;
                let to: Valve = valves.find(valve => valve.name == names[j]) as NonNullable<Valve>;

                let path = dijkstrasAlgorithm(valves, from, to);
                combinations.set(name, path);

                // console.log(`Calculated path from ${names[i]} to ${names[j]}: ${path.map(valve => valve.name)}`);
            }
        }
    }

    let shortestPath = findShortestPath([AA], combinations, 30, 0, { path: [], totalPressure: 0, time: 0 });
    console.log(
        "part1",
        simulatePath(shortestPath.path, combinations, 30, 30, false).pressure,
    )

    // Part 2
    let roads: Valve[][] = [];
    findShortestPath([AA], combinations, 26, 0, { path: [], totalPressure: 0, time: 0 }, undefined, roads);

    let sorted = roads
        .map(road => {
            return {
                path: road,
                simulation: simulatePath(road, combinations, 100, 26)
            }
        })
        .sort((a, b) => b.simulation.pressureAt30 - a.simulation.pressureAt30);


    let max: { paths: any[], total: number } = {
        paths: [],
        total: 0
    }

    topLoop:
    for (let i = 0; i < sorted.length; i++) {
        for (let j = 0; j < sorted.length; j++) {
            if (i != j) {
                let pathA = sorted[i].path;
                let pathB = sorted[j].path;

                let isOverlapping = pathA
                    .map(p => p.name)
                    .slice(1)
                    .filter(n => {
                        return pathB.
                            map(p => p.name)
                            .slice(1)
                            .includes(n)
                    }).length != 0;

                if (!isOverlapping) {
                    let sum = sorted[i].simulation.pressureAt30 + sorted[j].simulation.pressureAt30;

                    // https://www.reddit.com/r/adventofcode/comments/zn6k1l/comment/j0gqhgs/?utm_source=share&utm_medium=web2x&context=3
                    if(sum < max.total / 2) break topLoop;

                    if (sum > max.total) {
                        max.paths = [
                            sorted[i],
                            sorted[j],
                        ];
                        max.total = sum;
                    }
                }
            }
        }
    }

    console.log(
        "part2",
        max.total
    )
}
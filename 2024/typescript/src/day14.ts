{
    let data = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

    const areaSize = {
        w: 101,
        h: 103
    };

    type Robot = {
        x: number;
        y: number;
        vx: number;
        vy: number;
    }

    const robots: Robot[] = data.split("\n").map(row => {
        const [x, y, vx, vy] = row.split(" ")
            .map(e => e.split("=")[1])
            .map(e => e.split(","))
            .flat()
            .map(e => +e);

        return {
            x, y, vx, vy
        } as Robot;
    });

    const drawRobots = (robots: Robot[]) => {
        const area = Array(areaSize.h).fill(null)
            .map(() => new Array(areaSize.w).fill(' '));

        for (let robot of robots) {
            area[robot.y][robot.x] = '*';
        }

        console.log(
            area.map(row => row.join('')).join('\n') + "\n",
        )
    }

    const simulate = (robots: Robot[], steps: number) => {
        for (let step = 0; step < steps; step++) {
            for (let robot of robots) {
                robot.x = (robot.x + areaSize.w + robot.vx) % areaSize.w;
                robot.y = (robot.y + areaSize.h + robot.vy) % areaSize.h;
            }
        }
    }

    const calculateSafetyFactor = (robots: Robot[]) => {
        const quadrantSize = {
            w: Math.floor(areaSize.w / 2),
            h: Math.floor(areaSize.h / 2)
        }

        const quadrants: number[] = [
            0, // top left
            0, // top right
            0, // bottom left
            0  // bottom right
        ];

        for (let robot of robots) {
            if (robot.x < quadrantSize.w) {
                if (robot.y < quadrantSize.h) {
                    quadrants[0]++; // top left
                }
                if (robot.y > quadrantSize.h) {
                    quadrants[2]++; // bottom left
                }
            }
            if (robot.x > quadrantSize.w) {
                if (robot.y < quadrantSize.h) {
                    quadrants[1]++; // top right
                }
                if (robot.y > quadrantSize.h) {
                    quadrants[3]++; // bottom right
                }
            }
        }

        console.log(quadrants);

        return quadrants.reduce((a, b) => a * b, 1);
    }

    const calculateAvgDistanceFromCenter = (robots: Robot[]) => {
        const center = {
            x: areaSize.w / 2,
            y: areaSize.h / 2
        };

        const d = (x1: number, y1: number, x2: number, y2: number) =>
            Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

        return robots
            .map(robot => d(center.x, center.y, robot.x, robot.y))
            .reduce((a, b) => a + b, 0) / robots.length;
    }

    let seconds = 0;
    let minDistance = Infinity;
    let safetyFactorAtHundreed = 0;
    while (true) {
        const distance = calculateAvgDistanceFromCenter(robots);
        if (distance < minDistance) {
            console.clear();
            drawRobots(robots);
            console.log(safetyFactorAtHundreed, seconds)
            minDistance = distance;
        }
        simulate(robots, 1);
        seconds++;

        if (seconds == 100) {
            safetyFactorAtHundreed = calculateSafetyFactor(robots);
        }
    }
}
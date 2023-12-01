export { };

let input = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

class AABB {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    public w: number = 1;
    public h: number = 1;
    public l: number = 1;

    public walls: AABB[] = [];

    constructor(x: number, y: number, z: number, w: number = 1, h: number = 1, l: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.w = w;
        this.h = h;
        this.l = l;

        if (w > 0 && h > 0 && l > 0) {
            let leftWall = new AABB(x, y, z, 0, 1, 1);
            let rightWall = new AABB(x + w, y, z, 0, 1, 1);

            let topWall = new AABB(x, y + h, z, 1, 0, 1);
            let bottomWall = new AABB(x, y, z, 1, 0, 1);

            let frontWall = new AABB(x, y, z, 1, 1, 0);
            let backWall = new AABB(x, y, z + l, 1, 1, 0);

            this.walls = [
                leftWall, rightWall,
                topWall, bottomWall,
                frontWall, backWall
            ];
        }
    }

    public get minX(): number { return this.x; }
    public get maxX(): number { return this.x + this.w; }

    public get minY(): number { return this.y; }
    public get maxY(): number { return this.y + this.h; }

    public get minZ(): number { return this.z; }
    public get maxZ(): number { return this.z + this.l; }

    public translate(x: number, y: number, z: number) {
        return new AABB(this.x + x, this.y + y, this.z + z);
    }

    public equalCoordinates(box: AABB) {
        return this.x == box.x && this.y == box.y && this.z == box.z;
    }

    public equalSizes(box: AABB) {
        return this.w == box.w && this.h == box.h && this.l == box.l
    }

    public equals(box: AABB, withSize: boolean = false) {
        return this.equalCoordinates(box) && (withSize ? this.equalSizes(box) : true);
    }

    public visibleSides(boxes: AABB[]) {
        let visibleSides = 0;

        let anyOnLeft = boxes.find(b => b.maxX == this.minX && b.y == this.y && b.z == this.z) != null;
        let anyOnRight = boxes.find(b => b.minX == this.maxX && b.y == this.y && b.z == this.z) != null;
        let anyOnTop = boxes.find(b => b.maxY == this.minY && b.x == this.x && b.z == this.z) != null;
        let anyOnBottom = boxes.find(b => b.minY == this.maxY && b.x == this.x && b.z == this.z) != null;
        let anyOnFront = boxes.find(b => b.maxZ == this.minZ && b.y == this.y && b.x == this.x) != null;
        let anyOnBack = boxes.find(b => b.minZ == this.maxZ && b.y == this.y && b.x == this.x) != null;

        if (!anyOnLeft) visibleSides++
        if (!anyOnRight) visibleSides++
        if (!anyOnTop) visibleSides++
        if (!anyOnBottom) visibleSides++
        if (!anyOnFront) visibleSides++
        if (!anyOnBack) visibleSides++

        return visibleSides;
    }
}

const parseInput = (input: string) => {
    return input
        .split('\n')
        .map(line => {
            let [x, y, z] = line.split(',').map(e => parseInt(e));

            return new AABB(x, y, z);
        })
}

const surfaceArea = (cubes: AABB[], testAgainst: AABB[]) => {
    return cubes.reduce((total, cubeB) => total + cubeB.visibleSides(testAgainst), 0);
}

const floodfill = (cube: AABB, cubes: AABB[]) => {
    let result: AABB[] = [];
    let Q = [cube];

    let minX = cubes.reduce((a, b) => Math.min(a, b.minX), Infinity) - 2;
    let maxX = cubes.reduce((a, b) => Math.max(a, b.maxX), -Infinity) + 2;
    let minY = cubes.reduce((a, b) => Math.min(a, b.minY), Infinity) - 2;
    let maxY = cubes.reduce((a, b) => Math.max(a, b.maxY), -Infinity) + 2;
    let minZ = cubes.reduce((a, b) => Math.min(a, b.minZ), Infinity) - 2;
    let maxZ = cubes.reduce((a, b) => Math.max(a, b.maxZ), -Infinity) + 2;
    
    while (Q.length > 0) {
        let n = Q.shift() as NonNullable<AABB>;

        if (
            !cubes.some(c => c.equals(n)) &&
            !result.some(r => r.equals(n))
            && n.minX >= minX && n.maxX <= maxX
            && n.minY >= minY && n.maxY <= maxY
            && n.minZ >= minZ && n.maxZ <= maxZ
        ) {
            result.push(n);

            let next = [
                n.translate(1, 0, 0),
                n.translate(-1, 0, 0),
                n.translate(0, 1, 0),
                n.translate(0, -1, 0),
                n.translate(0, 0, 1),
                n.translate(0, 0, -1),
            ];

            Q.push(...next);
        }
    }

    return result;
}

{
    let cubes = parseInput(input);

    {
        let start = Date.now();
        console.log("part1", surfaceArea(cubes, cubes));
        console.log(Date.now() - start, "ms");
    }

    {
        let start = Date.now();

        let minX = cubes.reduce((a, b) => Math.min(a, b.minX), Infinity) - 2;
        let minY = cubes.reduce((a, b) => Math.min(a, b.minY), Infinity) - 2;
        let minZ = cubes.reduce((a, b) => Math.min(a, b.minZ), Infinity) - 2;

        let result = floodfill(new AABB(minX, minY, minZ), cubes);

        let walls = cubes
            .map(c => c.walls)
            .reduce((a, b) => a.concat(b));

        console.log(
            "part2", result
                .map(r => r.walls)
                .reduce((a, b) => a.concat(b), [])
                .filter(cube => walls.some(w => w.equals(cube, true)))
                .length
        );

        console.log(Date.now() - start, "ms");
    }
}
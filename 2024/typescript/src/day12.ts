{

    const data = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

    console.clear();

    type Plot = {
        x: number;
        y: number;
        value: string;
        visited: boolean;
        perimeter: number;
    }

    const map = data.split('\n').map((row, y) => {
        return row.split('').map((cell, x) => {
            return {
                x, y,
                value: cell,
                visited: false
            } as Plot;
        })
    });

    const findNeighbouringPlots = (map: Plot[][], x: number, y: number): Plot[] => {
        const plot = map[y][x];

        if (plot.visited) return [];

        plot.visited = true;

        const neighbours = [
            map[y]?.[x + 1],
            map[y]?.[x - 1],
            map[y + 1]?.[x],
            map[y - 1]?.[x]
        ].filter(neighbour => plot.value == neighbour?.value);

        plot.perimeter = 4 - neighbours.length;

        return [
            plot,
            ...neighbours.map((neighbour: Plot) => {
                return findNeighbouringPlots(map, neighbour.x, neighbour.y);
            }).flat()
        ];
    }

    const findRegions = (map: Plot[][]): Plot[][] => {
        const regions: Plot[][] = [];
        const flatMap = map.flat();

        for (let i = 0; i < flatMap.length; i++) {
            const plot = flatMap[i];

            if (plot.visited) continue;

            const region = findNeighbouringPlots(map, plot.x, plot.y);
            regions.push(region);
        }

        return regions;
    }

    const regionContains = (region: Plot[], x: number, y: number, value: string) => {
        return region
            .filter(plot => plot.value == value && plot.x == x && plot.y == y)
            .length > 0;
    }

    const calculatePrice = (regions: Plot[][], method: 'perimeter' | 'corners'): number => {
        return regions.reduce((total, region) => {
            const regionArea = region.length;
            const regionPerimeter = region.reduce((total, plot) => total + plot.perimeter, 0);

            if (method == 'perimeter')
                return total + regionArea * regionPerimeter;

            const regionCorners = region.reduce((total, plot) => {
                const hasNeighbourAbove = regionContains(region, plot.x, plot.y - 1, plot.value);
                const hasNeighbourBelow = regionContains(region, plot.x, plot.y + 1, plot.value);
                const hasNeighbourLeft = regionContains(region, plot.x - 1, plot.y, plot.value);
                const hasNeighbourRight = regionContains(region, plot.x + 1, plot.y, plot.value);

                const hasNeighbourBelowLeft = regionContains(region, plot.x - 1, plot.y + 1, plot.value);
                const hasNeighbourBelowRight = regionContains(region, plot.x + 1, plot.y + 1, plot.value);
                const hasNeighbourAboveLeft = regionContains(region, plot.x - 1, plot.y - 1, plot.value);
                const hasNeighbourAboveRight = regionContains(region, plot.x + 1, plot.y - 1, plot.value);

                let corners = 0;

                if (!hasNeighbourAbove && !hasNeighbourLeft) corners++; // Top left convex corner
                if (!hasNeighbourAbove && !hasNeighbourRight) corners++; // Top right convex corner
                if (!hasNeighbourBelow && !hasNeighbourLeft) corners++; // Bottom left convex corner
                if (!hasNeighbourBelow && !hasNeighbourRight) corners++; // Bottom right convex corner

                if (!hasNeighbourBelowLeft && hasNeighbourLeft && hasNeighbourBelow) corners++; // Bottom left concava corner
                if (!hasNeighbourBelowRight && hasNeighbourRight && hasNeighbourBelow) corners++; // Bottom right concave corner
                if (!hasNeighbourAboveRight && hasNeighbourRight && hasNeighbourAbove) corners++; // Top Right concave corner
                if (!hasNeighbourAboveLeft && hasNeighbourLeft && hasNeighbourAbove) corners++; // Top left concave corner

                return total + corners;
            }, 0);

            return total + regionArea * regionCorners;
        }, 0)
    }

    const regions = findRegions(map);

    console.log(
        calculatePrice(regions, 'perimeter'),
        calculatePrice(regions, 'corners')
    )
}
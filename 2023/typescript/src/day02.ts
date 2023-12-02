{
    const input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
    Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
    Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
    Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

    console.clear();

    const result = input.split("\n").map(line => {
        line = line.trim();

        const gameNumber = parseInt(line.split(':')[0].split(" ")[1])

        const { maxRed, maxGreen, maxBlue } = line.split(':')[1].split(';').map(set => {
            const setInGame: { [color: string]: number } = { blue: 0, green: 0, red: 0 };

            set.split(',').forEach(cubes => {
                const [number, color] = cubes.trim().split(' ');
                setInGame[color] = parseInt(number);
            })

            return setInGame
        }).reduce((prev, curr) => {
            return {
                maxRed: Math.max(prev.maxRed, curr.red),
                maxGreen: Math.max(prev.maxGreen, curr.green),
                maxBlue: Math.max(prev.maxBlue, curr.blue)
            }
        }, { maxRed: 0, maxGreen: 0, maxBlue: 0 })

        return {
            gameIndex: (maxRed <= 12 && maxGreen <= 13 && maxBlue <= 14) ? gameNumber : 0,
            gamePower: maxRed * maxGreen * maxBlue
        }
    });

    console.log({
        part1: result.reduce((prev, curr) => prev + curr.gameIndex, 0),
        part2: result.reduce((prev, curr) => prev + curr.gamePower, 0)
    });
}
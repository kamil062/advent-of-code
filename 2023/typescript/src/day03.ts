{
  const input = `467..114..
  ...*......
  ..35..633.
  ......#...
  617*......
  .....+.58.
  ..592.....
  ......755.
  ...$.*....
  .664.598..`;

  console.clear();

  const lines = input.split("\n").map((line) => line.trim());
  const correctNumbers: number[] = [];
  const symbols = "*#$&=+-%@/";

  const gears: Map<string, number[]> = new Map();

  lines.forEach((line, lineIndex) => {
    const regex = /(\d+)/g;
    const matches = line.matchAll(regex);

    for (let match of matches) {
      const num = match[0];
      const index = match.index || 0;

      let isNumberAdjacentToAnySymbol = false;

      const startX = Math.max(index - 1, 0);
      const endX = Math.min(index + num.length, line.length - 1);
      const startY = Math.max(lineIndex - 1, 0);
      const endY = Math.min(lineIndex + 1, lines.length - 1);

      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          const char = lines[y][x];

          if (symbols.includes(char)) {
            isNumberAdjacentToAnySymbol = true;

            if (char == "*") {
              gears.set(
                `${x},${y}`,
                (gears.get(`${x},${y}`) ?? []).concat(parseInt(num))
              );
            }
          }
        }
      }

      if (isNumberAdjacentToAnySymbol) {
        correctNumbers.push(parseInt(num));
      }
    }
  });

  console.log({
    part1: correctNumbers.reduce((a, b) => a + b),
    part2: Array.from(gears.values())
      .filter((parts) => parts.length > 1)
      .reduce((a, b) => a + b.reduce((c, d) => c * d), 0),
  });
}

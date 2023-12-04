{
  const input = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
  Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
  Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
  Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
  Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

  console.clear();

  const originalCards: Map<number, number> = new Map();
  const cardCopies: Map<number, number> = new Map();

  // Part 1
  input.split("\n").forEach((line, index) => {
    const [numbers, myNumbers] = line
      .split(": ")[1]
      .split(" | ")
      .map((x) =>
        x
          .split(" ")
          .filter((e) => e.trim().length)
          .map((e) => parseInt(e))
      );

    const overlap = myNumbers.filter((e) => numbers.includes(e));

    originalCards.set(index, overlap.length);
    cardCopies.set(index, 1);
  });

  console.log(
    `part1: ${Array.from(originalCards.values()).reduce(
      (a, b) => a + Math.floor(2 ** (b - 1)), 0
    )}`
  );

  // Part 2
  for (let i = 0; i < originalCards.size; i++) {
    const matchingNumbers = originalCards.get(i) ?? 0;
    const multiplier = cardCopies.get(i) ?? 1;

    for (let j = i + 1; j <= i + matchingNumbers; j++) {
      cardCopies.set(j, (cardCopies.get(j) ?? 0) + multiplier);
    }
  }

  console.log(
    `part2: ${Array.from(cardCopies.values()).reduce((a, b) => a + b)}`
  );
}

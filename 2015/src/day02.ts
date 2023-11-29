{
  console.clear();

  const input = `2x3x4
  1x1x10`;

  const findDimensions = (l: number, w: number, h: number) => {
    return 2 * l * w + 2 * w * h + 2 * h * l;
  };

  const smallestSideArea = (l: number, w: number, h: number) => {
    return Math.min(l * w, w * h, h * l);
  };

  const smallestPerimeter = (l: number, w: number, h: number) => {
    return Math.min(2 * l + 2 * w, 2 * w + 2 * h, 2 * h + 2 * l);
  };

  // Part1
  let result = input
    .split("\n")
    .map((line) => {
      const dimensions: [number, number, number] = line
        .split("x")
        .map((dim) => parseInt(dim)) as [number, number, number];

      return findDimensions(...dimensions) + smallestSideArea(...dimensions);
    })
    .reduce((a, b) => a + b);

  console.log(result);

  // Part2

  result = input
    .split("\n")
    .map((line) => {
      const dimensions: [number, number, number] = line
        .split("x")
        .map((dim) => parseInt(dim)) as [number, number, number];

      return (
        smallestPerimeter(...dimensions) + dimensions.reduce((a, b) => a * b, 1)
      );
    })
    .reduce((a, b) => a + b);

  console.log(result);
}

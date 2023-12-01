{
  console.clear();

  const input = `two1nine
  eightwothree
  abcone2threexyz
  xtwone3four
  4nineeightseven2
  zoneight234
  7pqrstsixteen`;

  const part1 = input
    .split("\n")
    .map((line) => {
      const regex = /[\d]/g;
      const found = line.match(regex) || [0];

      return parseInt(`${found[0]}${found[found.length - 1]}`);
    })
    .reduce((a, b) => a + b);

    const part2 = input.split("\n")
        .map((line) => {
          var mapObj: { [key: string]: string } = {
            one: "one1one",
            two: "two2two",
            three: "three3three",
            four: "four4four",
            five: "five5five",
            six: "six6six",
            seven: "seven7seven",
            eight: "eight8eight",
            nine: "nine9nine",
          };
    
            for(let key in mapObj) {
                line = line.replaceAll(key, mapObj[key])
            }
    
    
          const regex = /[\d]/g;
          const found = line.match(regex) || [0];
    
          return parseInt(`${found[0]}${found[found.length - 1]}`)
        }).reduce((a, b) => a + b)

  console.log({
    part1,
    part2,
  });
}

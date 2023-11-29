const input = `qjhvhtzxzqqjkmpb
xxyxx
uurcxstgmygtbstg
ieodomkazucvgmuy`;

console.clear();

// Part 1
{
  const isNiceString = (line: string) => {
    const alphabet = `abcdefghijklmnopqrstuvwxyz`;
    const disallowedStrings = ["ab", "cd", "pq", "xy"];

    const vowels = line
      .split("")
      .filter((letter) => "aeiou".indexOf(letter) != -1).length;
    const anyDoubleLetters = alphabet
      .split("")
      .some((letter) => line.indexOf(letter + letter) != -1);
    const anyDisallowed = disallowedStrings.some(
      (string) => line.indexOf(string) != -1
    );

    return vowels >= 3 && anyDoubleLetters && !anyDisallowed;
  };

  console.log(input.split("\n").filter((line) => isNiceString(line)).length);
}

// Part 2
{
  const isNiceString = (line: string) => {
    let anyDoubleLetterRepeat = false;
    let anyLetterInsideSameLetters = false;

    for (let i = 0; i < line.length; i++) {
      const letters = line.slice(i, i + 2);
      const nextOccurence = line.indexOf(letters, i + 2);

      if (letters.length == 2 && nextOccurence != -1) {
        anyDoubleLetterRepeat = true;
      }

      const prevLetter = line[i - 1];
      const nextLetter = line[i + 1];

      if(prevLetter == nextLetter) {
        anyLetterInsideSameLetters = true;
      }
    }

    return anyDoubleLetterRepeat && anyLetterInsideSameLetters
  };

  console.log(input.split("\n").filter((line) => isNiceString(line)).length);
}

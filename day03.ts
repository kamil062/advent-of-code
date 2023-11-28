export {};

let input = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`

const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const intersection = (setsA: Set<string>, setB: Set<string>): Set<string> => {
    return new Set([...setsA].filter(c => setB.has(c)));
}

const task1 = (line: string) => {
    let part1 = new Set(line.substring(0, line.length / 2).split(''));
    let part2 = new Set(line.substring(line.length / 2, line.length).split(''));

    let commonCharacter = [...intersection(part1, part2)][0];

    return characters.indexOf(commonCharacter) + 1;
};

const task2 = (line1: string, line2: string, line3: string) => {
    let items1 = new Set(line1.split(''));
    let items2 = new Set(line2.split(''));
    let items3 = new Set(line3.split(''));

    let commonCharacter = [...intersection(intersection(items1, items2), items3)][0];

    return characters.indexOf(commonCharacter) + 1;
}

let task1Data = input.split('\n');

console.clear();
console.log(
    task1Data.map(e => task1(e)).reduce((a, b) => a + b, 0)
)

let task2Data = [];

while(task1Data.length > 0) {
    task2Data.push(task1Data.splice(0, 3));
}

console.log(
    task2Data.map(e => task2(e[0], e[1], e[2])).reduce((a, b) => a + b, 0)
)



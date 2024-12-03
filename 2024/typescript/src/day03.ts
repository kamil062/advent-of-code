import * as fs from 'fs';

{
    const data1 = fs.readFileSync('src/day0301.txt', 'utf8');
    const data2 = fs.readFileSync('src/day0302.txt', 'utf8');

    console.clear();

    let part1 = Array.from(data1.matchAll(/(?:don't\(\))|(?:do\(\))|(?:mul\((\d+),(\d+)\))/g))
            .map(match => {
                return Number(match.at(1)) * Number(match.at(2))
            })
            .reduce((a, b) => a + b);

    console.log(part1);

    let mulEnabled = true;
    let part2 = Array.from(data2.matchAll(/(?:don't\(\))|(?:do\(\))|(?:mul\((\d+),(\d+)\))/g))
            .map(match => {
                const instruction: string = match.at(0) || '';

                if(
                    (instruction == "do()" && mulEnabled === false) ||
                    (instruction == "don't()" && mulEnabled === true)
                ) {
                    mulEnabled = !mulEnabled;
                    return 0;
                }

                return mulEnabled && instruction.startsWith('mul')
                    ? Number(match.at(1)) * Number(match.at(2))
                    : 0;
            })
            .reduce((a, b) => a + b);
            
    console.log(part2);
}
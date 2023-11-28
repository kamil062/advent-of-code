export {};

let input = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const data: string[] = input.split('\n\n');
const stack: string[] = data[0].split('\n').slice(0, -1);
const instructions: string[] = data[1].split('\n');

const stacksNum = Math.ceil(stack[0].length / 4);

const tasks = (instructions: string[], stack: string[], reverse: boolean) => {
    let _stack: string[][] = [];

    for (let i = 0; i < stacksNum; i++) {
        let index = (i + 1) + (i * 3);
        _stack.push(stack.map(line => line[index]).filter(e => e.trim().length))
    };

    for(let instruction of instructions) {
        let parts = instruction.split(' ');

        let elements = parseInt(parts[1]);
        let from = parseInt(parts[3]) - 1;
        let to = parseInt(parts[5]) - 1;

        let removed = _stack[from].splice(0, elements);
        if(reverse) removed.reverse();
        _stack[to] = removed.concat(_stack[to]);
    }

    return _stack.map(e => e[0]).join('');
}

console.clear();
console.log(
    tasks(instructions, stack, true), // task1
    tasks(instructions, stack, false) // task2
)

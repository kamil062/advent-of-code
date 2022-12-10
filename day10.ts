let input = `addx 2
addx 3
addx 1
noop
addx 4
addx 1
noop
addx 28
addx -24
noop
addx 5
addx 17
addx -16
noop
addx 6
noop
addx -7
addx 11
addx 4
noop
addx 1
addx -36
addx -2
noop
noop
addx 10
noop
noop
addx -2
addx 2
addx 25
addx -18
addx 23
addx -22
addx 2
addx 5
addx -10
addx -15
addx 28
addx 2
addx 5
addx 2
addx -16
addx 17
addx -36
noop
noop
addx 39
addx -32
addx -5
addx 7
addx 1
addx 5
addx -13
addx 1
addx 17
addx 1
noop
addx 7
noop
addx -2
addx 2
addx 5
addx 2
noop
noop
noop
noop
addx -37
noop
noop
noop
noop
addx 6
addx 11
addx -7
addx 29
addx -22
addx 5
noop
noop
noop
addx 3
noop
addx 7
addx -28
addx 24
addx 3
addx 2
noop
addx 2
noop
addx 3
addx -38
noop
addx 7
addx -2
addx 1
addx 6
addx -10
addx 38
addx -25
addx 5
addx 2
addx -10
addx 11
addx 2
noop
addx 3
addx 2
noop
addx 3
addx 2
addx 5
addx -39
addx 1
addx 1
addx 3
addx 2
addx 4
addx 29
addx -23
noop
addx -1
addx 5
noop
addx 11
addx -10
addx 5
addx -1
noop
addx 3
noop
addx 3
addx 4
noop
noop
noop
noop
noop`;

type Instruction = {
    name: 'noop' | 'addx',
    arg: number,
    cycles: number
}

let instructions: Instruction[] = input
    .split('\n')
    .map(line => {
        let name = line.split(" ")[0];
        let arg = parseInt(line.split(" ")[1]);
        let cycles = (name == 'noop') ? 1 : 2;

        return <Instruction>{ name, arg, cycles };
    });

let totalCycles = instructions.map(command => {
    if (command.name.startsWith("noop")) return 1;
    if (command.name.startsWith("addx")) return 2;

    return 0;
}).reduce((a: number, b: number) => a + b, 0);

console.clear();

let currentInstruction = null;
let instructionCounter = 0;
let X = 1;

let _history: { cycle: number, X: number }[] = [];

for (let clock = 1; clock <= totalCycles; clock++) {
    // Get instruction if there is none being executed right now
    if (currentInstruction == null) {
        currentInstruction = <NonNullable<Instruction>>instructions.shift();
        instructionCounter = currentInstruction.cycles;
    }

    // Decrease instruction counter
    instructionCounter -= 1;

    // Store X in history
    _history.push({
        cycle: clock,
        X
    });

    // Reset instruction
    if (instructionCounter == 0) {
        if (currentInstruction.name == 'addx') {
            X += currentInstruction.arg;
        }
        currentInstruction = null;
    }
}

let significantRecords = [
    _history.find(h => h.cycle == 20),
    _history.find(h => h.cycle == 60),
    _history.find(h => h.cycle == 100),
    _history.find(h => h.cycle == 140),
    _history.find(h => h.cycle == 180),
    _history.find(h => h.cycle == 220)
]

console.log(
    significantRecords
        .map((r: NonNullable<any>) => r.X * r.cycle)
        .reduce((a, b) => a + b)
)

// Part 2

let CRT: string[] = Array(40 * 6).fill('.');

for(let element of _history) {
    let col = ((element.cycle - 1) % 40);
    let X = element.X;

    CRT[element.cycle - 1] = (col >= X - 1 && col <= X + 1) ? '#' : '.';
}

let visualization = '\n';
for(let i = 0; i < 6; i++) {
    let row = CRT.splice(0, 40);
    
    visualization += row.join('') + '\n';
}
console.log(visualization);
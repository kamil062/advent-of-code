export {};

let input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

console.clear();
console.log(
    // task1
    input.split('\n\n').map(
        elve => elve.split('\n').reduce((a, b) => a + parseInt(b), 0)
    ).reduce((a, b) => Math.max(a, b)),
    // task2
    input.split('\n\n').map(
        elve => elve.split('\n').reduce((a, b) => a + parseInt(b), 0)
    ).sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a + b),
)

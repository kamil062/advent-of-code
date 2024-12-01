const data = `3   4
4   3
2   5
1   3
3   9
3   3`;

const lists = data
    .split("\n")
    .map(e => e.split("   "))
    .reduce((prev: number[][], curr: string[]) => {
        prev[0].push(+curr[0]);
        prev[1].push(+curr[1]);

        return prev;
    }, [[], []])
    .map(e => e.sort());

console.clear();
console.log(
    lists[0].reduce((prev, _, i) => {
        return prev + Math.abs(lists[0][i] - lists[1][i])
    }, 0)
)

console.log(
    lists[0].reduce((prev, curr) => {
        return prev + curr * lists[1].filter(e => e === curr).length;
    }, 0)
)
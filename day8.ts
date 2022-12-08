let input = `30373
25512
65332
33549
35390`;

const data = input.split('\n').map(e => e.split('').map(f => parseInt(f)));

const isVisible = (data: number[][], i: number, j: number): (0 | 1) => {
    if (i == 0 || j == 0 || j == (data.length - 1) || i == (data[0].length - 1)) return 1;

    let item = data[i][j];

    let visibleSides = 4;

    for (let col = 0; col < j; col++)
        if (col != j && data[i][col] >= item) { visibleSides--; break }

    for (let col = j; col < data[i].length; col++)
        if (col != j && data[i][col] >= item) { visibleSides--; break }

    for (let row = 0; row < i; row++)
        if (row != i && data[row][j] >= item) { visibleSides--; break }

    for (let row = i; row < data.length; row++)
        if (row != i && data[row][j] >= item) { visibleSides--; break }

    return (visibleSides > 0) ? 1 : 0;
}

const scenicScore = (data: number[][], i: number, j: number): number => {
    if (i == 0 || j == 0 || j == (data.length - 1) || i == (data[0].length - 1)) return 0;

    let item = data[i][j];
    let scores = [0, 0, 0, 0];

    for (let col = j - 1; col >= 0; col--) {
        scores[0]++;
        if (col != j && data[i][col] >= item) break;
    }

    for (let col = j + 1; col < data[i].length; col++) {
        scores[1]++;
        if (col != j && data[i][col] >= item) break;
    }

    for (let row = i - 1; row >= 0; row--) {
        scores[2]++;
        if (row != i && data[row][j] >= item) break;
    }

    for (let row = i + 1; row < data.length; row++) {
        scores[3]++;
        if (row != i && data[row][j] >= item) break;
    }

    return scores.reduce((a, b) => a * b, 1);
}

console.clear();
console.log(
    // task1
    data.map((_, i) => {
        return data[i].map((_, j) => isVisible(data, i, j)).reduce((a, b) => a + b);
    }).reduce((a, b) => a + b, 0),
    // task2
    data.map((_, i) => {
        return data[i].map((_, j) => scenicScore(data, i, j)).reduce((a, b) => Math.max(a, b));
    }).reduce((a, b) => Math.max(a, b))
)

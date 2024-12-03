{
    const data = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

    const lists = data
        .split("\n")
        .map(e => e.split(" ").map(f => +f));

    const removeItem = (numbers: number[], i: number) =>
        numbers.filter((_, j) => i != j);

    const allIncreasing = (numbers: number[]) => {
        for (let i = 0; i < numbers.length - 1; i++) {
            if (numbers[i + 1] <= numbers[i]) return false
        }
        return true;
    }

    const allDecreasing = (numbers: number[]) => {
        for (let i = 0; i < numbers.length - 1; i++) {
            if (numbers[i + 1] >= numbers[i]) return false;
        }
        return true;
    }

    const allDifferByAtMost = (numbers: number[], n: number) => {
        for (let i = 0; i < numbers.length - 1; i++) {
            if (Math.abs(numbers[i] - numbers[i + 1]) > n) return false;
        }
        return true;
    }

    const isSafe = (numbers: number[]) => {
        return (allIncreasing(numbers) || allDecreasing(numbers)) && allDifferByAtMost(numbers, 3)
    }

    const isSafe2 = (numbers: number[]) => {
        return isSafe(numbers) || Array(numbers.length)
            .fill(null)
            .map((_, i) => removeItem(numbers, i))
            .some(list => isSafe(list));
    }

    console.clear();
    console.log(
        lists.filter(list => isSafe(list)).length,
        lists.filter(list => isSafe2(list)).length
    )
}
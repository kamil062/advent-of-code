export {};

let input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const rangeToSet = (start: number, end: number): Set<number> => {
    let result: Set<number> = new Set();
    for (let i = start; i <= end; i++) {
        result.add(i);
    }

    return result;
}

const isSuperset = (superset: Set<number>, subset: Set<number>) => {
    for (let item of subset) {
        if (!superset.has(item)) return false;
    }

    return true;
}

const intersection = (setA: Set<number>, setB: Set<number>) => {
    let result: Set<number> = new Set();

    for(let item of setA) {
        if(setB.has(item)) result.add(item);
    }

    return result;
}

const task1 = (line: string): number => {
    let [range1, range2] = line.split(',').map(e => e.split('-'));

    let set1 = rangeToSet(parseInt(range1[0]), parseInt(range1[1]));
    let set2 = rangeToSet(parseInt(range2[0]), parseInt(range2[1]));

    if (isSuperset(set1, set2) || isSuperset(set2, set1)) return 1;
    else return 0;
}

const task2 = (line: string): number => {
    let [range1, range2] = line.split(',').map(e => e.split('-'));

    let set1 = rangeToSet(parseInt(range1[0]), parseInt(range1[1]));
    let set2 = rangeToSet(parseInt(range2[0]), parseInt(range2[1]));

    if(intersection(set1, set2).size > 0) return 1;
    else return 0;
}

console.clear();

console.log(
    input.split('\n').map(line => task1(line)).reduce((a, b) => a + b, 0),
    input.split('\n').map(line => task2(line)).reduce((a, b) => a + b, 0)
);

let day13Input = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

type Value = number | number[];
type Packet = Value[];
type Pair = [Packet, Packet];

const isInteger = (value: Value | Packet) => {
    return typeof (value) == 'number';
}

const isArray = (value: Value | Packet) => {
    return !isInteger(value as Value);
}

const toList = (value: Value | Packet): Value => {
    return (isInteger(value) ? [value] : value) as Value;
}

let compare = (left: Packet, right: Packet): number => {
    if (isInteger(left) && isInteger(right)) {
        if (left < right) return 1;
        if (left > right) return -1;
        return 0;
    } else if (isArray(left) && isArray(right)) {
        for (let i = 0; i < left.length; i++) {
            let leftValue = left[i];
            let rightValue = right[i];

            if (rightValue == null) {
                return -1;
            }

            let result = compare(leftValue as Packet, rightValue as Packet);
            if (result != 0) {
                return result;
            }
        }

        if (left.length != right.length) {
            return 1;
        }
    } else {
        return compare(toList(left) as Packet, toList(right) as Packet);
    }

    return 0;
}

console.clear();

// Part 1
console.log(
    day13Input.split("\n\n").map(pair => {
        return pair.split('\n').map(packet => JSON.parse(packet) as Packet) as Pair;
    }).map((pair, i) => {
        return (compare(...pair) > 0) ? (i + 1) : 0;
    }).reduce((a, b) => a + b)
)

// Part 2
let sorted = (day13Input
    .replace(/\n\n/g, "\n") + "\n[[2]]\n[[6]]")
    .split("\n")
    .sort((a, b) => compare(JSON.parse(b), JSON.parse(a)))

console.log(
    (sorted.indexOf("[[2]]") + 1) * (sorted.indexOf("[[6]]") + 1)
);
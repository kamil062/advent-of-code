export { };

let input = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

const parseInput = (input: string): Map<string, string> => {
    return new Map(
        input
            .split("\n")
            .map(line => {
                return line.split(": ") as [string, string];
            })
    );
}

const isNumber = (input: string): boolean => {
    return !Number.isNaN(parseInt(input));
}

const calculate = (data: Map<string, string>, node: string = "root", evalHumn: boolean): string => {
    let operation = data.get(node) ?? "";

    if (isNumber(operation)) {
        return (evalHumn == false && node == "humn") ? node : operation;
    }

    let operands = operation.split(/( [+\-*/] )/g).map(e => e.trim());

    for (let i = 0; i < operands.length; i++) {
        let operand = operands[i];

        if (!["+", "-", "*", "/"].includes(operand)) {
            if (!isNumber(operand)) {
                operands[i] = calculate(data, operand, evalHumn);
            }
        }

    }

    if(isNumber(operands[0]) && isNumber(operands[2])) {
        return eval(`(${operands.join('')})`);
    }

    return `(${operands.join('')})`;
}

{
    console.clear();

    let data = parseInput(input);
    let result = calculate(data, "root", true);

    // Part 1
    console.log(
        result,
    );

    // Part 2
    let root = data.get("root") ?? "";
    let operands = root.split(/( [+\-*/] )/g).map(e => e.trim());
    let leftPart = calculate(data, operands[0], false);
    let rightPart = calculate(data, operands[2], false);

    console.log({
        leftPart,
        rightPart,
        equation: `${leftPart} = ${rightPart}`
    })

    // To solve equation:
    // https://www.mathpapa.com/simplify-calculator/
}
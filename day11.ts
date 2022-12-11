let input = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

class Item {
    public worryLevel: number;
    public id: string;

    constructor(worryLevel: number) {
        this.worryLevel = worryLevel;
        this.id = Math.round(Math.random() * 1e15).toString(36);
    }

    public performTest(test: Test) {
        return test.checkCondition(this.worryLevel);
    }

    public performOperation(operation: string) {
        let rightSide = operation.split(' = ')[1];
        let filledEquation = rightSide.replaceAll("old", this.worryLevel.toString());
        let output = Math.floor(eval(filledEquation));

        return output;
    }
}

class Test {
    public condition: number;
    public targetIfTrue: number;
    public targetIfFalse: number;

    constructor(condition: number, targetIfTrue: number, targetIfFalse: number) {
        this.condition = condition;
        this.targetIfTrue = targetIfTrue;
        this.targetIfFalse = targetIfFalse;
    }

    public checkCondition(value: number) {
        return (value % this.condition == 0)
            ? this.targetIfTrue
            : this.targetIfFalse;
    }
}

class Monkey {
    public id: number;
    public items: Item[];
    public operation: string;
    public test: Test;
    public inspections: number = 0;

    constructor(id: number, items: Item[], operation: string, test: Test) {
        this.id = id;
        this.items = items;
        this.operation = operation;
        this.test = test;
    }

    public static fromString(data: string) {
        let lines = data.split("\n");

        let id = parseInt(lines[0].split(' ')[1].slice(0, -1));

        let items = lines[1]
            .replace("  Starting items: ", "")
            .split(", ")
            .map(item => new Item(parseInt(item)));

        let operation = lines[2]
            .replace("  Operation: ", "");

        let testCondition = parseInt(lines[3].replace("  Test: divisible by ", ""));
        let testTargetIfTrue = parseInt(lines[4].replace("    If true: throw to monkey ", ""));
        let testTargetIfFalse = parseInt(lines[5].replace("    If false: throw to monkey ", ""));
        let test = new Test(testCondition, testTargetIfTrue, testTargetIfFalse);

        return new Monkey(id, items, operation, test);
    }

    public turn(getBoredOperation: string) {
        let itemsToGiveAway: { [monkeyId: number]: Item }[] = [];
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];

            this.inspections++;

            item.worryLevel = item.performOperation(this.operation);
            item.worryLevel = item.performOperation(getBoredOperation);

            let targetMonkey = item.performTest(this.test);

            itemsToGiveAway.push({
                [targetMonkey]: item
            });
        }

        return itemsToGiveAway;
    }

    public removeItem(item: Item) {
        this.items = this.items.filter(i => i.id != item.id);
    }

    public removeItems(items: Item[]) {
        for (let item of items) this.removeItem(item);
    }

    public addItem(item: Item) {
        this.items.push(item);
    }
}

const monkeyBusiness = (monkeys: Monkey[]) => {
    let sortedByInspections = monkeys
        .sort((m1: Monkey, m2: Monkey) => m2.inspections - m1.inspections)
        .map(monkey => monkey.inspections)

    return sortedByInspections[0] * sortedByInspections[1];
}

const greatestCommonDivisor = (a: number, b: number): number => {
    return a ? greatestCommonDivisor(b % a, a) : b
};

const leastCommonMultiple = (a: number, b: number): number => {
    return a * b / greatestCommonDivisor(a, b)
};

const simulation = (monkeys: Monkey[], steps: number, worryOperation: string) => {
    for (let round = 1; round <= steps; round++) {
        for (let monkey of monkeys) {
            let itemsToGiveAway = monkey.turn(worryOperation);

            monkey.removeItems(itemsToGiveAway.map(e => Object.values(e)[0]))

            for (let item of itemsToGiveAway) {
                let target = parseInt(Object.keys(item)[0]);
                let _item = Object.values(item)[0];

                monkey.removeItem(_item);
                monkeys.find(m => m.id == target)?.addItem(_item);
            }
        }
    }

    console.log(
        "\n" + monkeys.map(monkey => {
            return `Monkey ${monkey.id} inspected items ${monkey.inspections} times`
        }).join('\n') + "\n",

        monkeyBusiness(monkeys)
    )
}

console.clear();

let monkeys1: Monkey[] = [];
let monkeys2: Monkey[] = [];

for (let monkeyData of input.split('\n\n')) {
    monkeys1.push(Monkey.fromString(monkeyData));
    monkeys2.push(Monkey.fromString(monkeyData));
}

let lcm = monkeys1
    .map(m => m.test.condition)
    .reduce(leastCommonMultiple);

simulation(monkeys1, 20, `new = old / 3`);
simulation(monkeys2, 10000, `new = old % ${lcm}`);

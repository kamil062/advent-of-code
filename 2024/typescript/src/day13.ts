{
    let data = `Button A: X+94, Y+34
    Button B: X+22, Y+67
    Prize: X=8400, Y=5400

    Button A: X+26, Y+66
    Button B: X+67, Y+21
    Prize: X=12748, Y=12176

    Button A: X+17, Y+86
    Button B: X+84, Y+37
    Prize: X=7870, Y=6450

    Button A: X+69, Y+23
    Button B: X+27, Y+71
    Prize: X=18641, Y=10279`;

    type Machine = {
        buttonA: { x: number, y: number };
        buttonB: { x: number, y: number };
        prize: { x: number, y: number };
    }

    const machines: Machine[] = data.split("\n\n").map(machine => {
        const [buttonA, buttonB, prize] = machine.split("\n")
            .map(row => row.replaceAll("=", "+"))
            .map(row => {
                return {
                    x: +row.split(": ")[1].split(", ")[0].split("+")[1],
                    y: +row.split(": ")[1].split(", ")[1].split("+")[1]
                }
            })

        return {
            buttonA,
            buttonB,
            prize
        }
    });

    console.clear();

    const simulateMachine = (machine: Machine, offset: number) => {
        const a = machine.buttonA.x;
        const b = machine.buttonB.x;
        const c = machine.buttonA.y;
        const d = machine.buttonB.y;

        const e = machine.prize.x + offset;
        const f = machine.prize.y + offset;

        const y = (f * a - e * c) / (-b * c + a * d);
        const x = (e - b * y) / a;

        return Number.isInteger(x) && Number.isInteger(y)
            ? 3 * x + y
            : 0;
    }

    console.log(
        machines
            .map(machine => simulateMachine(machine, 0))
            .reduce((a, b) => a + b),

        machines
            .map(machine => simulateMachine(machine, 10000000000000))
            .reduce((a, b) => a + b)
    )
}
{
    let data = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

    type Equation = {
        arguments: number[],
        result: number
    }

    const equations: Equation[] = data.split("\n")
        .map(row => {
            const [result, args] = row.split(": ");

            return {
                result: +result,
                arguments: args.split(" ").map(e => +e)
            } as Equation
        });

    const dfs = (
        equation: Equation,
        operators = ['+', '*'],
        arg1?: number,
        position: number = 0,
        result?: string
    ): { equation: string, result: number }[] | { equation: string, result: number } => {
        if (arg1 == null) arg1 = equation.arguments[position];
        const arg2 = equation.arguments[position + 1];

        if (arg2 == null) {
            return {
                equation: result ?? '',
                result: arg1
            };
        }

        return operators.map(operator => {
            const localResult = operator == '||'
                ? +`${arg1}${arg2}`
                : eval(`${arg1} ${operator} ${arg2}`);

            if (localResult > equation.result) return null;

            return dfs(equation, operators, localResult, position + 1, `${result ?? arg1} ${operator} ${arg2}`);
        }).filter(e => e != null).flat()
    }

    console.clear();
    console.log(
        equations
            .filter(equation => {
                const results = dfs(equation) as { equation: string, result: number }[];
                return results.some(result => result.result == equation.result);
            })
            .map(equation => equation.result)
            .reduce((a, b) => a + b)
    );
    console.log(equations
        .filter(equation => {
            const results = dfs(equation, ['+', '*', '||']) as { equation: string, result: number }[];
            return results.some(result => result.result == equation.result);
        })
        .map(equation => equation.result)
        .reduce((a, b) => a + b)
    );
}
{
    const data = '125 17';

    const stones: string[] = data.split(' ');

    const blink = (
        stones: string[],
        totalSteps: number = 1,
        currentStep: number = 1,
        memory: Map<string, number> = new Map()
    ): any => {
        if (currentStep > totalSteps) {
            return stones.length;
        }

        const key = [...stones, currentStep].join('|');
        const valueFromMemory = memory.get(key);

        if (valueFromMemory != null) {
            return valueFromMemory;
        }

        const result = stones
            .map(stone => {
                if (stone === '0') {
                    return blink(['1'], totalSteps, currentStep + 1, memory)
                } else if (stone.length % 2 === 0) {
                    return blink([
                        `${+stone.slice(0, stone.length / 2)}`,
                        `${+stone.slice(stone.length / 2)}`
                    ], totalSteps, currentStep + 1, memory);
                } else {
                    return blink([`${+stone * 2024}`], totalSteps, currentStep + 1, memory);
                }
            })
            .flat()
            .reduce((a, b) => a + b);

        memory.set(key, result);

        return result;
    }

    console.clear();
    console.log(
        blink(stones, 25),
        blink(stones, 75),
    )
}
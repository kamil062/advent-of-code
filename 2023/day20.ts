export { };

let input = `1
2
-3
3
-2
0
4`;

type Coordinate = { index: number, value: number };

const mix = (data: Coordinate[]) => {
    for (let i = 0; i < data.length; i++) {
        let index = data.findIndex(e => e.index == i);
        let element = data[index];

        data.splice(index, 1);
        data.splice((index + element.value) % data.length, 0, element);
    }
}

console.clear();

// Part 1
{
    let data: Coordinate[] = input
        .split('\n')
        .map((e, i) => {
            return {
                index: i,
                value: parseInt(e)
            }
        });

    mix(data);

    let valueZero = data.findIndex(e => e.value == 0);
    console.log(
        data[((valueZero + 1000) % data.length)].value +
        data[((valueZero + 2000) % data.length)].value +
        data[((valueZero + 3000) % data.length)].value
    )
}

// Part 2
{
    let data: Coordinate[] = input
        .split('\n')
        .map((e, i) => {
            return {
                index: i,
                value: parseInt(e) * 811589153
            }
        });


    for (let i = 0; i < 10; i++) mix(data);

    let valueZero = data.findIndex(e => e.value == 0);
    console.log(
        data[((valueZero + 1000) % data.length)].value +
        data[((valueZero + 2000) % data.length)].value +
        data[((valueZero + 3000) % data.length)].value
    )
}

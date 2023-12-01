let _input = `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`;

const findStartOfPacket = (input: string, distinctChars: number) => {
    for (let i = distinctChars - 1; i < input.length; i++) {
        let part = input.slice(i - (distinctChars - 1), i + 1);
        let characters = part.split('');
        let _set = new Set(characters);

        if (_set.size == distinctChars) {
            return i + 1;
        }
    }

    return 0;
}

console.clear();
console.log(
    findStartOfPacket(_input, 4),
    findStartOfPacket(_input, 14)
)

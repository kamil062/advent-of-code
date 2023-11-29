let input = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

export {}

const alphabet = ['=', '-', '0', '1', '2'];

const decimalToSNAFU = (value: number) => {
        let digits = '';

        while (value > 0) {
                let reminder = (value + 2) % 5;
                digits = alphabet[reminder] + digits;
                value = Math.floor((value + 2) / 5);
        }

        return digits;
}

const SNAFUToDecimal = (value: string): number => {
        return value
                .split('')
                .reverse()
                .map((v: string, i: number) => (alphabet.indexOf(v) - 2) * (5 ** i))
                .reduce((a, b) => a + b);
}

{
        console.clear();

        let resultDecimal = input
                .split('\n')
                .map((v: string) => SNAFUToDecimal(v))
                .reduce((a, b) => a + b);

        console.log(decimalToSNAFU(resultDecimal))
}
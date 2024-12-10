{
    const data = `2333133121414131402`;

    type Block = number | '.'

    const diskMap: number[] = data.split('').map(e => +e);

    const createBlocks = (diskMap: number[], isFlat: boolean) => {
        let blocks: Block[][] = diskMap.map((value: number, i: number) => {
            if (i % 2 == 0) {
                return Array(value).fill(i / 2) as number[]
            } else {
                return Array(value).fill('.') as '.'[]
            }
        }).filter(block => block.length);

        return isFlat ? blocks.flat() : blocks;
    }

    const defragment = (blocks: Block[] | Block[][], wholeFiles: boolean) => {
        if (wholeFiles == false) {
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i] == '.') {
                    for (let j = blocks.length - 1; j > i; j--) {
                        if (blocks[j] != '.') {
                            const tmp = blocks[i];
                            blocks[i] = blocks[j];
                            blocks[j] = tmp;
                            break;
                        }
                    }
                }
            }
        } else {
            blocks = blocks as Block[][];

            for (let i = blocks.length - 1; i > 0; i--) {
                if (blocks[i].every(e => e != '.')) {
                    for (let j = 0; j < i; j++) {
                        if (blocks[j].filter(e => e == '.').length >= blocks[i].length) {
                            for (let k = 0; k < blocks[i].length; k++) {
                                blocks[j][blocks[j].indexOf('.')] = blocks[i][k];
                                blocks[i][k] = '.';
                            }
                            break;
                        }
                    }
                }
            }
        }

        return blocks;
    }

    const checksum = (blocks: Block[] | Block[][]) => {
        return blocks
            .flat()
            .reduce((checksum: number, e, i) => {
                return e != '.'
                    ? checksum + e * i
                    : checksum;
            }, 0);
    }


    console.clear();

    const blocksPart1 = createBlocks(diskMap, true);
    const resultPart1 = defragment(blocksPart1, false);
    const checksumPart1 = checksum(resultPart1);

    const blocksPart2 = createBlocks(diskMap, false);
    const resultPart2 = defragment(blocksPart2, true);
    const checksumPart2 = checksum(resultPart2);

    console.log({
        checksumPart1,
        checksumPart2
    })
}
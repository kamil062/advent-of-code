export {};

let input = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

type TFile = { name: string, size: number };
type Dir = { [dir: string]: TFile[] };

const data = input.split('\n');
let currentDir = '';
let tree: Dir = { }

console.clear();
for (let i = 0; i < data.length; i++) {
    let line = data[i];

    if (line.startsWith('$ cd')) {
        let target = line.slice(5);

        if (target == '/') currentDir = '/';
        else if (target == '..') currentDir = currentDir.slice(0, currentDir.lastIndexOf('/'));
        else currentDir += `${currentDir.endsWith('/') ? '' : '/'}${target}`;

        if (currentDir.length == 0) currentDir = '/';
    }

    if (line.startsWith('$ ls')) {
        let restOfData = data.slice(i + 1);
        let closesDollar = restOfData.findIndex(line => line.startsWith("$"));

        let filesList = restOfData
            .slice(0, closesDollar >= 0 ? closesDollar : restOfData.length)
            .map(file => {
                return {
                    size: parseInt(file.split(' ')[0]) || null,
                    name: file.split(' ')[1]
                } as TFile
            });

        tree[currentDir] = filesList;
    }
}

// Total sizes
let totalSizes: { dir: string, size: number }[] = [];

let sizeOfDir = (dirName: string, tree: Dir) => {
    let total = 0;
    for (let file of tree[dirName]) {
        if (file['size'] != null) {
            total += file.size;
        }
        else {
            total += sizeOfDir(`${dirName}${dirName.endsWith('/') ? '' : '/'}${file.name}`, tree);
        }
    }
    return total;
}

for (let dir of Object.keys(tree)) {
    totalSizes.push({
        dir,
        size: sizeOfDir(dir, tree)
    })
}

let maxSpace = 70000000;
let usedSpace = sizeOfDir('/', tree);
let unusedSpace = maxSpace - usedSpace;
let needToFree = 30000000 - unusedSpace;

console.log(
    totalSizes.filter(e => e.size <= 100000).reduce((a, b) => a + b.size, 0), // task1
    totalSizes.sort((a, b) => a.size - b.size).find(dir => dir.size >= needToFree)?.size //task2
)

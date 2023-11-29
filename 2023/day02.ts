export {};

let input = `A Y
B X
C Z`;

// A, X = Rock
// B, Y = Paper
// C, Z = Scissors

const outcome = (line: string) => {
    const shapeScore = line[2] == 'X' ? 1 : (line[2] == 'Y' ? 2 : 3);
    let winScore = 0;
    
    switch(line) {
        case 'A X': 
        case 'B Y':
        case 'C Z':
            winScore = 3; break;
        case 'A Y': winScore = 6; break;
        case 'A Z': winScore = 0; break;
        case 'B X': winScore = 0; break;
        case 'B Z': winScore = 6; break;
        case 'C X': winScore = 6; break;
        case 'C Y': winScore = 0; break;
    }

    return winScore + shapeScore;
}

console.clear();
console.log(
    input.split('\n').map(line => outcome(line)).reduce((a, b) => a + b, 0)
);

// Part 2
const outcome2 = (line: string) => {
    if(line[2] == 'Y') { // Need to draw
        if(line[0] == 'A') return outcome('A X');
        if(line[0] == 'B') return outcome('B Y');
        if(line[0] == 'C') return outcome('C Z');
    } else if(line[2] == 'X') { // Need to lose
        if(line[0] == 'A') return outcome('A Z');
        if(line[0] == 'B') return outcome('B X');
        if(line[0] == 'C') return outcome('C Y');
    } else { // Need to win
        if(line[0] == 'A') return outcome('A Y');
        if(line[0] == 'B') return outcome('B Z');
        if(line[0] == 'C') return outcome('C X');
    }

    return 0;
}

console.log(
    input.split('\n').map(line => outcome2(line)).reduce((a, b) => a + b, 0)
);

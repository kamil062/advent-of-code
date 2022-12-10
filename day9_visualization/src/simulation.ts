const canvas = <NonNullable<HTMLCanvasElement>>document.querySelector('canvas');
const ctx = <NonNullable<CanvasRenderingContext2D>>canvas.getContext('2d');

const stepsContainer = document.querySelector("#steps");

function clearCanvas() {
    ctx.fillStyle = '#1C1C1C';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

const drawSegment = (positionA, positionB) => {
    ctx.strokeStyle = '#DADDD8';
    ctx.lineWidth = 10;

    ctx.beginPath();
    ctx.moveTo(positionA[0], positionA[1]);
    ctx.lineTo(positionB[0], positionB[1]);
    ctx.stroke();
}

const drawLineStrip = (positions) => {
    ctx.strokeStyle = '#DADDD8';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round'
    ctx.lineJoin = 'bevel';

    ctx.beginPath();
    ctx.moveTo(positions[0][0], positions[0][1]);
    for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i][0], positions[i][1]);
    }
    ctx.stroke();
}

const redraw = (positions: Position[]) => {
    clearCanvas();

    ctx.save();

    ctx.translate(
        ctx.canvas.width / 2,
        ctx.canvas.height / 2
    );
    // ctx.scale(3, 3);

    drawLineStrip(positions);

    ctx.restore();

    // window.requestAnimationFrame(() => { redraw(); });
}

const timeout = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let mousePos = [0, 0];
let lastMousePos = [0, 0];


canvas.addEventListener("mousemove", async (e) => {
    mousePos[0] = e.clientX;
    mousePos[1] = e.clientY;
});

document.addEventListener("DOMContentLoaded", async () => {
    // window.requestAnimationFrame(() => { redraw(); });

    ctx.canvas.width = canvas.offsetWidth;
    ctx.canvas.height = canvas.offsetHeight;

    clearCanvas();

    let numberOfKnots = 500;
    let ropePositions: Position[] = Array(numberOfKnots).fill([0, 0]);

    let commands = input.split("\n");

    stepsContainer.innerHTML = input
        .split('\n')
        .map((step, i) => {
            return `<p index='${i}'>[${(i + 1).toString().padStart(4, '0')}/${commands.length}] ${step}</p>`;
        })
        .join("\n");

    setInterval(async () => {
        clearCanvas();

        // mousePos[0] = e.clientX;
        // mousePos[1] = e.clientY;

        if (lastMousePos == null) {
            lastMousePos = [mousePos[0], mousePos[1]];
            return;
        }

        let rect = canvas.getBoundingClientRect();
        let mousePosInLocalSpace = [
            mousePos[0] - (ctx.canvas.width / 2) - rect.left,
            mousePos[1] - (ctx.canvas.height / 2) - rect.top
        ]

        let horizontalDifference = mousePosInLocalSpace[0] - ropePositions[0][0];
        let verticalDifference = mousePosInLocalSpace[1] - ropePositions[0][1];

        let horizontalCommand = (horizontalDifference > 0 ? "R" : "L") + " " + Math.abs(horizontalDifference);
        let verticalCommand = (verticalDifference > 0 ? "U" : "D") + " " + Math.abs(verticalDifference);

        if (horizontalDifference != 0) {
            let direction: Direction = <Direction>horizontalCommand.split(' ')[0];
            let numberOfSteps: number = parseInt(horizontalCommand.split(' ')[1]);

            for (let j = 0; j < numberOfSteps; j++) {
                // Move head
                ropePositions[0] = nextHeadPosition(ropePositions[0], direction);
                // Move other knots to follow
                for (let k = 1; k < ropePositions.length; k++) {
                    ropePositions[k] = nextTailPosition(ropePositions[k - 1], ropePositions[k]);
                }
            }
        }

        if (verticalDifference != 0) {
            let direction: Direction = <Direction>verticalCommand.split(' ')[0];
            let numberOfSteps: number = parseInt(verticalCommand.split(' ')[1]);

            for (let j = 0; j < numberOfSteps; j++) {
                // Move head
                ropePositions[0] = nextHeadPosition(ropePositions[0], direction);
                // Move other knots to follow
                for (let k = 1; k < ropePositions.length; k++) {
                    ropePositions[k] = nextTailPosition(ropePositions[k - 1], ropePositions[k]);
                }
            }
        }

        redraw(ropePositions);

        console.log(
            mousePosInLocalSpace, ropePositions[0]
        );

        lastMousePos = [mousePos[0], mousePos[1]];
    }, 16);

    // for (let i = 0; i < commands.length; i++) {
    //     let command = commands[i];

    //     let direction: Direction = <Direction>command.split(' ')[0];
    //     let numberOfSteps: number = parseInt(command.split(' ')[1]);

    //     stepsContainer.querySelectorAll('p').forEach((p) => {
    //         p.className = "";
    //     });
    //     stepsContainer.querySelector(`[index='${i}']`).className = 'selected';
    //     stepsContainer.querySelector(`[index='${i}']`).scrollIntoView();

    //     for (let j = 0; j < numberOfSteps; j++) {
    //         // Move head
    //         ropePositions[0] = nextHeadPosition(ropePositions[0], direction);

    //         // Move other knots to follow
    //         for (let k = 1; k < ropePositions.length; k++) {
    //             ropePositions[k] = nextTailPosition(ropePositions[k - 1], ropePositions[k]);
    //         }

    //         redraw(ropePositions);

    //         await timeout(1);
    //     }
    // }
});

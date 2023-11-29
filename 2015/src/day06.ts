{
  console.clear();

  const input = `toggle 461,550 through 564,900
    turn off 370,39 through 425,839
    turn off 464,858 through 833,915
    turn off 812,389 through 865,874
    turn on 599,989 through 806,993`;

  type Grid = Map<string, number>;

  enum Command {
    TURN_ON,
    TURN_OFF,
    TOGGLE,
  }

  const initGrid = (gridSize: number) => {
    const grid: Map<string, number> = new Map();

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        grid.set(`${x},${y}`, 0);
      }
    }

    return grid;
  };

  const executeCommand = (
    grid: Grid,
    from: string,
    to: string,
    command: Command,
    ancientNordicElvish: boolean
  ) => {
    const fromDim = from.split(",").map((e) => parseInt(e));
    const toDim = to.split(",").map((e) => parseInt(e));
    for (let x = fromDim[0]; x <= toDim[0]; x++) {
      for (let y = fromDim[1]; y <= toDim[1]; y++) {
        const key = `${x},${y}`;
        const oldValue = grid.get(key) || 0;
        let newValue = oldValue;

        switch (command) {
          case Command.TOGGLE:
            newValue = ancientNordicElvish
              ? oldValue + 2
              : Math.abs(oldValue - 1);
            break;
          case Command.TURN_ON:
            newValue = ancientNordicElvish ? oldValue + 1 : 1;
            break;
          case Command.TURN_OFF:
            newValue = ancientNordicElvish ? Math.max(oldValue - 1, 0) : 0;
            break;
        }

        grid.set(key, newValue);
      }
    }
  };

  // Part1
  {
    const grid = initGrid(1000);

    input.split("\n").forEach((line) => {
      const from = line.split(" ").slice(-3, -2)[0];
      const to = line.split(" ").slice(-1)[0];

      if (line.startsWith("toggle")) {
        executeCommand(grid, from, to, Command.TOGGLE, false);
      } else if (line.startsWith("turn on")) {
        executeCommand(grid, from, to, Command.TURN_ON, false);
      } else if (line.startsWith("turn off")) {
        executeCommand(grid, from, to, Command.TURN_OFF, false);
      }
    });

    let turnedOn = Array.from(grid.values()).reduce((a, b) => a + b);
    console.log({ turnedOn });
  }

  // Part2
  {
    const grid = initGrid(1000);

    input.split("\n").forEach((line) => {
      const from = line.split(" ").slice(-3, -2)[0];
      const to = line.split(" ").slice(-1)[0];

      if (line.startsWith("toggle")) {
        executeCommand(grid, from, to, Command.TOGGLE, true);
      } else if (line.startsWith("turn on")) {
        executeCommand(grid, from, to, Command.TURN_ON, true);
      } else if (line.startsWith("turn off")) {
        executeCommand(grid, from, to, Command.TURN_OFF, true);
      }
    });

    let totalBrightness = Array.from(grid.values()).reduce((a, b) => a + b);
    console.log({ totalBrightness });
  }
}

{
  console.clear();

  const input = `^v^v^v^v^v`;

  let visitedHousesSingle: Map<string, number> = new Map([["0x0", 1]]);
  let visitedHousesBoth: Map<string, number> = new Map([["0x0", 1]]);

  let position = [0, 0];
  let santaPosition = [0, 0];
  let roboSantaPosition = [0, 0];
  let turn = true;

  for (let direction of input.split("")) {
    switch (direction) {
      case ">":
        position[0]++;
        (turn ? santaPosition : roboSantaPosition)[0]++;
        break;
      case "<":
        position[0]--;
        (turn ? santaPosition : roboSantaPosition)[0]--;
        break;
      case "^":
        position[1]--;
        (turn ? santaPosition : roboSantaPosition)[1]--;
        break;
      case "v":
        position[1]++;
        (turn ? santaPosition : roboSantaPosition)[1]++;
        break;
    }

    turn = !turn;

    const houseVisits = visitedHousesSingle.get(position.join("x"));
    visitedHousesSingle.set(
      position.join("x"),
      houseVisits === undefined ? 0 : houseVisits + 1
    );

    const bothHouseVisits1 = visitedHousesBoth.get(santaPosition.join("x"));
    const bothHouseVisits2 = visitedHousesBoth.get(roboSantaPosition.join("x"));

    visitedHousesBoth.set(
      santaPosition.join("x"),
      bothHouseVisits1 === undefined ? 0 : bothHouseVisits1 + 1
    );
    visitedHousesBoth.set(
      roboSantaPosition.join("x"),
      bothHouseVisits2 === undefined ? 0 : bothHouseVisits2 + 1
    );
  }

  console.log(visitedHousesSingle.size);
  console.log(visitedHousesBoth.size);
}

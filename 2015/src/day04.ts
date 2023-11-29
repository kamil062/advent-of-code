import { createHash } from "node:crypto";

const input = "pqrstuv";
console.clear();

// Part 1
{
  let index = 1;
  while (index++) {
    const hash = createHash("md5")
      .update(`${input}${index}`)
      .digest("hex")
      .toString();

    if (hash.slice(0, 5) === "00000") break;
  }

  console.log(index);
}

// Part 2
{
  let index = 1;
  while (index++) {
    const hash = createHash("md5")
      .update(`${input}${index}`)
      .digest("hex")
      .toString();

    if (hash.slice(0, 6) === "000000") break;
  }

  console.log(index);
}

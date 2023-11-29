{
  console.clear();

  let input = `(()(()(`;

  // Part 1

  console.log(
    input.split('(').length -
      input.split(")").length
  );

  // Part 2

  let floor = 0;
  let position = 0;
  while(floor >= 0) {
    switch(input[position]) {
        case '(': floor++; break;
        case ')': floor--; break;
    }
    position++;
    if(position >= input.length) break;
  }

  console.log(position)
}

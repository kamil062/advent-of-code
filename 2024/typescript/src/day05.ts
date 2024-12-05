{
    const data = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

    type Rule = [number, number];
    type Page = number[];

    const rules: Rule[] = data.split("\n\n")[0]
        .split("\n")
        .map(line => line.split("|").map(e => +e) as Rule);

    const pages: Page[] = data.split("\n\n")[1]
        .split("\n")
        .map(line => line.split(",").map(e => +e));

    const isCorrect = (page: Page, rules: Rule[]) => {
        return !rules.some(rule => {
            const indexLeft = page.indexOf(rule[0]);
            const indexRight = page.indexOf(rule[1]);

            return indexLeft != -1 && indexRight != -1 && indexLeft >= indexRight;
        })
    }

    const sortPage = (page: Page, rules: Rule[]) => {
        return page.slice(0).sort((e1, e2) => isCorrect([e1, e2], rules) ? -1 : 1);
    }

    const getMiddle = (page: Page) => page[(page.length - 1) / 2];

    const correctPages = pages
        .filter(page => isCorrect(page, rules));

    const correctedIncorrectPages = pages
        .filter(page => !isCorrect(page, rules))
        .map(page => sortPage(page, rules))

    console.clear();
    console.log(
        correctPages
            .map(page => getMiddle(page))
            .reduce((a, b) => a + b),

        correctedIncorrectPages
            .map(page => getMiddle(page))
            .reduce((a, b) => a + b)
    );
}
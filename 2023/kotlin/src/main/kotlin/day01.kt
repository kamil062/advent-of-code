const val dayOneInput: String = """two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen"""

fun main() {
    // Part 1
    val part1 = dayOneInput.split("\n").map {
        val firstDigit = it.firstOrNull { char -> char.isDigit() } ?: 0
        val lastDigit = it.lastOrNull { char -> char.isDigit() } ?: 0

        "$firstDigit$lastDigit".toInt()
    }.sumOf { it }

    println("Part 1: $part1")

    // Part 2
    val numbersMapping = mapOf(
        "one" to "1",
        "two" to "2",
        "three" to "3",
        "four" to "4",
        "five" to "5",
        "six" to "6",
        "seven" to "7",
        "eight" to "8",
        "nine" to "9"
    )
    val part2 = dayOneInput.split("\n").map {line ->
        val flatList = numbersMapping.flatMap { listOf(it.key, it.value) }

        var firstDigit = line.findAnyOf(flatList)?.second ?: "0"
        var lastDigit = line.findLastAnyOf(flatList)?.second ?: "0"

        numbersMapping.forEach {
            firstDigit = firstDigit.replace(it.key, it.value)
            lastDigit = lastDigit.replace(it.key, it.value)
        }

        "$firstDigit$lastDigit".toInt()
    }.sumOf { it }

    println("Part 2: $part2")
}
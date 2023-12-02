import kotlin.math.max

const val dayTwoInput = """Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"""

fun main() {
    val result = dayTwoInput.split("\n").map { line ->
        val gameNumber = line.split(":")[0].split(" ")[1].toInt()
        var (maxRed, maxGreen, maxBlue) = Triple(0, 0, 0)

        line.split(":")[1].split(";").map { it.trim() }.forEach { set ->
            set.split(",").map { it.trim() }.forEach { option ->
                val (amount, color) = option.split(' ')

                when (color) {
                    "red" -> maxRed = max(maxRed, amount.toInt())
                    "green" -> maxGreen = max(maxGreen, amount.toInt())
                    "blue" -> maxBlue = max(maxBlue, amount.toInt())
                }
            }
        }

        Pair(
            if (maxRed <= 12 && maxGreen <= 13 && maxBlue <= 14) gameNumber else 0,
            maxRed * maxGreen * maxBlue
        )
    }.reduce { acc, pair -> Pair(acc.first + pair.first, acc.second + pair.second) }

    println("part1: ${result.first}")
    println("part2: ${result.second}")
}
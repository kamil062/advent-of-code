import kotlin.math.max
import kotlin.math.min

const val dayThreeInput = """467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598.."""

fun main() {
    val lines = dayThreeInput.split("\n")
    val symbols = "*#\\$&=+-%@/"

    val engineParts = mutableListOf<Int>()
    val gears: MutableMap<String, MutableList<Int>> = mutableMapOf()

    lines.forEachIndexed { lineIndex, line ->
        """(\d+)""".toRegex().findAll(line).forEach { matchResult ->
            var isAdjacentToSymbol = false

            val startX = max(matchResult.range.first - 1, 0)
            val endX = min(matchResult.range.last + 1, line.length - 1)
            val startY = max(lineIndex - 1, 0)
            val endY = min(lineIndex + 1, lines.count() - 1)

            for (x in startX..endX) {
                for (y in startY..endY) {
                    val currentChar = lines[y][x]
                    if (symbols.contains(currentChar)) {
                        isAdjacentToSymbol = true
                    }

                    if (currentChar == '*') {
                        val newValue = gears["$x,$y"] ?: mutableListOf()
                        newValue.add(matchResult.value.toInt())
                        gears["$x,$y"] = newValue
                    }
                }
            }

            if (isAdjacentToSymbol) {
                engineParts.add(matchResult.value.toInt())
            }
        }
    }

    println("part1: ${engineParts.sum()}")
    println("part2: ${gears.filter { it.value.count() > 1 }.values.sumOf { subList -> subList.reduce { a, b -> a * b } }}")
}
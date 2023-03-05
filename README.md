# Wordle solver

Contains some scripts to solve wordle puzzles.

See the files below for the code and instructions:

- [lib/nytimes.js](lib/nytimes.js): solves the [NY Times Wordle puzzle](https://www.nytimes.com/games/wordle/index.html).
- [lib/wordlegame.js](lib/wordlegame.js): solves the [Wordlegame.org Wordle puzzle](https://wordlegame.org/).

**Average success rate: 92%.**

# NodeJS Wordle

Requirements:

- Node.js

Create and solves the puzzles in NodeJS:

```sh
# Create and solve the default amount of puzzles:
node play.js

# Or create and solve a given amount of puzzles:
node play.js 2
```

![Output of the NodeJS wordle solver](./cli-output.png "Output from CLI")

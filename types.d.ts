type Status = "present" | "absent" | "correct" | "empty";

interface Cell {
  status: Status;
  getText(): string;
}

interface Row {
  getCells(): Cell[];
  getText(): string;
}

type CheckerFn = (cell: Cell) => boolean;

interface Rule {
  letter: string;
  index: "?" | number;
}

interface RuleSet {
  mustHave: Rule[];
  cantHave: Rule[];
}

interface LogAdapter {
  log(...data: any[]): void;
}

interface GameAdapter {
  getMaxRows(): number;
  guessToRow(guess: string): Row;
  guessToCells(guess: string): Cell[];
}

interface Board {
  getRows(): Row[];
  canGuess(): boolean;
  getFilledRows(): Row[];
  placeGuess(guess: string): boolean;
}

interface Player {
  playGame(board: Board): boolean;
}

interface Solver {
  getNextGuess(rows: Row[]): string;
}
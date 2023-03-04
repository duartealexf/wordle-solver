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
  getWordsLength(): number;
  getMaxRows(): number;
  convertGuessToCells(guess: string): Promise<Cell[]>;
}

interface Board {
  getRows(): Row[];
  canGuess(): boolean;
  getFilledRows(): Row[];
  placeGuess(guess: string): Promise<boolean>;
}

interface Player {
  playGame(board: Board): Promise<boolean>;
}

interface Solver {
  getNextGuess(rows: Row[]): string;
}
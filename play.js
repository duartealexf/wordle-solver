const Board = require("./src/board");
const Solver = require("./src/solver");
const Player = require("./src/player");
const NodeGameAdapter = require("./src/adapters/node");

const allWords = require("./src/words");
const { pickRandom } = require("./src/utils");

/** @type {LogAdapter} */
const noLogAdapter = { log: () => {} };

/** @param {string} text */
const green = (text) => `\x1b[37m\x1b[42m\x1b[1m ${text.toUpperCase()} \x1b[0m`;
/** @param {string} text */
const orange = (text) => `\x1b[37m\x1b[43m\x1b[1m ${text.toUpperCase()} \x1b[0m`;
/** @param {string} text */
const gray = (text) => `\x1b[37m\x1b[40m\x1b[1m ${text.toUpperCase()} \x1b[0m`;

/** @param {Row[]} rows */
const formatRowsOutput = (rows) =>
  rows
    .map((row) =>
      row
        .getCells()
        .map(({ status, getText }) =>
          status === "correct"
            ? green(getText())
            : status === "present"
            ? orange(getText())
            : gray(getText())
        )
        .join("")
    )
    .join("\n");

const solver = Solver(allWords, noLogAdapter);
const player = Player(solver, noLogAdapter);

const playGames = async () => {
  const gamesToPlay = parseInt(process.argv[2] ?? "10");
  let gamesPlayed = 0;

  const statistics = {
    gamesPlayed: gamesToPlay,
    gamesWon: 0,
    gamesLost: 0,
    maxStreak: 0,
    winningAttempts: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    },
  };

  let currentStreak = 0;

  while (gamesPlayed++ < gamesToPlay) {
    const { element: answer } = pickRandom(allWords);
    const adapter = NodeGameAdapter(answer);
    const board = Board(adapter);
    const won = await player.playGame(board);

    console.log();
    const header =
      `Game ${gamesPlayed}/${gamesToPlay} (` +
      (won ? `won` : `lost - answer: ${answer}`) +
      ")";
    console.log(header);
    console.log(formatRowsOutput(board.getFilledRows()));
    console.log(``);

    if (won) {
      statistics.winningAttempts[board.getFilledRows().length]++;
      statistics.gamesWon++;
      currentStreak++;
      if (currentStreak > statistics.maxStreak) {
        statistics.maxStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
      statistics.gamesLost++;
    }
  }

  return statistics;
};

(async () => {
  const statistics = await playGames();
  console.log();
  console.log(JSON.stringify(statistics, null, 2));
})();

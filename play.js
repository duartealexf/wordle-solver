const Board = require("./src/board");
const Solver = require("./src/solver");
const Player = require("./src/player");
const NodeGameAdapter = require("./src/adapters/node");

const allWords = require("./src/words");
const { pickRandom } = require("./src/utils");

/** @type {LogAdapter} */
const logAdapter = { log: () => {} };

const solver = Solver(allWords, logAdapter);
const player = Player(solver, logAdapter);

const playGames = () => {
  const gamesToPlay = 50;
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

  while (gamesPlayed++ < gamesToPlay) {
    let currentStreak = 0;
    const { element: answer } = pickRandom(allWords);
    const adapter = NodeGameAdapter(answer);
    const game = Board(adapter);
    const won = player.playGame(game);

    logAdapter.log(won ? `Game won :)` : "Game lost :(");

    if (won) {
      statistics.winningAttempts[game.getFilledRows().length]++;
      statistics.gamesWon++;
      currentStreak++;
    } else {
      currentStreak = 0;
      statistics.gamesLost++;
    }

    if (currentStreak > statistics.maxStreak) {
      statistics.maxStreak = currentStreak;
    }
  }

  return statistics;
};

const statistics = playGames();

console.log(JSON.stringify(statistics, null, 2));

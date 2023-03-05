const Board = require("./src/board");
const Solver = require("./src/solver");
const Player = require("./src/player");
const NodeGameAdapter = require("./src/adapters/node");

const allWords = require("./src/words");
const { formatRows } = require('./src/format');
const { pickRandom } = require("./src/utils");

/**
 * @param {number} gamesToPlay 
 */
const play = async (gamesToPlay) => {
  const solver = Solver(allWords, { log: () => {} });
  const player = Player(solver, { log: () => {} });

  let gamesPlayed = 0;

  const statistics = {
    gamesPlayed: gamesToPlay,
    gamesWon: 0,
    gamesLost: 0,
    maxStreak: 0,
    distribution: {
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
    console.log(formatRows(board.getFilledRows()));

    if (won) {
      statistics.distribution[board.getFilledRows().length]++;
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
  const statistics = await play(parseInt(process.argv[2] ?? "10"));
  console.log();
  console.log('Statistics:')
  console.log('Games played:', statistics.gamesPlayed);
  console.log('Games won:', statistics.gamesWon);
  console.log('Games lost:', statistics.gamesLost);
  console.log('Max streak:', statistics.maxStreak);
  console.log('Correct guess distribution:');
  console.log('  1st attempt:', statistics.distribution[1]);
  console.log('  2nd attempt:', statistics.distribution[2]);
  console.log('  3rd attempt:', statistics.distribution[3]);
  console.log('  4th attempt:', statistics.distribution[4]);
  console.log('  5th attempt:', statistics.distribution[5]);
  console.log('  6th attempt:', statistics.distribution[6]);
})();

/**
 * @param {ReturnType<import('./solver')>} solver
 * @param {LogAdapter} logAdapter
 * @returns {Player}
 */
module.exports = (solver, logAdapter) => ({
  playGame: (board) => {
    let won = false;

    while (!won && board.canGuess()) {
      const rows = board.getRows();
      const guess = solver.getNextGuess(rows);
      if (!guess) {
        logAdapter.log('No more guesses!')
        return false
      };
      won = board.placeGuess(guess);
      logAdapter.log(`Guessing ${guess}`);
    }

    return won;
  },
});

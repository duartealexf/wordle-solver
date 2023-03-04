/**
 * @param {GameAdapter} adapter
 * @returns {Board}
 */
module.exports = (adapter) => {
  /** @type {Row[]} */
  const rows = Array.from({ length: adapter.getMaxRows() }, () =>
    adapter.guessToRow("")
  );

  const getNextIndex = () =>
    rows.findIndex((row) => row.getText().length === 0);

  const isGameWon = () =>
    rows.some((row) =>
      row.getCells().every((cell) => cell.status === "correct")
    );

  const getFilledRows = () => rows.filter((row) => row.getText().length);

  return {
    getRows: () => rows,
    canGuess: () => getFilledRows().length < adapter.getMaxRows(),
    getFilledRows,
    placeGuess: (guess) => {
      const row = adapter.guessToRow(guess);
      rows[getNextIndex()] = row;
      return isGameWon();
    },
  };
};

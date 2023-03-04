/**
 * @param {GameAdapter} adapter
 * @returns {Board}
 */
module.exports = (adapter) => {
  /** @type {Row[]} */
  const rows = Array.from({ length: adapter.getMaxRows() }, () => ({
    getText: () => "",
    getCells: () =>
      Array.from({ length: adapter.getWordsLength() }, () => {
        /** @type {Cell} */
        const cell = { status: "empty", getText: () => "" };
        return cell;
      }),
  }));

  const isGameWon = () =>
    rows.some((row) =>
      row.getCells().every((cell) => cell.status === "correct")
    );

  const getFilledRows = () => rows.filter((row) => row.getText().length);

  /**
   * @param {Cell[]} cells
   * @returns {Row}
   */
  const makeRow = (cells) => ({
    getText: () => cells.map((cell) => cell.getText()).join(""),
    getCells: () => cells,
  });

  const getNextIndex = () =>
    rows.findIndex((row) => row.getText().length === 0);


  return {
    getRows: () => rows,
    canGuess: () => getFilledRows().length < adapter.getMaxRows(),
    getFilledRows,
    placeGuess: async (_guess) => {
      const guess = _guess.toLowerCase();
      const cells = await adapter.convertGuessToCells(guess);
      const row = makeRow(cells);
      rows[getNextIndex()] = row;
      return isGameWon();
    },
  };
};

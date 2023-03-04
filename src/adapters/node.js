/**
 * Game adapter for Node.js.
 *
 * @param {string} answer
 * @returns {GameAdapter}
 */
module.exports = (answer) => {
  const MAX_ROWS = 6;
  const WORDS_LENGTH = 5;

  /** @type {GameAdapter['getMaxRows']} */
  const getMaxRows = () => MAX_ROWS;

  /** @type {GameAdapter['guessToCells']} */
  const guessToCells = (guess) =>
    Array.from({ length: WORDS_LENGTH }, (_, index) => {
      const letter = guess.charAt(index);
      /** @type {Status} */
      let status;
      if (answer[index] === letter) status = "correct";
      else if (answer.includes(letter)) status = "present";
      else if (letter.length) status = "absent";
      else status = "empty";
      return { status, getText: () => letter };
    });

  /** @type {GameAdapter['guessToRow']} */
  const guessToRow = (guess) => {
    const cells = guessToCells(guess);

    return {
      getText: () => cells.map((cell) => cell.getText()).join(""),
      getCells: () => cells,
    };
  };

  return {
    getMaxRows,
    guessToCells,
    guessToRow,
  };
};

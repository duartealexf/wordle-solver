/**
 * Wordle game adapter for Node.js.
 *
 * @param {string} answer
 * @returns {GameAdapter}
 */
module.exports = (answer) => {
  const MAX_ROWS = 6;
  const WORDS_LENGTH = 5;

  return {
    getWordsLength: () => WORDS_LENGTH,
    getMaxRows: () => MAX_ROWS,
    convertGuessToCells: async (guess) =>
      Array.from({ length: WORDS_LENGTH }, (_, index) => {
        const letter = guess.charAt(index);
        /** @type {Status} */
        let status;
        if (answer[index] === letter) status = "correct";
        else if (answer.includes(letter)) status = "present";
        else if (letter.length) status = "absent";
        else status = "empty";
        return { status, getText: () => letter };
      }),
  };
};

/**
 * Solves Wordle in https://wordlegame.org/
 * Save it as a local snippet in Chrome and run it to enter a guess.
 */

/**
 * @returns {GameAdapter}
 */
module.exports = () => {
  /**
   * @param {string} selector
   * @param {HTMLElement} [context]
   * @returns {HTMLElement[]}
   */
  const $$ = (selector, context = document.body) =>
    Array.from(context.querySelectorAll(selector));

  const MAX_ROWS = 6;
  const WORDS_LENGTH = 5;
  const ROWS_SELECTOR = ".game_rows .Row";
  const CELL_SELECTOR = ".Row-letter";
  const CELL_CORRECT_SELECTOR = ".letter-correct";
  const CELL_PRESENT_SELECTOR = ".letter-elsewhere";
  const CELL_ABSENT_SELECTOR = ".letter-absent";
  const KEYS_SELECTOR = ".Game-keyboard-button";

  const $rows = $$(ROWS_SELECTOR);
  const $keys = $$(KEYS_SELECTOR).filter((b) => b.innerText.length);
  const $enterKey = $keys.find(
    (key) => key.innerText.toLowerCase() === "enter"
  );

  /** @type {Record<string, HTMLElement>} */
  const $letterKeys = $keys
    .filter((k) => k !== $enterKey)
    .reduce((obj, current) => {
      obj[current.innerText.toLowerCase()] = current;
      return obj;
    }, {});

  /**
   * @param {HTMLElement} element
   * @returns {string}
   */
  const getElementText = (element) => element.innerText.replace(/\W/g, "");

  /**
   * @param {number} ms
   */
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getFilledRows = () => $rows.filter((r) => getElementText(r).length);

  /**
   * @param {string} guess
   * @param {number} [attemps]
   */
  const waitForLastGuessReady = async (guess, attemps = 10) => {
    if (attemps === 0) throw new Error(`Last guess not found: ${guess}`);
    await sleep(200); // TODO: increase
    const $latestRow = $rows.slice(getFilledRows().length)[0];
    const text = getElementText($latestRow);
    if (text !== guess) {
      return waitForLastGuessReady(guess, attemps - 1);
    }
  };

  return {
    getWordsLength: () => WORDS_LENGTH,
    getMaxRows: () => MAX_ROWS,
    convertGuessToCells: async (guess) => {
      const letters = guess.split("");
      letters.forEach((letter) => $letterKeys[letter].click());
      $enterKey.click();

      await waitForLastGuessReady(guess);

      const $row = $rows.find(($r) => getElementText($r) === guess);
      if (!$row) throw new Error(`Row not found: ${guess}`);

      /** @type {Cell[]} */
      const cells = $$(CELL_SELECTOR, $row).map(($cell) => {
        const letter = getElementText($cell[0]);
        /** @type {Status} */
        let status;
        if ($cell.matches(CELL_CORRECT_SELECTOR)) status = "correct";
        else if ($cell.matches(CELL_PRESENT_SELECTOR)) status = "present";
        else if ($cell.matches(CELL_ABSENT_SELECTOR)) status = "absent";
        return { getText: () => letter, status };
      });

      return cells;
    },
  };
};

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
  const ROWS_SELECTOR = "[class*='Row-module_row']"
  const CELL_SELECTOR = "[class*='Tile-module_tile']";
  const CELL_CORRECT_SELECTOR = "[data-state='correct']";
  const CELL_PRESENT_SELECTOR = "[data-state='present']";
  const CELL_ABSENT_SELECTOR = "[data-state='absent']";
  const KEYS_SELECTOR = "[class*='Key-module_key']";

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
  const getElementText = (element) =>
    element.innerText.replace(/\W/g, "").toLowerCase();

  /**
   * @param {number} ms
   */
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * @param {HTMLElement[]} $cells
   * @param {number} [attemps]
   */
  const waitForCellsAnimationsFinished = async ($cells, attemps = 10) => {
    if (attemps === 0) throw new Error("Cells animations never finished");
    if (
      $cells.every(
        ($cell) =>
          $cell.matches(CELL_CORRECT_SELECTOR) ||
          $cell.matches(CELL_PRESENT_SELECTOR) ||
          $cell.matches(CELL_ABSENT_SELECTOR)
      )
    ) {
      return;
    }
    await sleep(300);
    return waitForCellsAnimationsFinished($cells, attemps - 1);
  };

  /**
   * @param {string} guess
   * @param {number} [attemps]
   */
  const waitForLastGuessReady = async (guess, attemps = 10) => {
    if (attemps === 0) throw new Error(`Last guess not found: ${guess}`);

    for (const $row of $rows) {
      const $cells = $$(CELL_SELECTOR, $row);
      await waitForCellsAnimationsFinished($cells);
      if (getElementText($row) === guess) return;
    }

    await sleep(300);
    return waitForLastGuessReady(guess, attemps - 1);
  };

  /**
   * @param {string} guess
   * @param {number} [attemps]
   */
  const waitForLettersPlaced = async (guess, attemps = 10) => {
    const letters = guess.split("");
    letters.forEach((letter) => $letterKeys[letter].click());
    
    if (attemps === 0) throw new Error(`Letters not placed on board: ${guess}`);
    
    for (const $row of $rows) {
      if (getElementText($row) === guess) return;
    }
    
    await sleep(300);
    return waitForLettersPlaced(guess, attemps - 1);
  };

  return {
    getWordsLength: () => WORDS_LENGTH,
    getMaxRows: () => MAX_ROWS,
    convertGuessToCells: async (guess) => {
      await waitForLettersPlaced(guess);
      $enterKey.click();
      await waitForLastGuessReady(guess);

      const $row = $rows.find(($r) => getElementText($r) === guess);
      if (!$row) throw new Error(`Row not found: ${guess}`);

      /** @type {Cell[]} */
      const cells = $$(CELL_SELECTOR, $row).map(($cell) => {
        const letter = getElementText($cell);
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

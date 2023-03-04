const { pickRandom, pluckRandom } = require("./utils");

/**
 * @param {string[]} knownWords
 * @param {LogAdapter} logAdapter
 * @returns {Solver}
 */
module.exports = (knownWords, logAdapter) => {
  const wordsWithUniqueLetters = [];
  const wordsWithRepeatedLetters = [];

  knownWords.forEach((word) => {
    if (/(.).*?\1/.test(word)) {
      wordsWithRepeatedLetters.push(word);
    } else {
      wordsWithUniqueLetters.push(word);
    }
  });

  /**
   * @param {Row[]} rows
   */
  const getRules = (rows) => {
    /** @type {Rule[]} */
    const mustHave = [];
    /** @type {Rule[]} */
    const cantHave = [];

    rows.forEach((row) => {
      const cells = row.getCells().map((cell, index) => ({ cell, index }));

      cells
        .filter(({ cell }) => cell.status === "correct")
        .map(({ cell, index }) => ({
          letter: cell.getText().toLowerCase(),
          index,
        }))
        .forEach(({ letter, index }) => {
          mustHave.push({ letter, index });
        });

      cells
        .filter(({ cell }) => cell.status === "present")
        .map(({ cell, index }) => ({
          letter: cell.getText().toLowerCase(),
          index,
        }))
        .forEach(({ letter, index }) => {
          mustHave.push({ letter, index: "?" });
          cantHave.push({ letter, index });
        });

      cells
        .filter(({ cell }) => cell.status === "absent")
        .map(({ cell }) => cell.getText().toLowerCase())
        .filter((letter) => !mustHave.some(({ letter: l }) => l === letter))
        .forEach((letter) => {
          cantHave.push({ letter, index: "?" });
        });
    });

    return { mustHave, cantHave };
  };

  /**
   * @param {string} word
   * @param {RuleSet} ruleset
   */
  const check = (word, ruleset) =>
    ruleset.mustHave.every(({ letter, index }) =>
      index === "?"
        ? word.includes(letter)
        : word[parseInt(index.toString())] === letter
    ) &&
    !ruleset.cantHave.some(({ letter, index }) =>
      index === "?"
        ? word.includes(letter)
        : word[parseInt(index.toString())] === letter
    );

  /**
   *
   * @param {string[]} words
   * @param {string[]} guesses
   * @param {RuleSet} ruleset
   */
  const getSuggestions = (words, guesses, ruleset) =>
    words
      .filter((word) => check(word, ruleset))
      .filter((word) => !guesses.includes(word));

  return {
    getNextGuess: (rows) => {
      const guesses = rows.map(row => row.getText()).filter(Boolean)
      let rules = getRules(rows);
      let suggestions = getSuggestions(
        knownWords,
        guesses,
        rules
      );

      if (!suggestions.length) {
        logAdapter.log("no known guesses!");
        return "";
      }

      if (suggestions.length <= rows.length - guesses.length) {
        logAdapter.log("almost there, picking next guess");
        return pickRandom(suggestions).element;
      }

      let iteration = 0,
        randomMustHaveRule,
        reducedMustHaveRules = [...rules.mustHave],
        narrowingRules = { cantHave: [], mustHave: [] };

      do {
        narrowingRules.cantHave = [
          ...rules.cantHave,
          ...reducedMustHaveRules.map(({ letter }) => ({ letter, index: "?" })),
        ];

        suggestions = getSuggestions(wordsWithUniqueLetters, guesses, narrowingRules);

        if (suggestions.length) {
          logAdapter.log(
            suggestions.length,
            "narrowing suggestions in iteration",
            iteration
          );
          return pickRandom(suggestions).element;
        }

        if (iteration >= 1) {
          suggestions = getSuggestions(
            wordsWithRepeatedLetters,
            guesses,
            narrowingRules
          );

          if (suggestions.length) {
            logAdapter.log(
              suggestions.length,
              "narrowing suggestions in iteration",
              iteration
            );
            return pickRandom(suggestions).element;
          }
        }

        const plucked = pluckRandom(reducedMustHaveRules);
        randomMustHaveRule = plucked.element
        reducedMustHaveRules = plucked.array

        narrowingRules.mustHave.push(randomMustHaveRule);
      } while (randomMustHaveRule && ++iteration);

      return "";
    },
  };
};

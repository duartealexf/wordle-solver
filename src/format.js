const reset = "\x1b[0m";
const bold = "\x1b[37m";
const bright = "\x1b[1m";
const greenBG = "\x1b[42m";
const orangeBG = "\x1b[43m";
const blackBG = '\x1b[40m';

/** @param {string} text */
exports.greenBG = (text) =>
  `${bold}${greenBG}${bright} ${text.toUpperCase()} ${reset}`;

/** @param {string} text */
exports.orangeBG = (text) =>
  `${bold}${orangeBG}${bright} ${text.toUpperCase()} ${reset}`;

/** @param {string} text */
exports.grayBG = (text) =>
  `${bold}${blackBG}${bright} ${text.toUpperCase()} ${reset}`;

/** @param {Row[]} rows */
exports.formatRows = (rows) =>
  rows
    .map((row) =>
      row
        .getCells()
        .map(({ status, getText }) =>
          status === "correct"
            ? this.greenBG(getText())
            : status === "present"
            ? this.orangeBG(getText())
            : this.grayBG(getText())
        )
        .join("")
    )
    .join("\n");

/**
 * Build the Wordle solver library files for each adapter.
 */

const { resolve } = require("path");
const { writeFile } = require("fs").promises;

const { adapters } = require("./build-settings");
const Board = require("./src/board");
const Solver = require("./src/solver");
const Player = require("./src/player");
const words = require("./src/words");
const utils = require("./src/utils");

const outDir = resolve(__dirname, "lib");

/**
 * @param {string} str
 * @param {number} indent
 */
const indentLines = (str, indent) => str.replace(/^/gm, " ".repeat(indent));

/**
 * @param {number} indent
 * @param {string[]} strings
 */
const buildContents = (indent, strings) =>
  strings.map((str) => indentLines(str, indent)).join("\n\n");

/**
 * @param {string} contents
 */
const wrapInSelfInvokingFunction = (contents) =>
  `(async () => {
${contents}
})();`;

/**
 * @param {string} name
 * @param {string} value
 */
const buildVariable = (name, value) => `const ${name} = ${value};`;

const build = async () => {
  await Promise.all(
    adapters.map(async ({ adapter, header }) => {
      const Adapter = require(`./src/adapters/${adapter}`);
      const adapterCode = Adapter.toString();
      const solverCode = Solver.toString();
      const playerCode = Player.toString();
      const boardCode = Board.toString();

      const outPath = resolve(outDir, `${adapter}.js`);

      let contents =
        header +
        "\n\n" +
        wrapInSelfInvokingFunction(
          buildContents(2, [
            buildVariable("allWords", JSON.stringify(words)),
            Object.entries(utils)
              .map(([constName, src]) =>
                buildVariable(constName, src.toString())
              )
              .join("\n\n"),
            buildVariable("Adapter", adapterCode),
            buildVariable("Solver", solverCode),
            buildVariable("Player", playerCode),
            buildVariable("Board", boardCode),
            buildVariable("adapter", "Adapter()"),
            buildVariable("solver", "Solver(allWords, console)"),
            buildVariable("player", "Player(solver, console)"),
            buildVariable("board", "Board(adapter)"),
            "return player.playGame(board);",
          ])
        );

      await writeFile(outPath, contents);
    })
  );

  return `Built ${adapters.length} adapters:
- ${adapters.map(({ adapter }) => adapter).join("\n- ")}`;
};

build().then(console.log).catch(console.error);

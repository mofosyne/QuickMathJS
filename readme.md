# QuickMathsJS-WebCalc (https://www.quickmathsjs.org/)
[![Node.js Test Runner](https://github.com/mofosyne/QuickMathsJS-WebCalc/actions/workflows/node.js.yml/badge.svg)](https://github.com/mofosyne/QuickMathsJS-WebCalc/actions/workflows/node.js.yml)
[![npm version](https://badge.fury.io/js/quickmathsjs.svg)](https://badge.fury.io/js/quickmathsjs)

An intuitive web-based plaintext calculator using [math.js](https://mathjs.org/). Features inline results and supports free-form calculations.

**Quick Links:**
- [**https://www.quickmathsjs.org/ Try Online Interface**](https://www.quickmathsjs.org/)
- [**Download for Offline Use**](https://github.com/mofosyne/QuickMathsJS-WebCalc/releases/latest)

## Motivation
Inspired by [SpeQ Mathematics](https://speqmath.com/), this project aims to offer an experience where all calculations feel like working within a simple text file. Two key goals drive this project:
- **Copy-Paste Integrity:** Users should be able to copy and paste calculations seamlessly.
- **Offline Usability:** The calculator should work without an internet connection, echoing the simplicity of a local app.

## Features
- Inline results: Displays results immediately after the expression.
- Variable assignments: Use variables in your calculations.
- Auto-calculation: Evaluates when you press Enter.
- Error handling: Shows inline error messages.
- CLI version available.
- Created with the combined efforts of ChatGPT and humans.

## Getting Started

### Web Version
1. **Try it Online:** [Click here](https://www.quickmathsjs.org/)
2. **Offline Version:** [Download the latest release](https://github.com/mofosyne/QuickMathsJS-WebCalc/releases/latest), extract, and open `index.html`.

## CLI Version: QuickMathsJS CLI

Note: The CLI tool is a command-line interface to use QuickMathsJS. However, if you're interested in integrating the calculation functionalities into your own Node.js applications, you can use `quickmathsjs` as an npm module. See the section below on "Using as a Node.js Module" for more details.

The CLI offers the same heuristic-based evaluation as the web interface, allowing you to naturally type in mathematical expressions without the need for special syntax.
It is perfect for users who prefer working within terminal environments or need to batch-process multiple files.

To use the CLI, first install it via npm:

```bash
npm install -g quickmathsjs
```

For more details and documentation, [check it out on npm](https://www.npmjs.com/package/quickmathsjs).

After installation, you can immediately use QuickMathsJS from the terminal:

```bash
npx quickmathsjs path/to/your/file.txt
```

This will evaluate the entire file and write the results of each calculation back into the file.

### Using `--sections` Feature

If you have files where only specific sections are meant for calculations, you can use the `--sections` flag. This flag will evaluate only the portions surrounded by the ```math delimiters:

```bash
npx quickmathsjs --sections path/to/your/file.md
```

For instance, in a document like:

    # Kibble Calc
    This calcs how much kibble we need to buy

    ```math
    CatCount = 4
    KibblePerCat = 4
    TotalKibble = CatCount * KibblePerCat
                = ?
    ```

The rest of the document can contain text, and only the section within the ```math delimiters will be evaluated.

### Launching Web Interface with `--web` Feature

If you prefer to use the web interface but have installed QuickMathsJS via npm, you can launch the web calculator interface locally:

```bash
npx quickmathsjs --web
```

This will open your default web browser with the QuickMathsJS web interface ready to use. Any file specified will be preloaded into the web interface.

```bash
npx quickmathsjs --web path/to/your/file.txt
```

**Note**: Ensure the `--web` flag is placed before specifying the file path.


## How It Works

Type your expressions. Use `=` to display results. For example:
```plaintext
a = 5
b = 7
c = a + b = ?
  = ?
1 + 1
    = ?
    c = ?
```
Output:
```plaintext
a = 5
b = 7
c = a + b = 12
    = 12
1 + 1
    = 2
    c = 12
```

Note 2 spaces and `=` to indicate we want output result.

For detailed examples, [check the full guide here](userexamples.md).

## Using as a Node.js Module

QuickMathsJS-WebCalc can also be used as an npm module in your own projects. Here's how:

### Installation

```bash
npm install quickmathsjs
```

### Usage

```js
const mathjs = require('mathjs');
const webcalc = require('./calculator.js');
global.math = mathjs;
mathContent = `
a = 5
b = 7
c = a + b = ?
  = ?
1 + 1
    = ?
    c = ?
`
mathContent = webcalc.calculate(mathContent);
console.log(mathContent);
```

### Functions

#### `webcalc.calculate(mathContent: string): string`

Calculates mathematical content within a given text and returns the result.

- `mathContent` (string): The text containing mathematical content.

Returns a string with the mathematical content replaced by their calculated results.

#### `webcalc.calculateWithMathSections(documentContent: string): string`

Calculates mathematical content within sections in a given text and replaces them with their calculated results.

- `documentContent` (string): The text containing a commonmark/markdown content with `math` marked blockquote sections.

Returns a string with the mathematical content replaced by their calculated results.


## Dev Note:

* Why is the backend CI/CD Node.js based and not deno based?
    - I've tried Deno, but it uses 'export' keyword which messes with browser syntax parsing (if module is not enabled). I could try enabling modules, but my aim is for the code to be useable without CORS being triggered... so you could use it offline without having to start a local server for it.

* For developers working on quickmathsjs, there is a built-in testing feature that can be triggered using the --test flag. This is primarily for development and CI/CD purposes.

### Tips for Developers:
- While developing or making changes, use the `npx quickmathsjs --test` flag to run the predefined test cases and ensure the core functionalities remain intact. This helps in catching any regression bugs early on.

## Contributing
Feedback, suggestions, and contributions are always appreciated. Kindly [open an issue](https://github.com/mofosyne/QuickMathsJS-WebCalc/issues) or submit a pull request.

## License
This project is under the [GNU General Public License v3.0](https://github.com/mofosyne/QuickMathsJS-WebCalc/blob/main/LICENSE).

# Quick MathJS Web Calculator (https://www.quickmathjs.com/)
[![Node.js Test Runner](https://github.com/mofosyne/QuickMathJS/actions/workflows/node.js.yml/badge.svg)](https://github.com/mofosyne/QuickMathJS/actions/workflows/node.js.yml)
[![npm version](https://badge.fury.io/js/quickmathjs.svg)](https://badge.fury.io/js/quickmathjs)

QuickMathJS is an intuitive web-based plaintext calculator powered by [math.js](https://mathjs.org/). Designed to deliver inline results, it supports free-form calculations without the fuss of special syntax. Much like how markdown mirrors the natural writing style of emails, QuickMathJS emulates the informal way people jot down mathematical expressions in everyday communications. It's math, made as simple as typing out your thoughts.

- This has also been adapted for VSCode and Codium in an extention called [QuickCalc](https://github.com/mofosyne/vscode-quickcalc)

**Quick Links:**
- [**https://www.quickmathjs.com/ Try Online Interface**](https://www.quickmathjs.com/)
- [**Download for Offline Use**](https://github.com/mofosyne/QuickMathJS/releases/latest)

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
1. **Try it Online:** [Click here](https://www.quickmathjs.com/)
2. **Offline Version:** [Download the latest release](https://github.com/mofosyne/QuickMathJS/releases/latest), extract, and open `index.html`.

## CLI Version: QuickMathJS CLI

Note: The CLI tool is a command-line interface to use QuickMathJS. However, if you're interested in integrating the calculation functionalities into your own Node.js applications, you can use `quickmathjs` as an npm module. See the section below on "Using as a Node.js Module" for more details.

The CLI offers the same heuristic-based evaluation as the web interface, allowing you to naturally type in mathematical expressions without the need for special syntax.
It is perfect for users who prefer working within terminal environments or need to batch-process multiple files.

To use the CLI, first install it via npm:

```bash
npm install -g quickmathjs
```

For more details and documentation, [check it out on npm](https://www.npmjs.com/package/quickmathjs).

After installation, you can immediately use QuickMathJS from the terminal:

```bash
npx quickmath path/to/your/file.txt
```

This will evaluate the entire file and write the results of each calculation back into the file.

### Using `--sections` Feature

If you have files where only specific sections are meant for calculations, you can use the `--sections` flag. This flag will evaluate only the portions surrounded by the ```math delimiters:

```bash
npx quickmath --sections path/to/your/file.md
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

If you prefer to use the web interface but have installed QuickMathJS via npm, you can launch the web calculator interface locally:

```bash
npx quickmath --web
```

This will open your default web browser with the QuickMathJS web interface ready to use. Any file specified will be preloaded into the web interface.

```bash
npx quickmath --web path/to/your/file.txt
```

**Note**: Ensure the `--web` flag is placed before specifying the file path.


## How It Works

For detailed examples, [check the full guide here](userexamples.md).

Type your expressions. Use `=` to display results.

**For Example:**
```plaintext
# Basic Expressions with Direct Calculation
1 + 1 = ?
  = ?

# Variable Assignment with Explicit Value Retrieval
a = 3
a: ?

# Simultaneous Assignment And Results
c = a + 3 = ?

# 2> spaces as alt method for Explicit Value Retrieval
  c = ?
```

**Output:**
```plaintext
# Basic Expressions with Direct Calculation
1 + 1 = 2
  = 2

# Variable Assignment with Explicit Value Retrieval
a = 3
a: 3

# Simultaneous Assignment And Results
c = a + 3 = 6

# 2> spaces as alt method for Explicit Value Retrieval
  c = 6
```

Note 2 spaces and `=` to indicate we want output result.

### Detailed Examples

1. **Currency Conversions** : QuickMathJS allows for intuitive currency conversions using custom pair ratios. This can also be extended to other types of custom ratios.
1. **Unit Conversion and Mathematical Expressions** : Leverage the power of Math.js to convert between units seamlessly and evaluate complex expressions.
1. **Custom Functions** : Users can define custom functions and evaluate them with specific arguments. This allows for a reusable approach to complex calculations.
1. **Phrases as Variables** : Beyond traditional variable names, QuickMathJS supports using sentences as variable names. Just ensure they don't conflict with reserved keywords in Math.js.
1. **Custom Units and Compound Calculations** : Define your own custom units and perform arithmetic operations with them, even allowing for compound calculations.

```math
# Custom Pair Ratios (e.g. Currency Conversion and Arithmetic with Defined Exchange Rate)
EUR/USD = 1.2
a = 2 USD
b = 2.4 EUR
c = a + 2 * b = 6 USD
a + b in EUR : 4.8 EUR
total = a + c
total in EUR: 9.6 EUR

# Unit Conversion with Math.js
length = 5.08 cm + 2 inch = 10.16 cm
length in cm to inch = 4 inch

# Evaluating Mathematical Expressions
1.2 / (3.3 + 1.7) = 0.24
sin(90 deg) = 1

# Defining and Evaluating Custom Functions
f(x, y) = x ^ y
f(2, 3) = 8

# Phrase As Variabes
Per Person Delivery = 11
People Count = 23
Delivery = 12
Total Food Price = Per Person Delivery * People Count = 253
Total Price = Total Food Price + Delivery = 265
Total Price: 265

# Custom Units
pitbull dogs = 234 fancy animals
flowery cats = 423 fancy animals
animal count = pitbull dogs + flowery cats
animal count: 657 fancy animals
animal count = pitbull dogs * flowery cats
animal count: 98982 fancyanimals^2
```

## Using as a Node.js Module

QuickMathJS can also be used as an npm module in your own projects. Here's how:

### Installation

```bash
npm install quickmathjs
```

### Usage

```js
const mathjs = require('mathjs');
const webcalc = require('./calculator.js')(mathjs);
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

* For developers working on quickmathjs, there is a built-in testing feature that can be triggered using the --test flag. This is primarily for development and CI/CD purposes.

### Tips for Developers:
- While developing or making changes, use the `npx quickmathjs --test` flag to run the predefined test cases and ensure the core functionalities remain intact. This helps in catching any regression bugs early on.

## Contributing
Feedback, suggestions, and contributions are always appreciated. Kindly [open an issue](https://github.com/mofosyne/QuickMathJS/issues) or submit a pull request.

## License
This project is under the [GNU General Public License v3.0](https://github.com/mofosyne/QuickMathJS/blob/main/LICENSE).

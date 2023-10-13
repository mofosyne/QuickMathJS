
# QuickMathsJS-WebCalc
[![Node.js Test Runner](https://github.com/mofosyne/QuickMathsJS-WebCalc/actions/workflows/node.js.yml/badge.svg)](https://github.com/mofosyne/QuickMathsJS-WebCalc/actions/workflows/node.js.yml)
[![npm version](https://badge.fury.io/js/quickmathsjs.svg)](https://badge.fury.io/js/quickmathsjs)

An intuitive web-based calculator using [math.js](https://mathjs.org/). Features inline results and supports free-form calculations. Additionally comes with a CLI for testing.

**Quick Links:**
- [**Demo Online**](https://mofosyne.github.io/QuickMathsJS-WebCalc/)
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
1. **Try it Online:** [Click here](https://mofosyne.github.io/QuickMathsJS-WebCalc/)
2. **Offline Version:** [Download the latest release](https://github.com/mofosyne/QuickMathsJS-WebCalc/releases/latest), extract, and open `index.html`.

## CLI Version: QuickMathsJS CLI

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

    c = ?
```
Output:
```plaintext
a = 5
b = 7
c = a + b = 12
    = 12

    c = 12
```

Note 4 spaces and `=` to indicate we want output result.

For detailed examples, [check the full guide here](userexamples.md).


## Dev Note:

* Why is the backend CI/CD Node.js based and not deno based?
    - I've tried Deno, but it uses 'export' keyword which messes with browser syntax parsing (if module is not enabled). I could try enabling modules, but my aim is for the code to be useable without CORS being triggered... so you could use it offline without having to start a local server for it.

### Tips for Developers:
- While developing or making changes, use the `npx quickmathsjs --test` flag to run the predefined test cases and ensure the core functionalities remain intact. This helps in catching any regression bugs early on.

## Contributing
Feedback, suggestions, and contributions are always appreciated. Kindly [open an issue](https://github.com/mofosyne/QuickMathsJS-WebCalc/issues) or submit a pull request.

## License
This project is under the [GNU General Public License v3.0](https://github.com/mofosyne/QuickMathsJS-WebCalc/blob/main/LICENSE).

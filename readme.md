# QuickMathsJS-WebCalc : Quick MathJS Web Calculator

[![Node.js Test Runner](https://github.com/mofosyne/QuickMathsJS-WebCalc/actions/workflows/node.js.yml/badge.svg)](https://github.com/mofosyne/QuickMathsJS-WebCalc/actions/workflows/node.js.yml)

* [Click Here To Try Out](https://mofosyne.github.io/QuickMathsJS-WebCalc/)
* [Click Here to head to download for offline use](https://github.com/mofosyne/QuickMathsJS-WebCalc/releases/latest)

A simple web-based calculator harnessing the power of math.js for intuitive free-form calculations. Now with a command-line interface (CLI) for testing purposes.

The calculator's main feature is the use of huruestic to guess if `=` is an inline notation to display the result of a calculation immediately after the expression, eliminating the need for a separate results area.

Created with the assistance of ChatGPT and human supervision.

## Motivation

The reason I created this project was because I used [SpeQ Mathematics](https://speqmath.com/) and I really like how everything is just a text file in this calculator.

Hence one requirement for any contribution/improvements to this project is that users must be able to always copy and paste the calcuation and it's results.

Also this project must always be usable without internet, so you can download it and use it as if it's a local app.
[Click Here to head to the latest release](https://github.com/mofosyne/QuickMathsJS-WebCalc/releases/latest) and then download the source code and double click on `index.html` to start the app.

## Examples And Usage

Below are a few ways you can utilize this calculator:

```plaintext
a = 5
b = 7
a + b = 
```

After pressing `Enter` at the end of the `a + b =` line, you will see:

```plaintext
a = 5
b = 7
a + b = 12
```

Variables are maintained in memory:

```plaintext
a = 5
b = 7
c = a + b
c * 2 =
```
This will evaluate to:

```plaintext
a = 5
b = 7
c = a + b
c * 2 = 24
```

You can also use more complex expressions:

```plaintext
a = 5
b = 7
sqrt(a^2 + b^2) =
```

After evaluation:

```plaintext
a = 5
b = 7
sqrt(a^2 + b^2) = 8.602325267042627
```

Errors in your math expression will be indicated inline:

```plaintext
1/0 =
```

Displays:

```plaintext
1/0 = Error: Division by zero
```

By pressing `Enter` at the beginning of a line, you can add a new line. If you press `Enter` immediately after a `=`, the calculator will evaluate the expression and display or update the result inline.

Feel free to play around and explore more functionalities!

[For the full guide click here](userexamples.md)


### Using Placeholders:

QuickMathsJS-WebCalc supports the optional use of `?` as a placeholder. This can be used in assignments when the value is unspecified or directly after an `=` to request a computation result.

For instance:

- Using `?` in assignment:
  
  ```plaintext
  a = ?
  b = 5
  c = a + b =
  ```

  Result:
  
  ```plaintext
  a = ?
  b = 5
  c = a + b = Error: Undefined symbol a
  ```

- Using `?` to request computation:

  ```plaintext
  a = 1
  b = 5
  c = a + b = ?
  ```

  Result:
  
  ```plaintext
  a = 1
  b = 5
  c = a + b = 6
  ```


## Features

- Evaluates mathematical expressions with = and displays results inline.
- Assigns variable values with = and reuses them in subsequent lines.
- Auto-calculation upon pressing Enter.
- Error messages displayed inline for incorrect expressions.
- Smart cursor handling for a more intuitive user experience.

## Setup & Usage

- Opening the Calculator:
    - Simply open the index.html file in your preferred web browser.

- Usage:
    - Type mathematical expressions in the provided textarea.
    - To assign a value to a variable, use the format: a = 5.
    - To evaluate an expression, write it and append with = and then press Enter.
    - For example: a * 2 =
    - The result of the calculation will be displayed immediately after the =.
    - If there's an error in your expression, an error message will be displayed inline.
    - Press Enter at the beginning of a line to start a new line.
    - Press Enter at the end of a line with = to re-evaluate the expression and update the result.

---

## Quick Start for CLI

The CLI offers the same heuristic-based evaluation as the web interface, allowing you to naturally type in mathematical expressions without the need for special syntax.
For those who prefer the command line, `cli.js` is ready for action. Here's a quick guide:

### 1. Setup:

Ensure Node.js is installed on your machine. If not, grab it from the official [Node.js website](https://nodejs.org/).

### 2. Installation:

Navigate to the `QuickMathsJS-WebCalc` directory:

```bash
cd path/to/QuickMathsJS-WebCalc
```

Install the necessary packages:

```bash
npm install
```

To get usage reminder help:

```bash
node cli.js --help
```

### 3. Using the Calculator:

To evaluate expressions within a file:

```bash
node cli.js path/to/your/file.txt
```

To start the calculator in web mode:

```bash
node cli.js --web path/to/your/file.txt
```

**Note**: Ensure the `--web` flag is placed before specifying the file path.

If you only want to evaluate sections delimited by the ````math` marker, use the `--sections` flag:

```bash
node cli.js --sections path/to/your/file.txt
```

e.g. This document is recalculated when `node cli.js kibble.md --sections` is used

    # Kibble Calc
    This calcs how much kibble we need to buy

    ```math
    CatCount = 4
    KibblePerCat = 4
    TotalKibble = CatCount * KibblePerCat = 16
    ```

    Good luck!


### 4. Running Tests (For Developers):

Run predefined test cases from `userexamples.md`:

```bash
node cli.js --test
```

Alternatively:

```bash
npm ci
npm test
```


## Dependencies

    math.js: A comprehensive mathematics library for JavaScript and Node.js.

## Dev Note:

* Why is the backend CI/CD Node.js based and not deno based?
    - I've tried Deno, but it uses 'export' keyword which messes with browser syntax parsing (if module is not enabled). I could try enabling modules, but my aim is for the code to be useable without CORS being triggered... so you could use it offline without having to start a local server for it.

## Contributing

Feedback and contributions are welcome! Please open an issue or submit a pull request if you have suggestions or improvements.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

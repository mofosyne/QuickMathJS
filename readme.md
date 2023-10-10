# QuickMathsJS-WebCalc : Quick MathJS Web Calculator

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

## Examples

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


## Quick Start for CLI

The CLI offers the same heuristic-based evaluation as the web interface, so you can naturally type in mathematical expressions without the need for special syntax.
If you prefer to use the calculator functionalities from the command line, `cli.js` is available for you! Here's a quick guide to get you started:

### 1. Setup:

Ensure you have Node.js installed on your machine. If not, you can download and install it from the official [Node.js website](https://nodejs.org/).

### 2. Installation:

Navigate to the `QuickMathsJS-WebCalc` directory:

```bash
cd path/to/QuickMathsJS-WebCalc
```

Then, install the necessary packages:

```bash
npm install
```

### 3. Using the Calculator:

To process a file and evaluate expressions within it, use:

```bash
node cli.js path/to/your/file.txt
```

### 4. Running Tests (For Developers):

To run predefined test cases defined in `userexample.md`:

```bash
node cli.js --test
```

or use 

```
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

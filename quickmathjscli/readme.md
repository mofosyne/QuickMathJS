# MathJS CLI Calculator

A simple CLI application that reads mathematical expressions from a file, evaluates them using MathJS, and then overwrites the same file with the results.

This is based off QuickMathJS WebCalc, but simplified for cli purpose.

## Requirements

- Node.js

## Dependencies

This project utilizes the following dependencies:

- `mathjs`: A comprehensive mathematics library for JavaScript and Node.js.

You can install all dependencies by running:

```
npm install
```

## Usage

1. Make sure you have Node.js and npm installed.
2. Navigate to the project directory.
3. Install the dependencies using `npm install`.
4. Run the CLI calculator:

```bash
node quickmathjscli.js path/to/your/input.txt
```

Replace `path/to/your/input.txt` with the path to your actual input file. The CLI application will then read the content of the file, perform the calculations, and overwrite the input file with the new content.

### Input File Format

The input file should contain one mathematical expression per line. For expressions you want to evaluate and replace, use the `:=` operator. For example:

```plaintext
a = 5
b = 7
a + b := 
```

After running the CLI calculator, the content of the input file will be updated to:

```plaintext
a = 5
b = 7
a + b := 12
```

## Contributing

Feedback and contributions are welcome! Please open an issue or submit a pull request if you have suggestions or improvements.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

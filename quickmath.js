#!/usr/bin/env node
/*
    QuickMathsJS-WebCalc An intuitive web-based calculator using math.js. Features inline results and supports free-form calculations.
    Copyright (C) 2023  Brian Khuu

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const fs = require('fs');
const mathjs = require('mathjs');
const webcalc = require('./calculator.js')(mathjs);
const open = require('opn');
const express = require('express');
const zlib = require('zlib');
const path = require('path');
const { version } = require('./package.json');

function calculateFileContent(content, useSections = false) {
  if (useSections) {
    return webcalc.calculateWithMathSections(content);
  } else {
    return webcalc.calculate(content);
  }
}

function processFile(filePath, useSections, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
    const updatedContent = calculateFileContent(data, useSections);
    callback(filePath, updatedContent);
  });
}

/******************************************************************************
 * TESTING
 */

function processTests(tests, testCaseFilePath) {
  let failures = 0;

  tests.forEach((test, index) => {
      const result = calculateFileContent(test.given);
      if (result === test.expect) {
          console.log(`Test ${index + 1} (${test.name}): PASS`);
      } else {
          console.log(`Test ${index + 1} (${test.name}): FAIL`);
          console.log('Given:\n', test.given);
          console.log('Expected:\n', test.expect);
          console.log('Got:\n', result);
          failures++;
      }
  });

  return failures;
}

// This has before and after cases (good for checking replacement test examples)
function runFullTestCase(testCaseFilePath) {
  const fullPath = path.join(__dirname, testCaseFilePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const regex = /^#+ (.*?)\n(?:[^#]*?)\*\*(?:For Example|Input|Given):\*\*\n```(?:.*?)\n([\s\S]+?)\n```\n\n\*\*(?:Result|Output|Expect):\*\*\n```(?:.*?)\n([\s\S]+?)\n```$/gm;
  const tests = [];
  console.log(`FULL TEST CASE FILE: ${testCaseFilePath}`);
  let match;
  while ((match = regex.exec(content)) !== null) {
      tests.push({
          name: match[1],
          given: match[2],
          expect: match[3]
      });
  }

  return processTests(tests, testCaseFilePath);
}

// This has simple cases (e.g. results already present examples)
function runMathBlockTestCase(testCaseFilePath) {
  const fullPath = path.join(__dirname, testCaseFilePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const regex = /^#+ (.*?)\n(?:[^#]*?)^```math(?:.*?)\n([\s\S]+?)\n^```$/gm;
  const tests = [];

  console.log(`BLOCK TEST CASE FILE: ${testCaseFilePath}`);

  let match;
  while ((match = regex.exec(content)) !== null) {
      tests.push({
          name: match[1],
          given: match[2],
          expect: match[2]
      });
  }

  return processTests(tests, testCaseFilePath);
}

function runDelimTests() {
  // Test for the math delimiter feature
  let failures = 0;

  /**
   * Tagged template function to remove common indentation from template literals.
   * This allows for cleaner code formatting without affecting the string's actual content.
   * 
   * @param {Array<string>} strings - The static parts of the template literal.
   * @param {...any} values - The interpolated values within the template literal.
   * @return {string} - The processed string with common indentation removed.
   */
  function stripIndent(strings, ...values) {
    // Combine the strings and values back into the full string
    const fullString = strings.reduce((acc, str, i) => `${acc}${str}${values[i] || ''}`, '');
    // Find the common indentation at the beginning of each line
    const match = fullString.match(/^[ \t]*(?=\S)/gm);
    if (!match) return fullString;
    // Calculate the amount of indentation to remove
    const indent = Math.min(...match.map(el => el.length));
    // Create a regular expression to remove the common indentation
    const regexp = new RegExp(`^[ \\t]{${indent}}`, 'gm');
    // Return the string with the common indentation removed
    return indent > 0 ? fullString.replace(regexp, '') : fullString;
  }

  const mockContent = stripIndent`
    This is a sample content.

    \`\`\`math
    1 + 1 = ?
    \`\`\`


    \`\`\`math
    1 + 1 = ?
    1 + 1 = ?
    \`\`\`

    \`\`\`math {id = "testid"}
    1 + 1 = ?
    1 + 1 = ?
    \`\`\`

    \`\`\`math
    1 + 1 = ?
    1 + 1 = ?
    \`\`\`

    This should remain unchanged.

        \`\`\`math
        1 + 1 = 
        \`\`\`

    This should also remain unchanged.`;
  
  const expectedContent = stripIndent`
    This is a sample content.

    \`\`\`math
    1 + 1 = 2
    \`\`\`


    \`\`\`math
    1 + 1 = 2
    1 + 1 = 2
    \`\`\`

    \`\`\`math {id = "testid"}
    1 + 1 = 2
    1 + 1 = 2
    \`\`\`

    \`\`\`math
    1 + 1 = 2
    1 + 1 = 2
    \`\`\`

    This should remain unchanged.

        \`\`\`math
        1 + 1 = 
        \`\`\`

    This should also remain unchanged.`;

  const mathDelimiterResult = calculateFileContent(mockContent, true);
  if (mathDelimiterResult.trim() === expectedContent.trim()) {
      console.log(`Math delimiter test: PASS`);
  } else {
      console.log(`Math delimiter test: FAIL`);
      console.log('Expected:\n', expectedContent);
      console.log('Got:\n', mathDelimiterResult);
      failures++;
  }
  return failures;
}

function runTests() {
    let failures = runDelimTests();
    failures += failures > 0 ? failures : runMathBlockTestCase('readme.md');
    failures += failures > 0 ? failures : runFullTestCase('readme.md');
    failures += failures > 0 ? failures : runFullTestCase('userexamples.md');
    failures += failures > 0 ? failures : runFullTestCase('testcases_basics.md');
    failures += failures > 0 ? failures : runFullTestCase('testcases_advance.md');
    failures += failures > 0 ? failures : runFullTestCase('testcases_constants.md');
    failures += failures > 0 ? failures : runFullTestCase('testcases_errors_and_edgecases.md');
    if (failures > 0) {
        console.error(`Failed ${failures} test(s). Exiting.`);
        process.exit(1);
    } else {
      console.error(`All test passed. Exiting.`);
    }
}


/******************************************************************************
 * CLI
 */

// Initialise webcalc internals
webcalc.initialise();

// Check for command line flags
const useSectionsFlag = '--sections';
const testFlag = '--test';
const helpFlag = '--help';
const webFlag = '--web';
const versionFlag = '--version';

function displayHelp() {
  console.log(`
Usage: quickmath [OPTIONS] [FILE]

Options:
  --help        Show this help message and exit.
  --version     Display the current version of QuickMathsJS.
  --sections    Evaluate only sections surrounded by the \`\`\`math delimiter.
  --web         Launch the web interface.
  --test        Run predefined test cases.

Examples:
  quickmath --help                           Show this help message and exit.
  quickmath --version                        Display the current version.
  quickmath path/to/your/file.txt            Evaluate entire file.
  quickmath --sections path/to/your/file.txt Evaluate only math sections in file.
  quickmath --web path/to/your/file.txt      Launch the web interface and load entire file.
  quickmath --test                           Run predefined test cases.
`);
}



function displayVersion() {
  console.log(`QuickMathsJS version: ${version}`);
}

if (process.argv.includes(helpFlag)) {
    displayHelp();
} else if (process.argv.includes(versionFlag)) {
    displayVersion();
} else if (process.argv.includes(testFlag)) {
    runTests();
} else if (process.argv.includes(webFlag)) {
  const app = express();
  const port = 3000;

  // Serve static files from the root directory
  app.use(express.static(__dirname));

  const launchURL = async () => {
    let url = `http://localhost:${port}`;
    if (process.argv.length > 3) {
        const filePath = process.argv[3];
        try {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            const compressed = zlib.gzipSync(fileContent).toString('base64');
            url += `#${compressed}`;
        } catch (err) {
            console.error("Error reading the file:", err);
            process.exit(1);
        }
    }
    open(url);
  };

  app.listen(port, () => {
    console.log(`QuickMathsJS-WebCalc is running at http://localhost:${port}`);
    launchURL();
  });
} else {
    if (process.argv.length < 3) {
        console.error("Please provide a path to the input file or use --help for more options.");
        displayHelp();
        process.exit(1);
    }

    const filePath = process.argv[2];
    const useSections = process.argv.includes(useSectionsFlag);

    processFile(filePath, useSections, (path, updatedContent) => {
        fs.writeFile(path, updatedContent, (err) => {
            if (err) {
                console.error("Error writing to the file:", err);
                return;
            }
            console.log("File updated successfully!");
        });
    });
}

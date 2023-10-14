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
const webcalc = require('./calculator.js');
const open = require('opn');
const express = require('express');
const zlib = require('zlib');
const path = require('path');
const { version } = require('./package.json');

global.math = mathjs;

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

function runTestCaseFile(testCaseFilePath) {
  const fullPath = path.join(__dirname, testCaseFilePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const regex = /### (.+?)\n\*\*Given:\*\*\n```\n([\s\S]+?)\n```\n\n\*\*Expect:\*\*\n```\n([\s\S]+?)\n```/g;
  const tests = [];

  console.log(`TEST CASE FILE: ${testCaseFilePath}`);


  let match;
  while ((match = regex.exec(content)) !== null) {
      tests.push({
          name: match[1],
          given: match[2],
          expect: match[3]
      });
  }

  let failures = 0;

  // Test the calculate function with each test case
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

function runDelimTests() {
    // Test for the math delimiter feature
    let failures = 0;
    const mockContent = 
    'This is a sample content.\n' +
    '\n' +
    '```math\n' +
    '1 + 1 = \n' +
    '```\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '```math\n' +
    '1 + 1 =\n' +
    '1 + 1 = \n' +
    'a = 1\n' +
    'a + 1 = 1\n' +
    '```\n' +
    '\n' +
    '```math\n' +
    '1 + 1 = \n' +
    '1 + 1 = 5\n' +
    '```\n' +
    '\n' +
    '```math\n' +
    '1 + 1\n' +
    '1 + 1 = \n' +
    '1 + 1 = \n' +
    '```\n' +
    '\n' +
    'This should remain unchanged.\n';

    const expectedContent = 
    'This is a sample content.\n' +
    '\n' +
    '```math\n' +
    '1 + 1 = 2\n' +
    '```\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '```math\n' +
    '1 + 1 = 2\n' +
    '1 + 1 = 2\n' +
    'a = 1\n' +
    'a + 1 = 2\n' +
    '```\n' +
    '\n' +
    '```math\n' +
    '1 + 1 = 2\n' +
    '1 + 1 = 2\n' +
    '```\n' +
    '\n' +
    '```math\n' +
    '1 + 1\n' +
    '1 + 1 = 2\n' +
    '1 + 1 = 2\n' +
    '```\n' +
    '\n' +
    'This should remain unchanged.\n';

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
    let failures = 0;
    failures += runTestCaseFile('testcases.md');
    failures += runTestCaseFile('userexamples.md');
    failures += runDelimTests();

    // If there are any failed tests, exit with a non-zero code.
    if (failures > 0) {
        console.error(`Failed ${failures} test(s). Exiting.`);
        process.exit(1);
    }
    else
    {
      console.error(`All test passed. Exiting.`);
    }
}


/******************************************************************************
 * CLI
 */

// Check for command line flags
const useSectionsFlag = '--sections';
const testFlag = '--test';
const helpFlag = '--help';
const webFlag = '--web';
const versionFlag = '--version';

function displayHelp() {
  console.log(`
Usage: quickmathsjs [OPTIONS] [FILE]

Options:
  --help        Show this help message and exit.
  --version     Display the current version of QuickMathsJS.
  --sections    Evaluate only sections surrounded by the \`\`\`math delimiter.
  --web         Launch the web interface.
  --test        Run predefined test cases.

Examples:
  quickmathsjs --help                           Show this help message and exit.
  quickmathsjs --version                        Display the current version.
  quickmathsjs path/to/your/file.txt            Evaluate entire file.
  quickmathsjs --sections path/to/your/file.txt Evaluate only math sections in file.
  quickmathsjs --web path/to/your/file.txt      Launch the web interface and load entire file.
  quickmathsjs --test                           Run predefined test cases.
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

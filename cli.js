#!/usr/bin/env node
const fs = require('fs');
const mathjs = require('mathjs');
const webcalc = require('./calculator.js');

global.math = mathjs;

function calculateFileContent(content, useSections = false) {
  if (useSections) {
    const mathSectionRegex = /```math\n([\s\S]+?)\n```/g;

    return content.replace(mathSectionRegex, (match, mathContent) => {
      const result = webcalc.calculate(mathContent.trim());
      return '```math\n' + result + '\n```';
    });
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

function runTests() {
    const content = fs.readFileSync('userexamples.md', 'utf-8');
    
    const regex = /### (.+?)\ngiven:\n```\n([\s\S]+?)\n```\n\nexpect:\n```\n([\s\S]+?)\n```/g;

    const tests = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        tests.push({
            name: match[1].trim(),
            given: match[2].trim(),
            expect: match[3].trim()
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
            console.log('Expected:', test.expect);
            console.log('Got:', result);
            failures++;
        }
    });

    // Test for the math delimiter feature
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
        console.log('Expected:', expectedContent);
        console.log('Got:', mathDelimiterResult);
        failures++;
    }

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


// Check for command line flags
const useSectionsFlag = '--sections';
const testFlag = '--test';
const helpFlag = '--help';
const helpShortFlag = '-h';

function displayHelp() {
    console.log(`
Usage: node cli.js [OPTIONS] [FILE]

Options:
  --help        Show this help message and exit.
  --sections    Evaluate only sections surrounded by the \`\`\`math delimiter.
  --test        Run predefined test cases from userexamples.md.

Examples:
  node cli.js path/to/your/file.txt           Evaluate entire file.
  node cli.js --sections path/to/your/file.txt Evaluate only math sections in file.
  node cli.js --test                          Run predefined test cases.
    `);
}

if (process.argv.includes(helpFlag)) {
    displayHelp();
} else if (process.argv.includes(testFlag)) {
    runTests();
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

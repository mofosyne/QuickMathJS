const fs = require('fs');
const mathjs = require('mathjs');
const webcalc = require('./calculator.js');

global.math = mathjs;

function calculateFileContent(content) {
  return webcalc.calculate(content);
}

function processFile(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
    const updatedContent = calculateFileContent(data);
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
        const result = webcalc.calculate(test.given);
        if (result === test.expect) {
            console.log(`Test ${index + 1} (${test.name}): PASS`);
        } else {
            console.log(`Test ${index + 1} (${test.name}): FAIL`);
            console.log('Expected:', test.expect);
            console.log('Got:', result);
            failures++;
        }
    });

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

// Check if the --test flag is passed
if (process.argv.includes('--test')) {
  runTests();
} else {
  if (process.argv.length < 3) {
    console.error("Please provide a path to the input file.");
    process.exit(1);
  }

  const filePath = process.argv[2];
  processFile(filePath, (path, updatedContent) => {
    fs.writeFile(path, updatedContent, (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
        return;
      }
      console.log("File updated successfully!");
    });
  });
}

const fs = require('fs');
const mathjs = require('mathjs');
const webcalc = require('./calculator.js');  // Using Node.js require

global.math = mathjs;

function runTests() {
    const content = fs.readFileSync('userexample.md', 'utf-8');
    
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

    // Test the calculate function with each test case
    tests.forEach((test, index) => {
        const result = webcalc.calculate(test.given);
        if (result === test.expect) {
            console.log(`Test ${index + 1} (${test.name}): PASS`);
        } else {
            console.log(`Test ${index + 1} (${test.name}): FAIL`);
            console.log('Expected:', test.expect);
            console.log('Got:', result);
        }
    });
}

runTests();

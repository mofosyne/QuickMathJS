const fs = require('fs');
const math = require('mathjs');

function calculate(inputString) {
    const lines = inputString.split('\n');
    let newContent = "";
    const scope = {};

    for (const line of lines) {
        try {
            if (line.includes(":=")) {
                const expression = line.split(":=")[0].trim();
                const evaluated = math.evaluate(expression, scope);
                newContent += `${expression} := ${evaluated}\n`;
            } else {
                math.evaluate(line, scope);  // Evaluate to update the scope but no need for result
                newContent += `${line}\n`;
            }
        } catch (e) {
            if (line.includes(":=")) {
                newContent += `${line} Error: ${e.message}\n`;
            } else {
                newContent += `${line}\n`;
            }
        }
    }

    return newContent;
}

if (process.argv.length < 3) {
    console.error("Please provide a path to the input file.");
    process.exit(1);
}

const filePath = process.argv[2];

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    const updatedContent = calculate(data);
    
    fs.writeFile(filePath, updatedContent, (err) => {
        if (err) {
            console.error("Error writing to the file:", err);
            return;
        }
        console.log("File updated successfully!");
    });
});


// Universal module definition (UMD) for webcalc
(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        // Node/CommonJS
        // Assign the factory function's result to module.exports
        module.exports = factory();
    } else {
        // Browser Globals
        global.webcalc = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    // Your library code here
    const calculator = {
        calculate(incomingContent) {
            // Retrieve the content of the input textarea
            const lines = incomingContent.split('\n');  // Use cached content for calculations
            let newContent = "";
            
            // `scope` will be used to keep track of variable values as they're declared
            const scope = {};
            
            // Iterate through each line in the textarea
            for (const line of lines) {
                // Split each line by '=' to determine its structure
                const parts = line.split('=').map(str => str.trim());

                try {
                    // Handling lines with only one '='
                    if (parts.length === 2) {
                        const [leftSide, rightSide] = parts;

                        // Case: Pure Mathematical Expression (e.g., "5 + 3 =")
                        if (!rightSide) {
                            const evaluated = math.evaluate(leftSide, scope);
                            // Error handling for division by zero, as JavaScript will return Infinity
                            if (evaluated === Infinity) {
                                throw new Error("Division by zero");
                            }
                            newContent += `${leftSide} = ${evaluated}\n`;
                        } 
                        // Case: Variable Assignment (e.g., "a = 4")
                        else if (/^[a-zA-Z_]\w*$/.test(leftSide)) {  
                            const evaluated = math.evaluate(rightSide, scope);
                            // Error handling for division by zero, as JavaScript will return Infinity
                            if (evaluated === Infinity) {
                                throw new Error("Division by zero");
                            }
                            scope[leftSide] = evaluated;  // Assign value to the variable in `scope`
                            newContent += `${leftSide} = ${evaluated}\n`;
                        } 
                        // Case: Mathematical Expression with provided result (e.g., "5 + 3 = 8")
                        else {
                            const evaluated = math.evaluate(leftSide, scope);
                            // Error handling for division by zero, as JavaScript will return Infinity
                            if (evaluated === Infinity) {
                                throw new Error("Division by zero");
                            }
                            newContent += `${leftSide} = ${evaluated}\n`;
                        }
                    } 
                    // Handling lines with multiple '='
                    else if (parts.length > 2) {
                        const variables = parts.slice(0, -2);  // All parts before the last 2 are considered as potential variables
                        const expression = parts[parts.length - 2];
                        const expectedValue = parts[parts.length - 1];
                        
                        // Check if all the parts before the last 2 are valid variable names
                        const allAreVariables = variables.every(part => /^[a-zA-Z_]\w*$/.test(part));

                        if (allAreVariables) {
                            const evaluated = math.evaluate(expression, scope);

                            // Error handling for division by zero, as JavaScript will return Infinity
                            if (evaluated === Infinity) {
                                throw new Error("Division by zero");
                            }
                            
                            // Assign the evaluated value to all the variables
                            for (let variable of variables) {
                                scope[variable] = evaluated;
                            }
                            
                            // Construct the output line
                            let outputLine = variables.join(' = ') + ' = ' + expression;

                            if (expectedValue) {
                                // If the expected value matches the evaluated value, use it
                                if (parseFloat(expectedValue) === evaluated) {
                                    outputLine += ' = ' + expectedValue;
                                } else {  // Otherwise, replace with the correct evaluated value
                                    outputLine += ' = ' + evaluated;
                                }
                            } else {
                                outputLine += ' = ' + evaluated;
                            }

                            newContent += outputLine + '\n';
                        } else {
                            newContent += line + '\n';  // If not a valid multi-variable assignment, keep the line unchanged
                        }
                    }
                    // Any other line format remains unchanged
                    else {
                        newContent += `${line}\n`;
                    }
                } catch (e) {  
                    // Extract the undefined symbol name from the error message
                    const undefinedSymbolMatch = e.message.match(/Undefined symbol (\w+)/);

                    // If line already has an "Error:" substring, replace it with the new error
                    if (undefinedSymbolMatch) {
                        const undefinedSymbol = undefinedSymbolMatch[1];
                        newContent += `${line} Error: Undefined symbol ${undefinedSymbol}\n`;
                    } else if (line.includes("Error:")) {
                        const errorStartIndex = line.indexOf("Error:");
                        newContent += line.substring(0, errorStartIndex) + `Error: ${e.message}\n`;
                    } else {
                        // Otherwise, append the new error
                        newContent += `${line} Error: ${e.message}\n`;
                    }
                }
            }

            return newContent.trim();
        }

    };
    
    return calculator;
}));

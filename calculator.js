
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
        totalCalculations: 0,  // Number of lines where calculations are performed
        totalResultsProvided: 0,  // Number of lines with results provided
        calculate(incomingContent) {

            /**
             * Determines if the provided string is a valid variable name.
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is a valid variable name, otherwise false.
             */
            function isVariable(str) {
                return /^[a-zA-Z_]\w*$/.test(str);
            }

            /**
             * Determines if the provided string represents a valid number (integer or floating point).
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is a valid number, otherwise false.
             */
            function isNumber(str) {
                return /^-?\d+(\.\d+)?$/.test(str);
            }

            /**
             * Determines if the provided string represents a basic arithmetic expression.
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is a basic arithmetic expression, otherwise false.
             */
            function isExpression(str) {
                // Check for presence of arithmetic operators to distinguish between simple variables and expressions
                return /[\+\-\*\/\(\)]/.test(str);
            }

            /**
             * Determines if the provided string represents an empty slot
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is a basic arithmetic expression, otherwise false.
             */
            function isEmpty(str) {
                return str === "";
            }

            // Preprocess to remove any existing "Error:"
            const cleanedLines = incomingContent.split('\n').map(line => {
                const errorIndex = line.indexOf("Error:");
                if (errorIndex !== -1) {
                    return line.substring(0, errorIndex).trim();
                }
                return line;
            });
            const cleanedContent = cleanedLines.join('\n');
            const lines = cleanedContent.split('\n');

            let newContent = "";

            this.totalCalculations = 0;
            this.totalResultsProvided = 0;

            // `scope` will be used to keep track of variable values as they're declared
            let scope = {};

            // Iterate through each line in the textarea
            for (const line of lines) {
                try {
                    if (line.trim() === '') {
                        newContent += `${line}\n`;
                        continue;
                    }
                    // Split each line by '=' to determine its structure
                    const parts = line.split('=');

                    // This is the last two part of the line used for huriestics matching of expression type
                    const lastTwoParts = parts.slice(-2).map(str => str.trim());
                    leftPart = lastTwoParts[0];
                    rightPart = lastTwoParts[1];

                    // If the second last segment is a number and the last segment is empty (i.e., line ends with '='),
                    // then remove the trailing '='
                    if (isNumber(leftPart) && isEmpty(rightPart)) {
                        parts.pop();
                        const lastTwoParts = parts.slice(-2).map(str => str.trim());
                        leftPart = lastTwoParts[0];
                        rightPart = lastTwoParts[1];
                    }
                    //console.log(parts)

                    // A version of the line but where all part of the expression except for the last part is kept
                    // This will be used if the last part is replaced with the result
                    const allButLast = parts.slice(0, -1).join('=').trim();

                    // Handling lines with minimum of one '='
                    if (parts.length >= 2) {
                        evaluated = rightPart;
                        this.totalCalculations++;
                        //console.log("Initial Scope:", scope);
                        if (isExpression(leftPart) && (isNumber(rightPart) || isEmpty(rightPart))) {
                            // Case: Pure Mathematical Expression (e.g., "5 + 3 =")
                            //console.log("Pure Mathematical Expression:", line);
                            evaluated = math.evaluate(allButLast, scope);
                            this.totalResultsProvided++;
                            // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                            if (evaluated === Infinity) {
                                throw new Error("Infinity. Possible Division by zero");
                            }
                            newContent += `${allButLast} = ${evaluated}\n`;
                        } else if (isVariable(leftPart) && (isExpression(rightPart) || isNumber(rightPart))) {
                            // Case: Variable Assignment (e.g., "a = 1 + 1" or "a = 4")
                            //console.log("Variable Assignment:", line);
                            evaluated = math.evaluate(line, scope); 
                            // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                            if (evaluated === Infinity) {
                                throw new Error("Infinity. Possible Division by zero");
                            }
                            newContent += `${allButLast} = ${rightPart}\n`;
                        }
                        //console.log("Updated Scope:", scope);
                        
                    } else {
                        // Any other line format remains unchanged
                        newContent += `${line}\n`;
                    }
                } catch (e) {  
                    // Extract the undefined symbol name from the error message
                    const undefinedSymbolMatch = e.message.match(/Undefined symbol (\w+)/);
                    if (undefinedSymbolMatch) {
                        const undefinedSymbol = undefinedSymbolMatch[1];
                        newContent += `${line} Error: Undefined symbol ${undefinedSymbol}\n`;
                    } else {
                        newContent += `${line} Error: ${e.message}\n`;
                    }
                    //console.log("ERR:", e.message);
                    //console.log("ERRLINE:", line);
                    //console.log("Current Scope:", scope);
                }
            }
            return newContent.trim();
        }

    };
    
    return calculator;
}));

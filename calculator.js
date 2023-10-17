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
// Universal module definition (UMD) for webcalc
(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        // Node/CommonJS
        module.exports = factory();
    } else {
        // Browser Globals
        global.webcalc = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    const calculator = {
        totalCalculations: 0,  // Number of lines where calculations are performed
        totalResultsProvided: 0,  // Number of lines with results provided
        initialise() {
            // Load at least all known currency
            // Note: In the future we could try allowing for people to use their own API key from fixer.io 
            //       and use this example https://mathjs.org/examples/browser/currency_conversion.html to load all the 
            //       latest currency conversion rate as needed.
            const currencies = [
                'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN',
                'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL',
                'BSD', 'BTC', 'BTN', 'BWP', 'BYN', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF',
                'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF',
                'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP',
                'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL',
                'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK',
                'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW',
                'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL',
                'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR',
                'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR',
                'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR',
                'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD',
                'SHP', 'SLE', 'SLL', 'SOS', 'SSP', 'SRD', 'STD', 'SYP', 'SZL', 'THB',
                'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX',
                'USD', 'UYU', 'UZS', 'VEF', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XAG',
                'XAU', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMK', 'ZMW', 'ZWL'
            ];
            currencies.forEach(currency => {
                // Reload 
                math.createUnit(currency);
            });
        },
        // Function to calculate content with math sections
        calculateWithMathSections(incomingContent) {
            // Regular expression to match ```math``` sections
            const mathSectionRegex = /```math\n([\s\S]+?)\n```/g;
            return incomingContent.replace(mathSectionRegex, (match, mathContent) => {
              const result = this.calculate(mathContent);
              return '```math\n' + result + '\n```';
            });
        },
        // Function to calculate content without math sections
        calculate(incomingContent) {
            /**
             * Throw error if MathJS is not loaded 
             */
            const isNodeEnvironment = typeof process !== 'undefined' && process.versions && process.versions.node;
            if (isNodeEnvironment) {
                if (typeof global.math === 'undefined' && typeof require !== 'undefined') {
                    throw new Error("QuickMathsJS-WebCalc: 'mathjs' is required in Node.js environment. Please ensure 'mathjs' is imported before using this module.");
                }
            } else {
                // For browser environment
                if (typeof window.math === 'undefined') {
                    throw new Error("QuickMathsJS-WebCalc: 'mathjs' is required in browser environment. Please ensure 'mathjs' is loaded before using this module.");
                }
            }

            /**
             * Convert natural language math expressions into a format suitable for math.js.
             * The function combines words into variable names using underscores while preserving
             * valid math.js expressions and keywords.
             *
             * @param {string} line - The input math expression in natural language.
             * @returns {string} - Transformed expression suitable for math.js evaluation.
             */
            function convertNaturalMathToMathJsSyntax(line) {
                // Split the line into tokens
                const tokens = line.split(/\s+/);

                // Math.js reserved keywords (You might want to expand this list based on your needs)
                // Note: This is an extensive list, but it's better to be thorough even at the expense of being able to use all natural expression,
                //       rather than hitting a problem with mathjs parsing which can throw a more silent error in such case.
                const reservedKeywords = [
                    // Constants
                    "pi", "e", "i", "Infinity", "LN2", "LN10", "LOG2E", "LOG10E", "NaN", "SQRT1_2", "SQRT2", "tau", "phi",
                    
                    // Relational Operators
                    "eq", "neq", "lt", "lte", "gt", "gte",
                
                    // Logical Operators
                    "not", "or", "and", "xor",
                
                    // Miscellaneous
                    //"bignumber", "chain", "complex", "concat", "diag", "eye", "filter", "map", "ones", "zeros", "distribution", 
                    //"partitionSelect", "combinations", "permutations", "pickRandom", "randomInt",
                
                    // Matrix Functions
                    "eigen", "usolve", "qr",
                
                    // String Functions
                    "split", "join",
                
                    // Other Constants
                    "version",
                
                    // Other Functions and Keywords
                    //"uninitialized", "var", "typeof", "config", "reviver", "replacer", "parser", "Parser", "compile", "derivative", 
                    //"simplify", "rationalize", "parse", "thematicBreak", "help",
                
                    // Transform Functions
                    //"apply", "column", "row", "map", "forEach", "filter", "subset", "transpose", "ctranspose", "size", "resize", 
                    //"diag", "flatten", "re", "im", "conj", "abs", "arg",
                
                    // Construction
                    "matrix", "sparse", "dense",
                
                    // Utils
                    "clone", "isInteger", "isNaN", "isFinite", "isZero", "isPositive", "isNegative", "hasNumericValue",
                
                    // Expressions
                    // Note: Not in use in parser
                    //"node", "AccessorNode", "ArrayNode", "AssignmentNode", "BlockNode", "ConditionalNode", "ConstantNode", 
                    //"FunctionAssignmentNode", "FunctionNode", "IndexNode", "ObjectNode", "OperatorNode", "ParenthesisNode", 
                    //"RangeNode", "RelationalNode", "SymbolNode",
                
                    // Original list of functions and constants
                    // Note: May remove if these keywords proven not to be an issue
                    //        e.g. `total sum = a sum(a, b, c)` is fine as `sum(` won't trigger this concat feature. 
                    //"abs", "acos", "add", "and", "asin", "atan", "atan2", "cbrt", "ceil", "clone", "cos", "cosh", "createUnit", 
                    //"cross", "csc", "cube", "det", "divide", "dot", "eigs", "erf", "eval", "exp", "filter", "flatten", "floor",
                    //"forEach", "format", "fraction", "gamma", "gcd", "help", "hypot", "identity", "im", "index", "inv", 
                    //"isNegative", "isNumeric", "isPositive", "isPrime", "kron", "lcm", "log", "log10", "log2", "lsolve", 
                    //"mad", "matrix", "max", "mean", "median", "min", "mod", "mode", "multiply", "norm", "not", "nthRoot", 
                    //"number", "or", "parse", "pow", "print", "prod", "quantileSeq", "random", "range", "re", "reshape", 
                    //"resize", "round", "sec", "set", "sin", "sinh", "size", "smaller", "sort", "sparse", "sqrt", "square", 
                    //"std", "subtract", "sum", "tan", "tanh", "trace", "transpose", "true", "typeOf", "unit", "variance", "xor",
                    
                    // Original list of units
                    "meter", "kilogram", "second", "ampere", "kelvin", "mole", "candela", "bit", "byte", "radian", "degree", 
                    "cycle", "steradian", "hertz", "Newton", "pascal", "joule", "watt", "coulomb", "volt", "ohm", "siemens", 
                    "farad", "capacitor", "inductor", "Weber", "tesla", "henry", "lumen", "lux", "becquerel", "gray", "sievert", 
                    "katal", "m2", "m3", "liter", "l", "angle", "Hz", "N", "Pa", "J", "W", "C", "V", "ohmSymbol", "S", "F", 
                    "Wb", "T", "H", "lm", "lx", "Bq", "Gy", "Sv", "kat",
                
                    // Additional reserved keywords
                    "in"
                ];
                
                const transformedTokens = [];
                let buffer = [];

                tokens.forEach((token, index) => {
                    const isAlphabeticOrNumeric = /^[a-zA-Z]+$/.test(token); // Check if token is alphabetic
                    const isReserved = reservedKeywords.includes(token);

                    if (!isAlphabeticOrNumeric || isReserved) {
                        if (buffer.length) {
                            transformedTokens.push(buffer.join('_'));
                            buffer = [];
                        }
                        transformedTokens.push(token);
                    } else {
                        buffer.push(token);
                    }

                    // If it's the last token, clear the buffer
                    if (index === tokens.length - 1 && buffer.length) {
                        transformedTokens.push(buffer.join('_'));
                    }
                });

                return transformedTokens.join(' ');
            }

            /**
             * Determines if a given string can be parsed as a symbolic name (i.e., a variable) 
             * without throwing an error using the `math.js` library.
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is a valid variable name, otherwise false.
             */
            function isVariable(str) {
                try {
                    const normalisedStr = convertNaturalMathToMathJsSyntax(str);
                    const node = math.parse(normalisedStr);
                    return node.isSymbolNode;
                } catch (e) {
                    return false;
                }
            }

            /**
             * Determines if a given string represents a valid numerical result. 
             * This includes checking for standard numeric representations as well 
             * as binary and hexadecimal formats.
             * 
             * Developer Notes:
             * 1. This function does not utilize math.parse() and node.isConstantNode to determine if a 
             *    string represents a constant. This decision was based on issues encountered with math.js' 
             *    handling of certain expressions.
             * 2. Instead, a combination of regular expressions and direct evaluation (math.evaluate()) 
             *    has been found to be more reliable for this specific use case. 
             * 3. The method tries to evaluate the string and sees if the result matches the input.
             *    If they match, it's a valid result; otherwise, it's not. This method is more
             *    versatile than checking against specific node types.
             *
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is a valid result, otherwise false.
             */
            function isOutputResult(str) {
                const normalisedStr = convertNaturalMathToMathJsSyntax(str);
                if (normalisedStr in scope || isVariable(normalisedStr)) {
                    // Don't classify known variables or strings that match variable format as results
                    return false;
                }
                // Check for binary format
                if (/^\s*0b[01]+\s*$/.test(normalisedStr)) {
                    return true;
                }
                // Check for hexadecimal format
                if (/^\s*0x[\da-fA-F]+\s*$/.test(normalisedStr)) {
                    return true;
                }
                // If no special numeral systems matched, then evaluate and compare
                try {
                    const evaluation = math.evaluate(normalisedStr);
                    return String(normalisedStr) === String(evaluation);
                } catch (e) {
                    return false;
                }
            }

            /**
             * Determines if a given string can be parsed as a basic arithmetic expression, 
             * which includes operator nodes, function nodes, or parenthesis nodes, 
             * using the `math.js` library.
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is a basic arithmetic expression, otherwise false.
             */
            function isExpression(str) {
                const normalisedStr = convertNaturalMathToMathJsSyntax(str);
                try {
                    const node = math.parse(normalisedStr);
                    return node.isConditionalNode ||
                           node.isAccessorNode ||
                           node.isArrayNode ||
                           node.isAssignmentNode ||
                           node.isBlockNode ||
                           node.isFunctionAssignmentNode ||
                           node.isFunctionNode ||
                           node.isIndexNode ||
                           node.isObjectNode ||
                           node.isOperatorNode ||
                           node.isParenthesisNode ||
                           node.isRangeNode;
                } catch (e) {
                    return false;
                }
            }

            /**
             * Determines if the provided string represents an empty slot or a placeholder
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is empty, contains only whitespace, or is a '?', otherwise false.
             */
            function isEmpty(str) {
                return str.trim() === '' || str.trim() === '?';
            }

            function determineIndentation(line) {
                const match = line.match(/^(\s*)/);  // Matches leading whitespace
                return match ? match[0].length : 0;
            }

            function math_evaluate(str, scope) {
                const normalisedStr = convertNaturalMathToMathJsSyntax(str);
                return math.evaluate(normalisedStr, scope)
            }

            // Preprocess to remove any existing "Error:"
            const cleanedLines = incomingContent.split('\n').map(line => {
                const errorIndex = line.indexOf("Error:");
                return errorIndex !== -1 ? line.substring(0, errorIndex).trimRight() : line;
            });
            const lines = cleanedLines.join('\n').split('\n');
            let newContent = "";

            this.totalCalculations = 0;
            this.totalResultsProvided = 0;

            // `scope` will be used to keep track of variable values as they're declared
            let scope = {};
            let lastEvaluatedAnswer = null;
            let lastUnevaluatedLine = null;

            // Iterate through each line in the textarea
            let index = 0;
            for (const line of lines) {
                try {
                    const indentationLevel = determineIndentation(line);
                    const trimmedLine = line.trim();
                    //console.log("indentationLevel: "+indentationLevel+ ` : "${line}"`  )

                    // Skip lines that are comments or empty
                    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
                        // Empty Lines or Comments
                        newContent += `${line}`;
                    } else {
                        // Split each line by '=' to determine its structure
                        const parts = line.split(/(?<!\=)\=(?!\=)/);
    
                        // This is the last two part of the line used for huriestics matching of expression type
                        const lastTwoParts = parts.slice(-2).map(str => str.trim());
                        leftPart = lastTwoParts[0];
                        rightPart = lastTwoParts[1];
    
                        // If the second last segment is a result and the last segment is empty (i.e., line ends with '='),
                        // then remove the trailing '='
                        if ((parts.length > 2) && isOutputResult(leftPart) && isEmpty(rightPart)) {
                            //console.log("trimming line")
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
                            this.totalCalculations++;
                            //console.log("Initial Scope:", scope);
                            if (isExpression(leftPart) && (isOutputResult(rightPart) || isEmpty(rightPart) || (!isExpression(rightPart) && !isVariable(leftPart)))) {
                                // Case: Pure Mathematical Expression (e.g., "5 + 3 = 8" or "5 + 3 =" or "5 + 3 = <corrupted output>")
                                //console.log("Pure Mathematical Expression:", line);
                                lastEvaluatedAnswer = math_evaluate(allButLast, scope);
                                this.totalResultsProvided++;
                                // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                if (lastEvaluatedAnswer === Infinity) {
                                    throw new Error("Infinity. Possible Division by zero");
                                }
                                newContent += `${allButLast} = ${lastEvaluatedAnswer}`;
                            } else if (isOutputResult(leftPart) && (isOutputResult(rightPart) || isEmpty(rightPart))) {
                                // Case: Direct constants (e.g., "0b1100100 =")
                                //console.log("Case: Direct constants:", line);
                                lastEvaluatedAnswer = math_evaluate(allButLast, scope);
                                this.totalResultsProvided++;
                                // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                if (lastEvaluatedAnswer === Infinity) {
                                    throw new Error("Infinity. Possible Division by zero");
                                }
                                newContent += `${allButLast} = ${lastEvaluatedAnswer}`;
                            } else if (isVariable(leftPart) && (isExpression(rightPart) || isOutputResult(rightPart))) {
                                // Case: Variable Assignment (e.g., "a = 1 + 1" or "a = 4") Or Result (e.g., "    a = 4") 
                                if (indentationLevel >= 2) {
                                    // If indentation is 4 or more, treat the line as a result line instead of an assignment
                                    //console.log("Case: Overwrite Result:", line);
                                    this.totalResultsProvided++;
                                    lastEvaluatedAnswer = math_evaluate(allButLast, scope);
                                    // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                    if (lastEvaluatedAnswer === Infinity) {
                                        throw new Error("Infinity. Possible Division by zero");
                                    }
                                    newContent += ' '.repeat(indentationLevel) + `${allButLast} = ${lastEvaluatedAnswer}`;
                                } else {
                                    // Regular assignment
                                    //console.log("Variable Assignment:", line);
                                    lastEvaluatedAnswer = math_evaluate(line, scope);
                                    // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                    if (lastEvaluatedAnswer === Infinity) {
                                        throw new Error("Infinity. Possible Division by zero");
                                    }
                                    newContent += `${allButLast} = ${rightPart}`;
                                }
                            } else if (isVariable(leftPart) && isVariable(rightPart)) {
                                // Case: Cascading Variable Assignment (e.g., "b = a")
                                //console.log("Case: Cascading Variable Assignment:", line);
                                lastEvaluatedAnswer = math_evaluate(line, scope); 
                                // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                if (lastEvaluatedAnswer === Infinity) {
                                    throw new Error("Infinity. Possible Division by zero");
                                }
                                newContent += `${allButLast} = ${rightPart}`;
                            } else if (isVariable(leftPart) && isEmpty(rightPart)) {
                                // Case: Variable with no assignment/result (e.g., "a =")
                                //console.log("Case: Variable with no result:", line);
                                // If indentation is 4 or more, treat the line as a result line instead of an assignment
                                this.toctalResultsProvided++;
                                lastEvaluatedAnswer = math_evaluate(allButLast, scope);
                                // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                if (lastEvaluatedAnswer === Infinity) {
                                    throw new Error("Infinity. Possible Division by zero");
                                }
                                newContent += ' '.repeat(indentationLevel) + `${allButLast} = ${lastEvaluatedAnswer}`;
                            } else if (isEmpty(leftPart) && (isOutputResult(rightPart) || isEmpty(rightPart))) {
                                //console.log("Case: Implied Results:", line, `(indent: ${indentationLevel})`);
                                this.totalResultsProvided++;
                                if (lastUnevaluatedLine != null)
                                {
                                    this.totalCalculations++;
                                    lastEvaluatedAnswer = math_evaluate(lastUnevaluatedLine, scope);
                                    // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                    if (lastEvaluatedAnswer === Infinity) {
                                        throw new Error("Infinity. Possible Division by zero");
                                    }
                                    lastUnevaluatedLine = null;
                                }
                                newContent += ' '.repeat(indentationLevel) + `= ${lastEvaluatedAnswer}`;
                            } else {
                                //console.log("Unhandled Heuristic Debug:", line, isOutputResult(leftPart), isOutputResult(rightPart), isExpression(leftPart), isExpression(rightPart), isVariable(leftPart), isVariable(rightPart));
                                throw new Error("This case is not yet handled, let us know at https://github.com/mofosyne/QuickMathsJS-WebCalc/issues");
                            }
                            //console.log("Updated Scope:", scope);
                        } else if (!isEmpty(line)) {
                            // Solo expression outputs nothing but is calculated anyway if valid expression or result
                            // Unless it's a `<variable> : <result>`
                            
                            // Split each line by ':' to determine its structure
                            const parts = line.split(/(?<!\:)\:(?!\:)/);
                            
                            // This is the last two part of the line used for huriestics matching of expression type
                            const lastTwoParts = parts.slice(-2).map(str => str.trim());
                            leftPart = lastTwoParts[0];
                            rightPart = lastTwoParts[1];
                            
                            // A version of the line but where all part of the expression except for the last part is kept
                            // This will be used if the last part is replaced with the result
                            const allButLast = parts.slice(0, -1).join(':').trimRight();
                            if ((parts.length == 2) && isVariable(leftPart) && (isEmpty(rightPart) || isOutputResult(rightPart))) {
                                lastEvaluatedAnswer = math_evaluate(leftPart, scope);
                                newContent += allButLast + `: ${lastEvaluatedAnswer}`;
                            } else {
                                lastUnevaluatedLine = line;
                                newContent += `${line}`;
                            }
                        } else {
                            newContent += `${line}`;
                        }
                    }
                } catch (e) {  
                    // Extract the undefined symbol name from the error message
                    const undefinedSymbolMatch = e.message.match(/Undefined symbol (\w+)/);
                    if (undefinedSymbolMatch) {
                        const undefinedSymbol = undefinedSymbolMatch[1];
                        newContent += `${line} Error: Undefined symbol ${undefinedSymbol}`;
                    } else {
                        newContent += `${line} Error: ${e.message}`;
                    }
                    //console.log("ERR:", e.message);
                    //console.log("ERRLINE:", line);
                    //console.log("Current Scope:", scope);
                }

                // Always append a newline unless it's the last line
                if (index !== lines.length - 1) {
                    newContent += '\n';
                }
                index++;
            }
            return newContent;
        }

    };
    
    return calculator;
}));

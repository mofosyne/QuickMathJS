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
        module.exports = factory;
    } else {
        // Browser Globals
        global.webcalc = factory(global.math);
    }
}(typeof self !== 'undefined' ? self : this, function (mathInstance) {
    const math = mathInstance;
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
            // Regular expression to match ```math``` sections with potential attributes
            const mathSectionRegex = /^```math(.*?)\n([\s\S]+?)\n^```$/gm;
            return incomingContent.replace(mathSectionRegex, (match, attributes, mathContent) => {
                const result = this.calculate(mathContent);
                return '```math' + attributes + '\n' + result + '\n```';
            });
        },
        // Function to calculate content without math sections
        calculate(incomingContent) {
            /**
             * Throw error if MathJS is not loaded 
             */
            if (!math) {
                throw new Error("QuickMathsJS-WebCalc: 'mathjs' is required. Please ensure 'mathjs' is loaded before using this module.");
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
                // Add spaces after '(' and before ')'
                line = line.replace(/(\()|(\))/g, match => match === '(' ? `${match} ` : ` ${match}`);
            
                // Add spaces after '[' and before ']'
                line = line.replace(/(\[)|(\])/g, match => match === '[' ? `${match} ` : ` ${match}`);
            
                // Add spaces after '{' and before '}'
                line = line.replace(/(\{)|(\})/g, match => match === '{' ? `${match} ` : ` ${match}`);
            
                // Split the line into tokens
                const tokens = line.split(/\s+/);
            
                const transformedTokens = [];
                let buffer = [];
            
                tokens.forEach((token, index) => {
                    const isAlphabeticOrNumeric = /^[a-zA-Z]+$/.test(token); // Check if token is alphabetic
            
                    // Check if token is a reserved keyword
                    let isReserved = false;
                    if (isAlphabeticOrNumeric) {
                        if (math.Unit.isValuelessUnit(token))
                        {
                            // Currencies, Weights not reserved...
                            // Note: This is so you can do stuff like 'EUR inc gst'
                            //       or name things 'steering degree'
                            if (token == 'in' || token == 'to')
                            {
                                // These definitely have special meaning in relation to unit conversion in math.js
                                // so do not break this behaviour
                                isReserved = true;
                            }
                        } else {
                            try {
                                // We check if this is a known constant (e.g. phi) or function (e.g. xor)
                                // Note: We might remove this if in practice we dont do implicit variable phrase and unit name... 
                                math.evaluate(token);
                                isReserved = true;
                            } catch (e) {
                                //console.log(`${token} not a known constant?`)
                            }
                        }
                    }
            
                    if (!isAlphabeticOrNumeric || isReserved) {
                        if (buffer.length) {
                            transformedTokens.push(buffer.join(''));
                            buffer = [];
                        }
                        transformedTokens.push(token);
                    } else {
                        buffer.push(token);
                    }
            
                    // If it's the last token, clear the buffer
                    if (index === tokens.length - 1 && buffer.length) {
                        transformedTokens.push(buffer.join(''));
                    }
                });
            
                return transformedTokens.join(' ');
            }
            
            /**
             * Determines if the provided string represents an empty slot or a placeholder
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is empty, contains only whitespace, or is a '?', otherwise false.
             */
            function isEmpty(str) {
                return str.trim() === '' || str.trim() === '?';
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
             * The function checks for standard numeric representations as well as implicit multiplications 
             * between constants and symbols (e.g., "2m" which is internally "2 * m").
             * 
             * Developer Notes:
             * - The function does not rely solely on math.parse() and node.isConstantNode to determine 
             *   if a string represents a constant due to issues with math.js' handling of certain expressions.
             * - Instead, a combination of the mathjs parser and specific checks for node types is utilized.
             *   This approach was found to be more reliable and versatile for the intended use case.
             * - Special handling is incorporated for certain cases:
             *   1. Empty strings are treated distinctly as they are parsed as constants by mathjs.
             *   2. Strings representing variables (e.g., 'number_of_cats') are excluded.
             *   3. Expressions involving operations (e.g., 2.1 + 3.0) are excluded.
             *
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is a valid result, otherwise false.
             */
            function isOutputResult(str) {
                try {
                    const normalisedStr = convertNaturalMathToMathJsSyntax(str);
                    const node = math.parse(normalisedStr);
                    
                    // Check if string is considered empty
                    // Note: Internally mathjs parser consider empty string as constant
                    //       hence we need a specific check for this
                    if (isEmpty(str))
                        return false;

                    // Check if it's a variable by itself e.g. 'number_of_cats'
                    if (node.isSymbolNode)
                        return false;

                    if (node.isOperatorNode) {
                        // Check for implicit multiplication between a constant and a unit symbol 
                        // e.g. '2m' which is actually internally '2 * m'
                        if (node.implicit && node.args.length === 2) {
                            if (node.args[0].isConstantNode && node.args[1].isSymbolNode)
                                return true;
                        }

                        // Is more likely to be an actual expression e.g. 2.1 + 3.0
                        return false;
                    }

                    // Check for simple constants (e.g. 0b1010, 0x2234, 23.3)
                    if (node.isConstantNode)
                        return true;

                    return false;
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
             * Determines if a given string can be parsed as a function call 
             * (e.g., f(x,y,z) or sin(x) ) using the `math.js` library.
             * @param {string} str - The string to be checked.
             * @returns {boolean} - True if the string is a function call, otherwise false.
             */
            function isFunctionCall(str) {
                const normalisedStr = convertNaturalMathToMathJsSyntax(str);
                try {
                    const node = math.parse(normalisedStr);
                    return node.isFunctionNode;
                } catch (e) {
                    return false;
                }
            }

            /**
             * Extracts the base and quote identifiers from a given ratio definition string in the formats `XXX / YYY` or `XXX/YYY`.
             * @param {string} str - The ratio definition string to be parsed.
             * @returns {object|null} - An object with the base and quote identifiers or null if the format is invalid.
             */
            function extractPairRatioDefinition(str) {
                // Regular expression to match both ratio definition formats with capturing groups
                const ratioDefinitionRegex = /^([A-Za-z]+) *\/ *([A-Za-z]+)$/i;
                const match = str.trim().match(ratioDefinitionRegex);
                
                if (match === null)
                return null;

                return {base: match[1], quote: match[2]};
            }

            /**
             * Checks if a given string conforms to the valid ratio definition format of `XXX / YYY`.
             * 
             * @param {string} str - The string to be validated.
             * @param {object} scope - The current math.js scope containing defined variables.
             * @returns {boolean} - True if the string matches the valid ratio definition format, otherwise false.
             * 
             * This function was originally designed to support currency pair definitions like `XXX / YYY` or `XXX/YYY`.
             * It has been extended to support longer unit identifiers, such as `EUR/EURincGST`. 
             * Note: In math.js, only alphanumeric characters are allowed in unit definitions.
             * 
             * The function also checks against the provided scope to ensure that the base and quote from the ratio definition
             * are not already defined as variables. This is to prevent overwriting existing variables or 
             * inadvertently using a variable name as a unit identifier.
             */
            function isValidPairRatioDefinition(str, scope) {
                const normalisedStr = convertNaturalMathToMathJsSyntax(str).trim();
                
                // Regular expression pattern to validate the ratio definition format
                const ratioDefinitionRegex = /^[A-Za-z]+ *\/ *[A-Za-z]+$/i;
                
                // If the string doesn't match the expected pattern, return false
                if (!ratioDefinitionRegex.test(normalisedStr.trim()))
                    return false;
                
                // Extract the base and quote from the string
                const ratioDefinition = extractPairRatioDefinition(normalisedStr);
                if (!ratioDefinition)
                    return false;

                // Check if either the base or quote is already defined in the provided scope as a variable
                if (ratioDefinition.base in scope || ratioDefinition.quote in scope)
                    return false;
            
                // If all checks pass, return true
                return true;
            }

            /**
             * Determines the effective indentation length of a line. 
             * Each tab (\t) is considered equivalent to 4 spaces.
             * 
             * @param {string} line - The line whose indentation is to be determined.
             * @return {number} The effective indentation length.
             */
            function determineIndentation(line) {
                // Extract the leading whitespace using a regex match
                const leadingWhitespace = line.match(/^(\s*)/)[0];
                
                // Iterate over each character in the leading whitespace:
                // - Add 4 for each tab character
                // - Add 1 for each space character
                return leadingWhitespace.split('').reduce((acc, char) => {
                    return acc + (char === '\t' ? 4 : 1);
                }, 0);
            }

            function math_evaluate(str, scope) {
                const normalisedStr = convertNaturalMathToMathJsSyntax(str).trim();
                //console.log(`evaluating '${normalisedStr}'`)
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
                        const allButLast = parts.slice(0, -1).join('=');
    
                        // Handling lines with minimum of one '='
                        if (parts.length >= 2) {
                            this.totalCalculations++;
                            //console.log("Initial Scope:", scope);
                            if (isValidPairRatioDefinition(leftPart, scope) && (isOutputResult(rightPart) || isEmpty(rightPart))) {
                                const quotation = parseFloat(rightPart); // Convert the quotation string to a float
                                if (!isNaN(quotation))
                                {
                                    const normalisedStr = convertNaturalMathToMathJsSyntax(leftPart).trim();
                                    const pairRatio = extractPairRatioDefinition(normalisedStr);
                                    //console.log(`Base unit: ${pairRatio.base}`);
                                    //console.log(`Quote unit: ${pairRatio.quote}`);
                                    //console.log(`unit quote: ${quotation}`);
                                    // Check and create base currency if it doesn't exist
                                    if (!math.Unit.isValuelessUnit(pairRatio.base)) {
                                        math.createUnit(pairRatio.base);
                                    }
                                    // Update or create the quote currency
                                    math.createUnit(pairRatio.quote, `${quotation} ${pairRatio.base}`, {override: true});
                                }
                                newContent += `${allButLast}= ${rightPart}`;
                            } else if (isExpression(leftPart) && (isOutputResult(rightPart) || isEmpty(rightPart) || (!isExpression(rightPart) && !isVariable(leftPart)))) {
                                // Case: Pure Mathematical Expression (e.g., "5 + 3 = 8" or "5 + 3 =" or "5 + 3 = <corrupted output>")
                                //console.log("Pure Mathematical Expression:", line);
                                lastEvaluatedAnswer = math_evaluate(allButLast, scope);
                                this.totalResultsProvided++;
                                // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                if (lastEvaluatedAnswer === Infinity) {
                                    throw new Error("Infinity. Possible Division by zero");
                                }
                                newContent += `${allButLast}= ${lastEvaluatedAnswer}`;
                            } else if (isOutputResult(leftPart) && (isOutputResult(rightPart) || isEmpty(rightPart))) {
                                // Case: Direct constants (e.g., "0b1100100 =")
                                //console.log("Case: Direct constants:", line);
                                lastEvaluatedAnswer = math_evaluate(allButLast, scope);
                                this.totalResultsProvided++;
                                // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                if (lastEvaluatedAnswer === Infinity) {
                                    throw new Error("Infinity. Possible Division by zero");
                                }
                                newContent += `${allButLast}= ${lastEvaluatedAnswer}`;
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
                                    newContent += `${allButLast}= ${lastEvaluatedAnswer}`;
                                } else {
                                    // Regular assignment
                                    //console.log("Variable Assignment:", line);
                                    lastEvaluatedAnswer = math_evaluate(line, scope);
                                    // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                    if (lastEvaluatedAnswer === Infinity) {
                                        throw new Error("Infinity. Possible Division by zero");
                                    }
                                    newContent += `${allButLast}= ${rightPart}`;
                                }
                            } else if (isVariable(leftPart) && isVariable(rightPart)) {
                                // Case: Cascading Variable Assignment (e.g., "b = a")
                                //console.log("Case: Cascading Variable Assignment:", line);
                                lastEvaluatedAnswer = math_evaluate(line, scope); 
                                // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                if (lastEvaluatedAnswer === Infinity) {
                                    throw new Error("Infinity. Possible Division by zero");
                                }
                                newContent += `${allButLast}= ${rightPart}`;
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
                                newContent += `${allButLast}= ${lastEvaluatedAnswer}`;
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
                                newContent += `${allButLast}= ${lastEvaluatedAnswer}`;
                            } else if (isFunctionCall(leftPart) && (isOutputResult(rightPart) || isVariable(rightPart) || (isExpression(rightPart)))) {
                                // Case: Function Definition (e.g., "b(a) = a*2")
                                //console.log("Case: Function Definition:", line);
                                math_evaluate(line, scope); 
                                newContent += `${allButLast}= ${rightPart}`;
                            } else {
                                console.log("Unhandled Heuristic Debug:", line, isOutputResult(leftPart), isOutputResult(rightPart), isExpression(leftPart), isExpression(rightPart), isVariable(leftPart), isVariable(rightPart));
                                console.log("Split Parts:", leftPart, " :: ", rightPart);
                                console.log("MathJS Syntax:", convertNaturalMathToMathJsSyntax(line));
                                const normalisedStr = convertNaturalMathToMathJsSyntax(line);
                                console.log(math.parse(leftPart));
                                throw new Error("This case is not yet handled, let us know at https://github.com/mofosyne/QuickMathsJS-WebCalc/issues");
                            }
                            //console.log("Updated Scope:", scope);
                        } else if (!isEmpty(line)) {
                            // Solo expression outputs nothing but is calculated anyway if valid expression or result
                            // Unless it's a `<variable> : <result>` in which it is an explicit result output
                            
                            // Split each line by ':' to determine its structure
                            const parts = line.split(/(?<!\:)\:(?!\:)/);
                            
                            // This is the last two part of the line used for huriestics matching of expression type
                            const lastTwoParts = parts.slice(-2).map(str => str.trim());
                            leftPart = lastTwoParts[0];
                            rightPart = lastTwoParts[1];
                            
                            // A version of the line but where all part of the expression except for the last part is kept
                            // This will be used if the last part is replaced with the result
                            const allButLast = parts.slice(0, -1).join(':');
                            if ((parts.length == 2) && (isVariable(leftPart) || isExpression(leftPart)) && (isEmpty(rightPart) || isOutputResult(rightPart))) {
                                lastEvaluatedAnswer = math_evaluate(leftPart, scope);
                                newContent += `${allButLast}: ${lastEvaluatedAnswer}`;
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

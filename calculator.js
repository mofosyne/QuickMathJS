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

        // These are used as statistics and for checking if a new user unfamilar
        // with QuickMathJS syntax is using it. As they would usually just type 
        totalCalculations: 0,  // Number of lines where calculations are performed
        totalSoloExpressions: 0,  // Number of lines with potential expressions entered
        totalResultsProvided: 0,  // Number of lines with results provided

        // Unit Expanded Name Representations (e.g. USD exc tax)
        unitNameExpansion: {},  // Mapping between unit names and it's expanded form if needed

        initialise() {

            // Load at least all known currency
            // Note: While you can implicity declare your own custom units on assignments,
            //       there are cases where you would not use assignment but still need these units...
            //       hence I will now be including it in again by default to avoid this annoyance.
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
                
                const extraCurrencyRepresentations = [
                    `${currency} inc tax`, 
                    `${currency} exc tax`, 
                    `${currency} inc gst`, 
                    `${currency} exc gst`];

                // Register Base Currency Representation
                if (!math.Unit.isValuelessUnit(currency)) {
                    math.createUnit(currency);
                }

                // Register Alt Currency Representation
                extraCurrencyRepresentations.forEach(extraCurrencyUnit => {
                    // Remove spaces as mathjs only support alphabet names for units
                    const nomalisedUnitName = extraCurrencyUnit.replace(/\s+/g, '');
                    if (!math.Unit.isValuelessUnit(nomalisedUnitName)) {
                        math.createUnit(nomalisedUnitName);

                        // Link these alternative representations together
                        // Note: Can still be overridden later on if flat tax pair ratio can be used
                        math.createUnit(nomalisedUnitName, `1 ${currency}`, {override: true});

                        // Register expanded name so it renders correctly in output
                        this.captureUnitExpandedRepresentation(nomalisedUnitName, extraCurrencyUnit);
                    }
                })
            });

        },
        // Function to calculate content with math sections
        calculateWithMathSections(incomingContent) {
            // Regular expression to match ```calc``` sections with potential attributes
            const mathSectionRegex = /^```calc(.*?)\n([\s\S]+?)\n^```$/gm;
            return incomingContent.replace(mathSectionRegex, (match, attributes, mathContent) => {
                const result = this.calculate(mathContent);
                return '```calc' + attributes + '\n' + result + '\n```';
            });
        },
        captureUnitExpandedRepresentation(normalisedPairRatio, expandedPairRatio) {
            if ((normalisedPairRatio === expandedPairRatio) && !this.unitNameExpansion.hasOwnProperty(normalisedPairRatio))
                return;

            this.unitNameExpansion[normalisedPairRatio] = expandedPairRatio;
        },
        replaceWithUnitExpandedRepresentation(str) {
            
            // Split into tokens by spaces
            // Always convert to string as this is only going to be used for output formatting   
            const words = str.toString().split(/\s+/);

            // Replace tokens with expanded representations
            const replacedWords = words.map(word => {
                // Check if the word is a unit token and has an expanded representation
                if (this.unitNameExpansion.hasOwnProperty(word)) {
                    return this.unitNameExpansion[word];
                } else {
                    return word; // Keep the original word
                }
            });

            // Join the replaced words back into a string
            const replacedString = replacedWords.join(' ');
            return replacedString;
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

                // Add spaces around '/' to make it easier to detect variable phrases and compound units
                line = line.replace(/\//g, ' / ');

                // Add spaces around '*' to make it easier to detect variable phrases and compound units
                line = line.replace(/\*/g, ' * ');

                // Split the line into tokens
                const tokens = line.split(/\s+/);

                const transformedTokens = [];
                let buffer = [];

                function joinTokens(input_buffer) {
                    // Scan these series of words in case it is representing a compounded unit e.g. 'kg m'
                    // If we have a string like 'steering degree' we can tell it's not a compounded unit even though 'degree'
                    // is a unit because 'steering' is not a known unit, so by context the whole thing is actually a variable.
                    const compounded_unit = input_buffer.every(token => math.Unit.isValuelessUnit(token));
                    if (compounded_unit)
                    {
                        // Is an implicit compounded unit
                        // Do not normalise any tokens found so far in the buffer
                        return input_buffer.join(' ');
                    }
                    else
                    {
                        // There is some non unit tokens here
                        // Let's normalise any token we found so far in the buffer
                        return input_buffer.join('');
                    }
                }

                tokens.forEach((token, index) => {
                    let normaliseThisToken = true;
                    
                    // Check if token is alphabetic
                    if (/^[a-zA-Z]+$/.test(token)) {
                        // Token consist of only alphabet characters

                        // These keywords have special meanings in math.js
                        // and may represent implicit functions like '<word> mod <word>'
                        // which cannot be easily managed using normal operators like '+' or '*'.
                        const reservedKeywords = ['in', 'to', 'mod', 'not', 'and', 'xor', 'or'];

                        // If the current token is in the list of reserved keywords, we do not want to normalize it.
                        if (reservedKeywords.includes(token)) {
                            normaliseThisToken = false;
                        }
                    } else {
                        // Not Alphabet so no need to merge these token
                        // e.g. might be an operator or function
                        normaliseThisToken = false;
                    }

                    // Process each token based on if it should be normalised or not
                    if (normaliseThisToken) {
                        // Normalise these tokens so save for later
                        buffer.push(token);
                    } else {
                        // Don't normalise this token
                        if (buffer.length) {
                            // Let's normalise any token we found so far
                            transformedTokens.push(joinTokens(buffer));
                            buffer = [];
                        }
                        transformedTokens.push(token);
                    }
                    
                    // If it's the last token, clear the buffer
                    if (index === tokens.length - 1 && buffer.length) {
                        transformedTokens.push(joinTokens(buffer));
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
             * @param {boolean} customUnitDeclarationMode - Ignore unit check, we will allow for declaring new units
             * @returns {boolean} - True if the string is a valid result, otherwise false.
             */
            function isOutputResult(str, customUnitDeclarationMode=false) {
                try {
                    const normalisedStr = convertNaturalMathToMathJsSyntax(str);
                    const node = math.parse(normalisedStr);

                    // Check if string is considered empty
                    // Note: Internally mathjs parser considers empty string as constant
                    //       hence we need a specific check for this
                    if (isEmpty(str)) {
                        return false;
                    }

                    /*
                    //    Expression trees : https://mathjs.org/docs/expressions/expression_trees.html
                    //        FunctionNode    sqrt
                    //                         |
                    //        OperatorNode     +
                    //                        / \
                    //        ConstantNode   2   x   SymbolNode
                    //    
                    //    What we care about here to check if this is a pure result is to traverse
                    //    this structure and check if:
                    //        - No Function Node as that is always evaluated into a result
                    //        - Operator Node : '*' or '/' is okay... but '-' and '+' is not
                    //        - '*' must be implicit as 
                    //        - Constant Node is optional
                    //        - SymbolNode is okay as long as confirmed to be a unit via math.Unit.isValuelessUnit()
                    */

                    // Specific check here 
                    if (node.isSymbolNode) {
                        // A single symbol here might be a valid result as a solo unit e.g. evaluate('km') --> 'km'
                        //  but this will cause an syntax edge case with detecting assignment
                        //  because of the ambiguity between a unit and variable.
                        //  This will remain the case unless we increase the complexity of the heuristic.
                        //  To keep things simple... lets just assume invalid if just symbol by itself.
                        //  in most context this will be correct as normal people wont just write 'km'.
                        //  e.g. is the 'b' in 'b = 2'  
                        return false;
                    }
                    
                    /**
                     * Recursively checks if a Math.js node represents a valid result.
                     * @param {MathNode} node - The current Math.js node to check.
                     * @returns {boolean} - True if the node represents a valid result, otherwise false.
                     */
                    function checkNode(node) {
                        if (node.isSymbolNode) {
                            
                            // Check if name is object placeholder result '[object Object]' 
                            if (node.name == 'object' || node.name == 'Object')
                                return true;

                            // Skip unit check, since we will be declaring new units
                            if (customUnitDeclarationMode)
                                return true;

                            // Check if the symbol node represents a unit
                            // if not a unit, then it may be a variable which is not a result
                            return math.Unit.isValuelessUnit(node.name);
                        }
                        
                        if (node.isConstantNode) {
                            // Constants is part of result (e.g., 0b1010, 0x2234, 23.3)
                            return true;
                        } 
                        
                        if (node.isFunctionNode) {
                            // Solo Functions is not found in result (e.g. sin() )
                            return false;
                        }

                        if (node.isOperatorNode) {
                            // Check for implicit multiplication or explicit division between constants and unit symbols
                            // Implicit multiplication and explicit division will always have two arguments so can be assumed
                            if (node.implicit) {
                                return node.args.every(checkNode);
                            }

                            if (node.op === '/' ) {
                                return node.args.every(checkNode);
                            }

                            // Check for addition or subtraction operators
                            if (node.op === '+' || node.op === '-' || node.op === '*') {
                                if (node.fn === "unaryMinus"){
                                    return node.args.every(checkNode);
                                }

                                return false; // Reject expressions with addition or subtraction
                            }

                            // Check if '^' is being used as part of unit definition 
                            if (node.op === '^') {
                                const [arg1, arg2] = node.args;
                                // Check if only constants here e.g. 2^2 is invalid
                                if (arg1.isConstantNode && arg2.isConstantNode)
                                    return false;
                                // Check if child is okay and power is constant value e.g. m^2 is valid
                                if (checkNode(arg1) && arg2.isConstantNode)
                                    return true;
                                // Assume all other forms as invalid e.g. ?^km is invalid
                                return false;
                            }

                            // Recursively check the children nodes
                            return node.args.every(checkNode);
                        }

                        // Array Nodes Has a specific handling required
                        //   but just check all members is valid
                        if (node.isArrayNode){
                            return node.items.every(checkNode);
                        }

                        // Unhandled, but just check all members is valid
                        return node.args.every(checkNode);
                    }

                    return checkNode(node);
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

                const parts = normalisedStr.split('/');
                if (parts.length !== 2)
                    return false;

                // Check if either the base or quote is already defined in the provided scope as a variable
                const pairRatioBase = parts[0].trim();
                const pairRatioQuote = parts[1].trim();
                //console.log(`Base unit: ${pairRatioBase}`);
                //console.log(`Quote unit: ${pairRatioQuote}`);
                if (pairRatioBase in scope || pairRatioQuote in scope)
                    return false;
            
                // If all checks pass, return true
                return true;
            }

            /**
             * Captures the unit string from the end of the input string.
             * @param {string} inputString - The input string containing possible units.
             * @returns {string[]|null} - An array of captured unit strings or null if none are found.
             * 
             * Design Note: This function employs specific checks to avoid inadvertent matches.
             */
            function captureUnitsFromString(inputString) {

                function checkAndStrip(regex, inputString) {
                    if (!(regex.test(inputString)))
                        return null;
                    return inputString.replace(regex, '').trim();
                }
                
                function checkAndStripAll(inputString) {
                    let outputString;
                    // Strip Matrices
                    outputString = checkAndStrip(/^\[.*?\]/, inputString);
                    if (outputString !== null) return outputString;
                    // Strip Binary
                    outputString = checkAndStrip(/^0[bB][01]+\s*/, inputString); 
                    if (outputString !== null) return outputString;
                    // Strip Hex
                    outputString = checkAndStrip(/^0[xX][0-9a-fA-F]+\s*/, inputString); 
                    if (outputString !== null) return outputString;
                    // Strip Octal
                    outputString = checkAndStrip(/^0[oO][0-7]+\s*/, inputString); 
                    if (outputString !== null) return outputString;
                    // Strip Numerical (int, float, exponent)
                    outputString = checkAndStrip(/^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?/, inputString); 
                    if (outputString !== null) return outputString;
                    // No matches found anymore, no supported values present
                    return null;
                }

                // Strip known value patterns from the input to isolate possible unit strings
                unitRawString = checkAndStripAll(inputString);
                if (unitRawString === null)
                    return null;

                // Check if the remaining string has recognizable units
                // The string can have alphanumerics, '/', '^' followed by integers
                if (!(/^[a-zA-Z\/ ]+(\^-?\d+[a-zA-Z\/ ]*)*$/).test(unitRawString))
                    return null;

                // Replace power notations (like ^2 or ^-3) with '/', which will be split later
                unitRawString = unitRawString.replace(/\^-?\d+/g, '/');

                // Split by '/', resulting in individual units
                let units = unitRawString.split(/\//).map(unit => unit.trim()).filter(unit => unit !== '');

                // Retain only units that are purely alphabetical or spaces
                units = units.filter(unit => /^[a-zA-Z ]+$/.test(unit));
                return units;
            }

            /**
             * Captures and processes a unit assignment from the input string.
             * @param {string} inputString - The input string containing a unit assignment.
             */
            const assignmentUnitCapture = (inputString) => {

                // Capture the full unit string from the input
                // Note: Exit if assignment is missing value, as we expect a value if an assignment is performed.
                const unitsArray = captureUnitsFromString(inputString);
                if (!unitsArray || unitsArray.length === 0)
                    return;

                // Process each unit captured
                unitsArray.forEach(unitString => {

                    // For strings like 'steering degree', if 'degree' is a recognized unit but 'steering' isn't, 
                    // then the entire string 'steering degree' can be treated as a variable instead of a compound unit.
                    // Double check that this isn't the case
                    const tokens = unitString.split(/\s+/);
                    const compounded_unit = tokens.every(token => math.Unit.isValuelessUnit(token));
                    if (compounded_unit)
                        return;

                    // Normalize the unit name for consistent representation and math.js compatibility
                    const normalizedUnitName = convertNaturalMathToMathJsSyntax(unitString);

                    // Check and create the base unit if it doesn't exist
                    if (!math.Unit.isValuelessUnit(normalizedUnitName)) {
                        math.createUnit(normalizedUnitName);
                    }

                    // Capture the unit name expansion
                    this.captureUnitExpandedRepresentation(normalizedUnitName, unitString);
                });
            };

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
            this.totalSoloExpressions = 0;
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
                                const quotation = math.evaluate(rightPart).toString(); // Convert the quotation string to a float
                                const parts = leftPart.split('/');
                                if (!isNaN(quotation) && (parts.length === 2))
                                {
                                    // Check if either the base or quote is already defined in the provided scope as a variable
                                    const pairRatioBase = parts[0].trim();
                                    const pairRatioQuote = parts[1].trim();
                                    const normalisedPairRatioBase = convertNaturalMathToMathJsSyntax(pairRatioBase);
                                    const normalisedPairRatioQuote = convertNaturalMathToMathJsSyntax(pairRatioQuote);
                                    //console.log(`Base unit: ${normalisedPairRatioBase}`);
                                    //console.log(`Quote unit: ${normalisedPairRatioQuote}`);
                                    //console.log(`unit quote: ${quotation}`);

                                    // Check and create base currency if it doesn't exist
                                    if (!math.Unit.isValuelessUnit(normalisedPairRatioBase)) {
                                        math.createUnit(normalisedPairRatioBase);
                                    }

                                    // Update or create the quote currency
                                    math.createUnit(normalisedPairRatioQuote, `${quotation} ${normalisedPairRatioBase}`, {override: true});

                                    // Capture unit name expansion
                                    this.captureUnitExpandedRepresentation(normalisedPairRatioBase, pairRatioBase);
                                    this.captureUnitExpandedRepresentation(normalisedPairRatioQuote, pairRatioQuote);
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
                                newContent += `${allButLast}= ${this.replaceWithUnitExpandedRepresentation(lastEvaluatedAnswer)}`;
                            } else if (isOutputResult(leftPart) && (isOutputResult(rightPart) || isEmpty(rightPart))) {
                                // Case: Direct constants (e.g., "0b1100100 =")
                                //console.log("Case: Direct constants:", line);
                                lastEvaluatedAnswer = math_evaluate(allButLast, scope);
                                this.totalResultsProvided++;
                                // Error handling for Infinity. Possible Division by zero, as JavaScript will return Infinity
                                if (lastEvaluatedAnswer === Infinity) {
                                    throw new Error("Infinity. Possible Division by zero");
                                }
                                newContent += `${allButLast}= ${this.replaceWithUnitExpandedRepresentation(lastEvaluatedAnswer)}`;
                            } else if (isVariable(leftPart) && (isExpression(rightPart) || isOutputResult(rightPart, customUnitDeclarationMode = true))) {
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
                                    newContent += `${allButLast}= ${this.replaceWithUnitExpandedRepresentation(lastEvaluatedAnswer)}`;
                                } else {
                                    // Regular assignment
                                    //console.log("Variable Assignment:", line);
                                    if (isOutputResult(rightPart, customUnitDeclarationMode = true))
                                    {
                                        // Capture Custom Unit only if it's a simple output result
                                        // Complex expressions with variables will make it harder to tell variable and custom units apart  
                                        assignmentUnitCapture(rightPart);
                                    }
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
                                newContent += `${allButLast}= ${this.replaceWithUnitExpandedRepresentation(lastEvaluatedAnswer)}`;
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
                                newContent += `${allButLast}= ${this.replaceWithUnitExpandedRepresentation(lastEvaluatedAnswer)}`;
                            } else if (isFunctionCall(leftPart) && (isOutputResult(rightPart) || isVariable(rightPart) || (isExpression(rightPart)))) {
                                // Case: Function Definition (e.g., "b(a) = a*2")
                                //console.log("Case: Function Definition:", line);
                                math_evaluate(line, scope); 
                                newContent += `${allButLast}= ${rightPart}`;
                            } else {
                                console.log(`Unhandled Heuristic Debug: ${line}`);
                                console.log("MathJS Syntax:", convertNaturalMathToMathJsSyntax(line));
                                console.log(`(leftPart)  isOutputResult:${ isOutputResult(leftPart)}, isExpression:${ isExpression(leftPart)}, isVariable: ${ isVariable(leftPart)} :: ${leftPart} `);
                                console.log(`(rightPart) isOutputResult:${isOutputResult(rightPart)}, isExpression:${isExpression(rightPart)}, isVariable: ${isVariable(rightPart)} :: ${rightPart}`);
                                console.log("## math.parse(leftPart) =");
                                console.log(math.parse(leftPart));
                                console.log("## math.parse(rightPart) =");
                                console.log(math.parse(rightPart));
                                throw new Error("This case is not yet handled, let us know at https://github.com/mofosyne/QuickMathsJS-WebCalc/issues");
                            }
                            //console.log("Updated Scope:", scope);
                        } else if (!isEmpty(line)) {
                            // Solo expression outputs nothing but is calculated anyway if valid expression or result
                            // Unless it's a `<variable> : <result>` in which it is an explicit result output
                            
                            // Split each line by rightmost ':' to determine its structure
                            // Must account for extra ':' in case of inputs like 'format(1/2, {notation: 'exponential'})'
                            const match = line.match(/^(.*):([^:]*)$/);
                            if (match) {
                                const leftPart = match[1];
                                const rightPart = match[2];
                                if (isVariable(leftPart) || isExpression(leftPart)) {
                                    this.totalResultsProvided++;
                                    lastEvaluatedAnswer = math_evaluate(leftPart, scope);
                                    newContent += `${leftPart}: ${this.replaceWithUnitExpandedRepresentation(lastEvaluatedAnswer)}`;
                                } else {
                                    lastUnevaluatedLine = line;
                                    newContent += `${line}`;
                                }
                            } else {
                                // Not (Yet) Evaluated Line

                                // Possible Solo Expressions
                                if (isExpression(line)) {
                                    // This is used to assist the UI in detecting newbies just typing expressions expecting results
                                    this.totalSoloExpressions++;
                                }

                                lastUnevaluatedLine = line;
                                newContent += `${line}`;
                            }
                        } else {
                            // Empty Line
                            newContent += `${line}`;
                        }
                    }
                } catch (e) {  

                    // Append original content with extra space
                    newContent += `${line.trimRight()} `;

                    // Extract the undefined symbol name from the error message
                    const undefinedSymbolMatch = e.message.match(/Undefined symbol (\w+)/);
                    if (undefinedSymbolMatch) {
                        const undefinedSymbol = undefinedSymbolMatch[1];
                        newContent += `Error: Undefined symbol ${undefinedSymbol}`;
                    } else {
                        newContent += `Error: ${e.message}`;
                    }

                    //console.log("ERR:", e.message);
                    //console.log("ERRLINE:", line);
                    //console.log("Current Scope:", scope);
                    //console.log(e.stack.toString());
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

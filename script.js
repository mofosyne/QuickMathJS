let previousContent = "";  // To store the state before "Enter" is pressed

async function saveToHash() {
    const content = document.getElementById("input").value;
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(content);
    const compressedBlob = await new Response(uint8Array).blob().then(blob => {
        return blob.stream().pipeThrough(new CompressionStream("gzip"));
    }).then(stream => new Response(stream).blob());
    
    const compressedBase64 = await blobToBase64(compressedBlob);
    window.location.hash = compressedBase64;
}

async function loadFromHash() {
    if (window.location.hash) {
        const compressedBase64 = window.location.hash.substring(1);
        const compressedBlob = await base64ToBlob(compressedBase64);
        const decompressedText = await DecompressBlob(compressedBlob);
        document.getElementById("input").value = decompressedText;
    }
}

async function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function() {
            resolve(reader.result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function base64ToBlob(base64) {
    const response = await fetch("data:application/octet-stream;base64," + base64);
    return response.blob();
}

async function DecompressBlob(blob) {
    const ds = new DecompressionStream("gzip");
    const decompressedStream = blob.stream().pipeThrough(ds);
    return new Response(decompressedStream).text();
}

// When the page loads, check for content in the hash and load it
window.onload = function() {
    loadFromHash();
};

function handleKeyDown(event) {
    // Check if the pressed key was "Enter"
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent a new line from being added

        const textarea = document.getElementById("input");
        const cursorPosition = textarea.selectionStart;
        
        // Get the content of the text area up to the cursor position
        const contentBeforeCursor = textarea.value.substring(0, cursorPosition);

        // Check if cursor is at the start of a line, at the start of the textarea content, or at the end of the content
        if (cursorPosition === 0 || contentBeforeCursor.endsWith('\n') || cursorPosition === textarea.value.length) {
            // Insert a newline
            textarea.value = textarea.value.substring(0, cursorPosition) + '\n' + textarea.value.substring(cursorPosition);
            textarea.setSelectionRange(cursorPosition + 1, cursorPosition + 1); // Move cursor after the new line
            return;
        }

        previousContent = textarea.value;  // Cache the current state before calculations
        
        calculate();

        // Move the cursor to the beginning of the next line
        const nextNewLinePos = textarea.value.indexOf('\n', cursorPosition);
        if (nextNewLinePos === -1) {  // If there's no next line, move to the end
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        } else {
            textarea.setSelectionRange(nextNewLinePos + 1, nextNewLinePos + 1);
        }

        // After calculating, save content to URL hash
        saveToHash();
    }
}

function calculate() {
    // Retrieve the content of the input textarea
    const textarea = document.getElementById("input");
    const lines = textarea.value.split('\n');
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
                    newContent += `${leftSide} = ${evaluated}\n`;
                } 
                // Case: Variable Assignment (e.g., "a = 4")
                else if (/^[a-zA-Z_]\w*$/.test(leftSide)) {  
                    const evaluated = math.evaluate(rightSide, scope);
                    scope[leftSide] = evaluated;  // Assign value to the variable in `scope`
                    newContent += `${leftSide} = ${evaluated}\n`;
                } 
                // Case: Mathematical Expression with provided result (e.g., "5 + 3 = 8")
                else {
                    const evaluated = math.evaluate(leftSide, scope);
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
            // If line already has an "Error:" substring, replace it with the new error
            if (line.includes("Error:")) {
                const errorStartIndex = line.indexOf("Error:");
                newContent += line.substring(0, errorStartIndex) + `Error: ${e.message}\n`;
            } else {
                // Otherwise, append the new error
                newContent += `${line} Error: ${e.message}\n`;
            }
        }
    }

    // Update the textarea content with the processed content
    textarea.value = newContent.trim();  // Trim to avoid any trailing newlines
}

function insertText(text) {
    const textarea = document.getElementById("input");
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    textarea.value = textarea.value.substring(0, startPos) + text + textarea.value.substring(endPos);
    textarea.selectionStart = startPos + text.length;
    textarea.selectionEnd = startPos + text.length;
    textarea.focus();
}

function clearpad() {
    if (document.getElementById("input").value == "")
        return;

    const isConfirmed = window.confirm("Are you sure you want to clear?");
    if (!isConfirmed)
        return;

    document.getElementById("input").value = "";
    window.location.hash = "";
}

function triggerRecalc() {
    calculate();
    saveToHash();  // Save content to URL hash
}
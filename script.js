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

        // Check if cursor is at the start of a line or at the start of the textarea content
        if (cursorPosition === 0 || contentBeforeCursor.endsWith('\n')) {
            // Insert a newline
            textarea.value = textarea.value.substring(0, cursorPosition) + '\n' + textarea.value.substring(cursorPosition);
            textarea.setSelectionRange(cursorPosition + 1, cursorPosition + 1); // Move cursor after the new line
            return;
        }

        previousContent = textarea.value;  // Cache the current state before calculations
        
        const currentLine = (contentBeforeCursor.match(/\n/g) || []).length;
        calculate();
        
        // Get position of the start of the next line after calculations
        const linesAfterCalc = textarea.value.split('\n');
        const charsInPreviousLines = linesAfterCalc.slice(0, currentLine + 1).join('\n').length;
        
        textarea.setSelectionRange(charsInPreviousLines + 1, charsInPreviousLines + 1);

        // After calculating, save content to URL hash
        saveToHash();
    }
}

function calculate() {
    const textarea = document.getElementById("input");
    const lines = previousContent.split('\n');  // Use cached content for calculations
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

    textarea.value = newContent;  // Update the textarea with the new content
}

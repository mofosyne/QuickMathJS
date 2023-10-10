/******************************************************************************
 * URL Hash Compression and Storage Utilities
******************************************************************************
 * The set of functions below enables the storing of the textarea's content 
 * in a compressed format within the URL's hash. This allows for sharing 
 * and restoring calculations without the need for external databases or APIs.
*/

/**
 * Compresses the content of the textarea and saves it as a Base64 string in the URL's hash.
*/
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

/**
 * Loads compressed content from the URL's hash, decompresses it, 
 * and populates the textarea with the retrieved content.
*/
async function loadFromHash() {
    if (window.location.hash) {
        const compressedBase64 = window.location.hash.substring(1);
        const compressedBlob = await base64ToBlob(compressedBase64);
        const decompressedText = await DecompressBlob(compressedBlob);
        document.getElementById("input").value = decompressedText;
    }
}

/**
 * Converts a Blob object into a Base64-encoded string.
 * @param {Blob} blob - The blob to be converted.
 * @returns {Promise<string>} - The Base64-encoded string.
*/
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

/**
 * Converts a Base64-encoded string into a Blob object.
 * @param {string} base64 - The Base64-encoded string to be converted.
 * @returns {Promise<Blob>} - The converted blob.
*/
async function base64ToBlob(base64) {
    const response = await fetch("data:application/octet-stream;base64," + base64);
    return response.blob();
}

/**
 * Decompresses a Blob object compressed using gzip.
 * @param {Blob} blob - The compressed blob.
 * @returns {Promise<string>} - The decompressed content as a string.
*/
async function DecompressBlob(blob) {
    const ds = new DecompressionStream("gzip");
    const decompressedStream = blob.stream().pipeThrough(ds);
    return new Response(decompressedStream).text();
}

// When the page loads, check for content in the hash and load it
window.addEventListener("load", function() {
    loadFromHash();
});

/******************************************************************************
 * Textarea Content Processing and Utilities
 ******************************************************************************
 * The following functions relate to the processing of the textarea's content,
 * either in response to user input or when triggered by other UI actions.
 */

let previousContent = "";  // To store the state before "Enter" is pressed
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
        
        // Update the textarea content with the processed content
        textarea.value = webcalc.calculate(previousContent);  // Trim to avoid any trailing newlines

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

/**
 * Inserts the provided text at the current cursor position in the textarea,
 * facilitating quicker text entry, especially for characters that take multiple 
 * button clicks on mobile keyboards.
 *
 * @param {string} text - The text to be inserted or to replace a selection.
 */
function insertText(text) {
    const textarea = document.getElementById("input");
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    // Replace current selection or insert text at cursor position
    textarea.value = textarea.value.substring(0, startPos) + text + textarea.value.substring(endPos);

    // Place cursor right after the inserted text
    textarea.selectionStart = startPos + text.length;
    textarea.selectionEnd = startPos + text.length;
    
    // Refocus the textarea
    textarea.focus();
}

/**
 * Clears the content of the textarea and resets the URL hash,
 * providing users a quick way to start fresh. Before clearing, 
 * the user is prompted for confirmation to prevent accidental data loss.
 */
function clearpad() {
    // Exit function if textarea is already empty
    if (document.getElementById("input").value == "")
        return;

    // Ask user for confirmation before clearing
    const isConfirmed = window.confirm("Are you sure you want to clear?");
    if (!isConfirmed)
        return;

    // Clear the textarea content and reset the URL hash
    document.getElementById("input").value = "";
    window.location.hash = "";
}

/**
 * Initiates a recalculation of the textarea's content 
 * and then updates the URL hash with the latest content.
 */
function triggerRecalc() {
    const textarea = document.getElementById("input");
    previousContent = textarea.value;  // Cache the current state before calculations
    textarea.value = webcalc.calculate(previousContent);
    saveToHash();
}

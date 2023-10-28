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
let undoStack = [];
let redoStack = [];

let previouslyWarnedMissingResult = false;

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
    const uncompressedText = document.getElementById("input").value;
    const compressedBlob = await compressBlob(uncompressedText);
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
        const decompressedText = await decompressBlob(compressedBlob);
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
 * Compresses the provided text and returns a Blob containing the compressed data.
 * @param {string} text - The text to be compressed.
 * @returns {Promise<Blob>} - The compressed blob.
 */
async function compressBlob(text) {
    const uint8Array = new TextEncoder().encode(text);
    const blob = new Blob([uint8Array], { type: "application/octet-stream" });
    const compressedStream = blob.stream().pipeThrough(new CompressionStream("gzip"));
    return new Response(compressedStream).blob();
}

/**
 * Decompresses a Blob object compressed using gzip.
 * @param {Blob} blob - The compressed blob.
 * @returns {Promise<string>} - The decompressed content as a string.
*/
async function decompressBlob(blob) {
    const ds = new DecompressionStream("gzip");
    const decompressedStream = blob.stream().pipeThrough(ds);
    return new Response(decompressedStream).text();
}

// When the page loads, check for content in the hash and load it
window.addEventListener("load", function() {
    // Initialise webcalc internals
    webcalc.initialise();

    // Load user input
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
    // Check if undo (Ctrl+Z) or redo (Cmd+Y) is pressed
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        undo();
        return;
    }
    
    if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        redo();
        return;
    }

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
        }

        previousContent = textarea.value;  // Cache the current state before calculations
        
        // Update the textarea content with the processed content
        textarea.value = webcalc.calculate(previousContent);  // Trim to avoid any trailing newlines

        if (previouslyWarnedMissingResult == false && webcalc.totalSoloExpressions > 0 && webcalc.totalCalculations === 0 && webcalc.totalResultsProvided === 0) {
            alert("Tip: Use '=' after an expression to indicate where you want to see the result!");
            previouslyWarnedMissingResult = true;
        }

        // Move the cursor to the beginning of the next line
        const nextNewLinePos = textarea.value.indexOf('\n', cursorPosition);
        if (nextNewLinePos === -1) {  // If there's no next line, move to the end
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        } else {
            textarea.setSelectionRange(nextNewLinePos + 1, nextNewLinePos + 1);
        }
        
        // After calculating, save content to URL hash
        saveToHash();

        // Push the new state after Enter is pressed and content is processed
        pushToUndo(textarea.value);
        return;
    }

    // Push the new state after Enter is pressed and content is processed
    pushToUndo(document.getElementById("input").value);
}

function pushToUndo(content) {
    undoStack.push(content);
    redoStack = [];  // Clear redo stack when new content is added to undo
}

function undo() {
    if (undoStack.length > 1) {  // Keep at least one state in undoStack to revert to
        const currentContent = undoStack.pop();
        redoStack.push(currentContent);
        document.getElementById("input").value = undoStack[undoStack.length - 1];
    }
}

function redo() {
    if (redoStack.length > 0) {
        const contentToRedo = redoStack.pop();
        undoStack.push(contentToRedo);
        document.getElementById("input").value = contentToRedo;
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

    // Push the cleared state
    pushToUndo("");
}

/**
 * Initiates a recalculation of the textarea's content 
 * and then updates the URL hash with the latest content.
 */
function triggerRecalc() {
    const textarea = document.getElementById("input");
    previousContent = textarea.value;  // Cache the current state before calculations
    textarea.value = webcalc.calculate(previousContent);

    if (previouslyWarnedMissingResult == false && webcalc.totalSoloExpressions > 0 && webcalc.totalCalculations === 0 && webcalc.totalResultsProvided === 0) {
        alert("Tip: Use '=' after an expression to indicate where you want to see the result!");
        previouslyWarnedMissingResult = true;
    }

    saveToHash();

    // Push the recalculated state
    pushToUndo(textarea.value);
}

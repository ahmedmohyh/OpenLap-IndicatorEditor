/**
 * Updates the size of an iframe in the given HTML string by modifying its width and height attributes.
 *
 * @param {string} original - The original HTML string containing the iframe.
 * @param {number} height - The new height for the iframe.
 * @param {number} width - The new width for the iframe.
 * @returns {string} - The modified HTML string with updated iframe size.
 * @author Louis Born <louis.born@stud.uni-due.de>
 */
const iframeSizeUpdater = (original, height, width) => {
    var tempElement = document.createElement('div');
    tempElement.innerHTML = original;

    // Get the iframe element from the temporary element
    var iframeElement = tempElement.querySelector('iframe');

    // Check if the iframe element exists
    if (iframeElement) {
        iframeElement.setAttribute('width', `${width}px`);
        iframeElement.setAttribute('height', `${height}px`);
        var modifiedString = tempElement.innerHTML;

        return modifiedString;
    } else {
        console.error("No iframe element found in the string.");
    }
}

export default iframeSizeUpdater;
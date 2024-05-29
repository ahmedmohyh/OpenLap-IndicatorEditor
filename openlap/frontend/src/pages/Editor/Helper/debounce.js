/**
 * Debounces a function with a cooldown period to prevent it from being called too frequently (example usage: Snackbar).
 *
 * @param {Function} func - The function to be debounced.
 * @param {number} cooldownPeriod - The cooldown period in milliseconds.
 * @returns {Function} - The debounced function.
 * @author Louis Born <louis.born@stud.uni-due.de>
 */
export default function debounceWithCooldown(func, cooldownPeriod) {
    let lasShowTime = 0;
    let timer;

    return function (...args) {
        const context = this;
        const currentTime = Date.now();

        if (currentTime - lasShowTime < cooldownPeriod) {
            return;
        }

        func.apply(context, args);
        clearTimeout(timer);

        timer = setTimeout(() => {
            func.apply(context, ["", false]);
            lasShowTime = Date.now();
        }, cooldownPeriod)
    };
}
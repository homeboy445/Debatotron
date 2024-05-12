
export const throttle = (callback, timeout) => {
    let lastTimeout = null;
    return () => {
        if (lastTimeout !== null) {
            clearTimeout(lastTimeout);
            lastTimeout = null;
        }
        lastTimeout = setTimeout(() => {
            callback();
            lastTimeout = null;
        }, timeout);
    };
}

export function getLastPathSegment(url) {
    return url.split("/").pop();
}

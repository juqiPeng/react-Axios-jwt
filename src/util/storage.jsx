export function setValue(key, value) {
    window.localStorage.setItem(key, value);
}

export function getValue(key) {
    return window.localStorage.getItem(key);
}

export function clearValue(key) {
    return window.localStorage.removeItem(key);
}

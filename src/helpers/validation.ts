export function isEmail(value: string) {
    return /^[^@]+@[^@]+$/.test(value);
}

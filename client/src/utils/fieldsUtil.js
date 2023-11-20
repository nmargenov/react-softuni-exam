const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

export function isValidEmail(email) {
    return emailRegex.test(email);
}

export function birthdateValidator(birthdate) {
    if (!birthdate) {
        return false;
    }
    const year = String(birthdate).split('-')[0];
    return !(Number(year) >= 1900 && Number(year) <= 2023);
}
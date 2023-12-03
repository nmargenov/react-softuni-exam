const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
const usernameRegex = /^[\w.]+$/;

export function isValidEmail(email) {
    return emailRegex.test(email);
}

export function isValidUsername(username){
    if(username === ""){
        return true;
    }
    return usernameRegex.test(username);
}

export function birthdateValidator(birthdate) {
    if (!birthdate) {
        return false;
    }
    const year = String(birthdate).split('-')[0];
    return !(Number(year) >= 1900 && Number(year) <= 2023);
}
const LOWER_CASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const UPPER_CASE_CHARS = LOWER_CASE_CHARS.map((x) => x.toUpperCase());
const NUMBERS = '0123456789'.split('');
const SYMBOLS = '!@#$%^&'.split('');
const LETTERS_MIX = [...LOWER_CASE_CHARS, ...UPPER_CASE_CHARS, ...NUMBERS, ...SYMBOLS];
const CHARS_LENGTH = LETTERS_MIX.length;

function containsLowerCase(str: string): boolean {
  return LOWER_CASE_CHARS.some((x) => str.includes(x));
}

function containsUpperCase(str: string): boolean {
  return UPPER_CASE_CHARS.some((x) => str.includes(x));
}

function containsNumber(str: string): boolean {
  return NUMBERS.some((x) => str.includes(x));
}

function containsSymbol(str: string): boolean {
  return SYMBOLS.some((x) => str.includes(x));
}

function isValidPassword(password: string) {
  return (
    containsLowerCase(password) &&
    containsUpperCase(password) &&
    containsSymbol(password) &&
    containsNumber(password)
  );
}

export function generatePassword(length: number = 8): string {
  const buff = new Uint8Array(length);

  let generatedPassword = '';

  do {
    window.crypto.getRandomValues(buff);
    generatedPassword = [...buff].map((x) => LETTERS_MIX[x % CHARS_LENGTH]).join('');
  } while (!isValidPassword(generatedPassword));

  return generatedPassword;
}

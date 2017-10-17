import { Token } from './types';

const regexWhitespace = /\s/;
const regexNumber = /[0-9]/;
const regexIdentifier = /[a-z0-9_]/i;

export default (source: string): Array<Token> => {
  const tokens: Array<Token> = [];

  source = source.replace(/\\303\\200/g, 'À');
  source = source.replace(/\\303\\203/g, 'Ã');
  source = source.replace(/\\303\\207/g, 'Ç');
  source = source.replace(/\\303\\211/g, 'É');
  source = source.replace(/\\303\\212/g, 'Ê');
  source = source.replace(/\\303\\215/g, 'Í');
  source = source.replace(/\\303\\223/g, 'Ó');
  source = source.replace(/\\303\\240/g, 'à');
  source = source.replace(/\\303\\243/g, 'ã');
  source = source.replace(/\\303\\247/g, 'ç');
  source = source.replace(/\\303\\251/g, 'é');
  source = source.replace(/\\303\\252/g, 'ê');
  source = source.replace(/\\303\\255/g, 'é');
  source = source.replace(/\\303\\263/g, 'ó');

  let currentIndex = 0;

  while (currentIndex < source.length) {
    let char = source[currentIndex];

    if (char === '%') {
      while (char !== '\n') {
        char = source[++currentIndex];
      }

      continue;
    }

    if (char === '=') {
      tokens.push({ type: 'equal' });
      currentIndex++;
      continue;
    }

    if (char === ';') {
      tokens.push({ type: 'semicolon' });
      currentIndex++;
      continue;
    }

    if (char === '|') {
      tokens.push({ type: 'pipe' });
      currentIndex++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'openparen' });
      currentIndex++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'closeparen' });
      currentIndex++;
      continue;
    }

    if (char === '{') {
      tokens.push({ type: 'openbracket' });
      currentIndex++;
      continue;
    }

    if (char === '}') {
      tokens.push({ type: 'closebracket' });
      currentIndex++;
      continue;
    }

    if (regexWhitespace.test(char)) {
      currentIndex++;
      continue;
    }

    if (char === '"') {
      let value = '';

      char = source[++currentIndex];

      while (char !== '"') {
        value += char;
        char = source[++currentIndex];
      }

      tokens.push({ type: 'string', value });
      currentIndex++;
      continue;
    }

    if (regexNumber.test(char)) {
      let value = '';
      let foundDecimalSeparator = false;

      while (
        regexNumber.test(char) ||
        (char === '.' && foundDecimalSeparator === false)
      ) {
        if (char === '.') {
          foundDecimalSeparator = true;
        }

        value += char;
        char = source[++currentIndex];
      }

      tokens.push({ type: 'number', value: parseFloat(value) });
      continue;
    }

    if (regexIdentifier.test(char)) {
      let value = '';

      while (regexIdentifier.test(char)) {
        value += char;
        char = source[++currentIndex];
      }

      switch (value) {
        case 'net':
          tokens.push({ type: 'net' });
          break;
        case 'node':
          tokens.push({ type: 'node' });
          break;
        case 'potential':
          tokens.push({ type: 'potential' });
          break;
        default:
          tokens.push({ type: 'identifier', value });
          break;
      }

      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
};

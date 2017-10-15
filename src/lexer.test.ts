import * as fs from 'fs';
import * as path from 'path';
import lexer from './lexer';

it('reads tokens correctly', () => {
  const source = readNetwork('chuva');
  expect(lexer(source)).toMatchSnapshot();
});

const readNetwork = networkName => {
  const networkPath = path.join(__dirname, `../networks/${networkName}.net`);
  const networkSource = fs.readFileSync(networkPath).toString();

  return networkSource;
};

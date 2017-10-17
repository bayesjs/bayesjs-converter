import * as fs from 'fs';
import * as path from 'path';
import lexer from './lexer';
import parser from './parser';
import converter from './converter';

it('converts network correctly', () => {
  const source = readNetwork('chuva');
  const tokens = lexer(source);
  const ast = parser(tokens);
  const bayesnet = converter(ast);

  expect(tokens).toMatchSnapshot();
  expect(ast).toMatchSnapshot();
  expect(bayesnet).toMatchSnapshot();
});

const readNetwork = (networkName: string) => {
  const networkPath = path.join(__dirname, `../networks/${networkName}.net`);
  const networkSource = fs.readFileSync(networkPath).toString();

  return networkSource;
};

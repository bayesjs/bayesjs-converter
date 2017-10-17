import * as fs from 'fs';
import * as path from 'path';
import { convert } from './index';
import lexer from './lexer';
import parser from './parser';
import converter from './converter';

it('converts network correctly', () => {
  const source = readNetwork('chuva');
  const bayesnet = convert(source);

  expect(bayesnet).toMatchSnapshot();
});

it('converts network step by step correctly', () => {
  const source = readNetwork('chuva');
  const tokens = lexer(source);
  const ast = parser(tokens);
  const bayesnet = converter(ast);

  expect(tokens).toMatchSnapshot();
  expect(ast).toMatchSnapshot();
  expect(bayesnet).toMatchSnapshot();
});

it('handles accents correctly', () => {
  expect(lexer('"\\303\\200"')).toEqual([{ type: 'string', value: 'À' }]);
  expect(lexer('"\\303\\203"')).toEqual([{ type: 'string', value: 'Ã' }]);
  expect(lexer('"\\303\\207"')).toEqual([{ type: 'string', value: 'Ç' }]);
  expect(lexer('"\\303\\211"')).toEqual([{ type: 'string', value: 'É' }]);
  expect(lexer('"\\303\\212"')).toEqual([{ type: 'string', value: 'Ê' }]);
  expect(lexer('"\\303\\215"')).toEqual([{ type: 'string', value: 'Í' }]);
  expect(lexer('"\\303\\223"')).toEqual([{ type: 'string', value: 'Ó' }]);
  expect(lexer('"\\303\\240"')).toEqual([{ type: 'string', value: 'à' }]);
  expect(lexer('"\\303\\243"')).toEqual([{ type: 'string', value: 'ã' }]);
  expect(lexer('"\\303\\247"')).toEqual([{ type: 'string', value: 'ç' }]);
  expect(lexer('"\\303\\251"')).toEqual([{ type: 'string', value: 'é' }]);
  expect(lexer('"\\303\\252"')).toEqual([{ type: 'string', value: 'ê' }]);
  expect(lexer('"\\303\\255"')).toEqual([{ type: 'string', value: 'é' }]);
  expect(lexer('"\\303\\263"')).toEqual([{ type: 'string', value: 'ó' }]);
});

const readNetwork = (networkName: string) => {
  const networkPath = path.join(__dirname, `../networks/${networkName}.net`);
  const networkSource = fs.readFileSync(networkPath).toString();

  return networkSource;
};

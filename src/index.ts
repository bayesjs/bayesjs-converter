import lexer from './lexer';
import parser from './parser';
import converter from './converter';

export const convert = (source: string) => {
  const tokens = lexer(source);
  const ast = parser(tokens);
  const bayesnet = converter(ast);

  return bayesnet;
};

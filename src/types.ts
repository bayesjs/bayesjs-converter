export type Token =
  | { type: 'net' }
  | { type: 'node' }
  | { type: 'potential' }
  | { type: 'identifier'; value: string }
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'equal' }
  | { type: 'semicolon' }
  | { type: 'pipe' }
  | { type: 'openparen' }
  | { type: 'closeparen' }
  | { type: 'openbracket' }
  | { type: 'closebracket' };

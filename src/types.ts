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

export type RootNode = {
  type: 'root';
  items: Array<RootNodeItem>;
};

export type RootNodeItem = NetNode | NodeNode | PotentialNode;

export type NetNode = {
  type: 'net';
  properties: Array<PropertyNode>;
};

export type NodeNode = {
  type: 'node';
  name: string;
  properties: Array<PropertyNode>;
};

export type PotentialNode = {
  type: 'potential';
  node: string;
  given: Array<string>;
  properties: Array<PropertyNode>;
};

export type PropertyNode = {
  type: 'property';
  name: string;
  value: any;
};

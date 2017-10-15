import {
  Token,
  RootNode,
  RootNodeItem,
  NetNode,
  NodeNode,
  PotentialNode,
  PropertyNode
} from './types';

export default (tokens: Array<Token>) => {
  let currentIndex = 0;

  const readNextToken = (): Token => {
    return tokens[currentIndex++];
  };

  const assertNextToken = (type: string) => {
    const token = readNextToken();

    if (token.type !== type) {
      throw unexpectedToken(token);
    }
  };

  const unexpectedToken = (token: Token) => {
    return new Error(`Unexpected token: ${token.type}`);
  };

  const parseArray = (): Array<any> => {
    const array: Array<any> = [];

    assertNextToken('openparen');

    let token = readNextToken();

    while (token.type !== 'closeparen') {
      switch (token.type) {
        case 'number':
        case 'string':
          array.push(token.value);
          break;
        case 'openparen':
          currentIndex--;
          array.push(parseArray());
          break;
        default:
          throw unexpectedToken(token);
      }

      token = readNextToken();
    }

    return array;
  };

  const parseProperties = (): Array<PropertyNode> => {
    const properties: Array<PropertyNode> = [];

    assertNextToken('openbracket');

    let token = readNextToken();

    while (token.type !== 'closebracket') {
      if (token.type !== 'identifier') {
        throw unexpectedToken(token);
      }

      const property: PropertyNode = {
        type: 'property',
        name: token.value,
        value: ''
      };

      assertNextToken('equal');

      token = readNextToken();

      switch (token.type) {
        case 'string':
          property.value = token.value;
          break;
        case 'openparen':
          currentIndex--;
          property.value = parseArray();
          break;
        default:
          throw unexpectedToken(token);
      }

      assertNextToken('semicolon');

      properties.push(property);
      token = readNextToken();
    }

    return properties;
  };

  const parseNet = (): NetNode => {
    const net: NetNode = {
      type: 'net',
      properties: parseProperties()
    };

    return net;
  };

  const parseNode = (): NodeNode => {
    const node: NodeNode = {
      type: 'node',
      name: '',
      properties: []
    };

    const token = readNextToken();

    if (token.type !== 'identifier') {
      throw unexpectedToken(token);
    }

    node.name = token.value;
    node.properties = parseProperties();

    return node;
  };

  const parsePotential = (): PotentialNode => {
    const potential: PotentialNode = {
      type: 'potential',
      node: '',
      given: [],
      properties: []
    };

    assertNextToken('openparen');

    let token = readNextToken();

    if (token.type !== 'identifier') {
      throw unexpectedToken(token);
    }

    potential.node = token.value;

    token = readNextToken();

    if (token.type === 'pipe') {
      token = readNextToken();

      while (token.type !== 'closeparen') {
        if (token.type !== 'identifier') {
          throw unexpectedToken(token);
        }

        potential.given.push(token.value);
        token = readNextToken();
      }
    } else if (token.type !== 'closeparen') {
      throw unexpectedToken(token);
    }

    potential.properties = parseProperties();

    return potential;
  };

  const parseAst = (): RootNodeItem => {
    const token = readNextToken();

    switch (token.type) {
      case 'net':
        return parseNet();
      case 'node':
        return parseNode();
      case 'potential':
        return parsePotential();
      default:
        throw unexpectedToken(token);
    }
  };

  const ast: RootNode = {
    type: 'root',
    items: []
  };

  while (currentIndex < tokens.length) {
    ast.items.push(parseAst());
  }

  return ast;
};

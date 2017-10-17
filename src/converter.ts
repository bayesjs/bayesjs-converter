import { RootNode, NodeNode, PotentialNode } from './types';

export default (ast: RootNode) => {
  const convertNode = (node: NodeNode) => {
    const statesProperty = node.properties.find(x => x.name === 'states');

    if (statesProperty === undefined) {
      throw new Error(`states not found: ${node.name}`);
    }

    return {
      id: node.name,
      states: statesProperty.value,
      parents: [] as Array<string>,
      cpt: null as any
    };
  };

  const convertPosition = (node: NodeNode) => {
    const positionProperty = node.properties.find(x => x.name === 'position');

    if (positionProperty === undefined) {
      throw new Error(`position not found: ${node.name}`);
    }

    return {
      [node.name]: {
        x: positionProperty.value[0],
        y: positionProperty.value[1]
      }
    };
  };

  const nodesAst = ast.items.filter(x => x.type === 'node') as Array<NodeNode>;
  const potentialsAst = ast.items.filter(x => x.type === 'potential') as Array<
    PotentialNode
  >;

  const network = {
    name: 'Rede Bayesiana',
    height: 500, // TODO: Calculate it?
    width: 800,
    selectedNodes: [],
    beliefs: {},
    propertiesPanelVisible: true
  };

  const nodes = nodesAst.map(convertNode);

  const positions = nodesAst.reduce(
    (acc, x) => ({ ...acc, ...convertPosition(x) }),
    {}
  );

  potentialsAst.forEach(potential => {
    const node = nodes.find(x => x.id === potential.node);
    const data = potential.properties.find(x => x.name === 'data');

    if (node === undefined) {
      throw new Error(`node not found: ${potential.node}`);
    }

    if (data === undefined) {
      throw new Error(`data not found: ${potential.node}`);
    }

    node.parents = potential.given;

    if (node.parents.length === 0) {
      node.cpt = {};

      for (let i = 0; i < data.value.length; i++) {
        node.cpt[node.states[i]] = data.value[i];
      }
    } else {
      node.cpt = [];

      const buildCpt = (parents: Array<string>, data: any, when: object) => {
        if (parents.length === 0) {
          const then: any = {};

          for (let i = 0; i < data.length; i++) {
            then[node.states[i]] = data[i];
          }

          node.cpt.push({ when, then });
          return;
        }

        const [parent, ...remainingParents] = parents;
        const parentNode = nodes.find(x => x.id === parent);

        if (parentNode === undefined) {
          throw new Error(`parent not found: ${parent}`);
        }

        parentNode.states.forEach(
          (parentState: string, parentIndex: number) => {
            const accWhen = { ...when, [parent]: parentState };
            buildCpt(remainingParents, data[parentIndex], accWhen);
          }
        );
      };

      buildCpt(node.parents, data.value, {});
    }
  });

  return {
    version: 2,
    network,
    nodes,
    positions
  };
};

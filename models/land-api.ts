// Hey Emacs, this is -*- coding: utf-8 -*-

import fetch from 'isomorphic-unfetch';
import { ProcessTreeData } from './gate';

const landUri = 'http://localhost:8529/_db/_system/land';

const processQueryResult = await fetch(landUri, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    // https://github.com/apollographql/eslint-plugin-graphql
    // use gql literal stub for now - until there is a nedd for AST
    query: `
      query GetProcess($id: String!) {
        process(id: $id) {
          collection
          id
          name
          inComponents {
            collection
            id
            name
          }
          outComponents {
            collection
            id
            name
          }
        }
      }
    `,
    variables: {
      id: '0000',
    },
  }),
}).then((r): any => r.json());

const { process } = processQueryResult.data;

const treeData: ProcessTreeData = [];

treeData.push({
  collection: process.collection,
  id: process.id,
  title: process.name,
  children: [{
    collection: 'output',
    id: process.id,
    title: 'Output Components',
    children: [],
  }, {
    collection: 'input',
    id: process.id,
    title: 'Input Components',
    children: [],
  }],
});

const outComponents = treeData[0].children![0].children!;

for(const component of process.outComponents) {
  outComponents.push({
    collection: component.collection,
    id: component.id,
    title: component.name,
  });
}

const inComponents = treeData[0].children![1].children!;

for(const component of process.inComponents) {
  inComponents.push({
    collection: component.collection,
    id: component.id,
    title: component.name,
  });
}

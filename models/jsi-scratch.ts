// Hey Emacs, this is -*- coding: utf-8 -*-

import fetch from 'isomorphic-unfetch';

prom = fetch('http://localhost:8529/_db/_system/land', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    query: `{
      query GetElement {
        element(id: "0000") {
          collection
          id
          name
          description
        }
      }
    }`,
  }),
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));

await fetch('http://localhost:8529/_db/_system/land', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    'query': `
      query GetElement($id: String!) {
        element(id: $id) {
          collection
          id
          name
          description
        }
      }
    `,
    variables: {
      id: "0000",
    },
  }),
}).then(r => r.json());

function add(a: number, b: number) {
  return a + b
}

add(1, 2);

add('a', 'b');

// ------------------------

import { diff } from 'deep-diff';

interface Test {
  name: string;
  description: string;
  details: {
    it: string;
    an: string;
    with: (string | { than: string })[];
  };
}

const lhs: Test = {
  name: 'my object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'elements'],
  },
};

const rhs: Test = {
  name: 'updated object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'more', 'elements', { than: 'before' }],
  },
};

const differences = diff(lhs, rhs);

// ------------------------

import dd from 'deep-diff';

const treeData0 = [{
  collection: 'processes',
  id: '0000',
  title: 'Do something good',
  children: [{
    title: 'Input Components',
    children: [],
  }, {
    title: 'Output Components',
    children: [],
  }],
}];

const treeData1 = [{
  collection: 'processes',
  id: '0000',
  title: 'Do something good',
  expanded: true,
  children: [{
    title: 'Input Components',
    children: [],
  }, {
    title: 'Output Components',
    children: [],
  }],
}];

const changes = dd.diff(treeData0, treeData1);

if(changes) changes.forEach((change): void => {
  dd.applyChange(treeData0, {}, change);
});

if(changes) changes.forEach((change): void => {
  dd.revertChange(treeData1, {}, changes[0]);
});

dd.applyChange(treeData0, undefined, changes[0]);


myItems = [1]
i = myItems.length;
while (i--) {
  console.log("***", myItems[i]);
}

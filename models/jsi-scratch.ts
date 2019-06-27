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
import clonedeep from 'lodash.clonedeep';

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

const treeData1 = {
  data: [{
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
  }]
};

const treeData2 = {
  data: [{
    title: 'Input Components',
    children: [],
  }, {
    title: 'Do something good',
    collection: 'processes',
    id: '0000',
    expanded: true,
    children: [{
      title: 'Output Components',
      children: [],
    }],
  }],
};

const changes = dd.diff(treeData0, treeData1);
const changes = dd.diff(treeData1, treeData2);

if(changes) changes.forEach((change): void => {
  dd.applyChange(treeData1, true, change);
});

if(changes) changes.forEach((change): void => {
  dd.revertChange(treeData1, true, change);
});

dd.revertChange(treeData1, true, changes[0]);

let i = changes.length;
while(i--) {
  const change = deltaRevert[i];
  dd.revertChange(this._treeData, true, change);
  this._treeData = [...this._treeData];
}

// Comments to deep-diff creator:
//   * Apply/revert second argument has to be truthy
//   * Using object returned by diff needs to be deep-cloned
//     to apply/revert on the same tree from which it was created.
//     Otherwise may end-up with circular refs in the tree.
//   * Root object passed as the first argument to apply/revert may not be
//     array besouse revertChange() function does "u = change.path.length - 1;"
//     and change.path does not exist on DiffArray.

myItems = [1]
i = myItems.length;
while (i--) {
  console.log("***", myItems[i]);
}

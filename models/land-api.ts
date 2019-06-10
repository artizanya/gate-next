// Hey Emacs, this is -*- coding: utf-8 -*-

import fetch from 'isomorphic-unfetch';

fetch('http://localhost:8529/_db/_system/land', {
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
    query: `
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
  return a + b;
}

add(1, 2);

add('a', 'b');

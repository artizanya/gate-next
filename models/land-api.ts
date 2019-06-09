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

// see https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-imports-being-elided-in-my-emit
import 'isomorphic-unfetch';
import fetch from 'isomorphic-unfetch';

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
      id: "0001",
    },
  }),
}).then(r => r.json());

function add(a: number, b: number) {
  return a + b;
}

add(1, 2);

add('a', 'b');

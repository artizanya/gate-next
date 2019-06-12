// Hey Emacs, this is -*- coding: utf-8 -*-

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
      id: '0000',
    },
  }),
}).then((r): any => r.json());

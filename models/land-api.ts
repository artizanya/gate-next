// Hey Emacs, this is -*- coding: utf-8 -*-

// import fetch from 'isomorphic-unfetch';
const fetch = require('isomorphic-unfetch');

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

resp = await fetch('http://localhost:8529/_db/_system/land', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    query: `query GetElement {
      element(id: "0000") {
        collection
        id
        name
        description
      }
    }`,
  }),
}).then(r => r.json());

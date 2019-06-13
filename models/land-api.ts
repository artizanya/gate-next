// Hey Emacs, this is -*- coding: utf-8 -*-

import fetch from 'isomorphic-unfetch';
import { ProcessTreeItem, ProcessTreeData, GateModel } from './gate';

export default class LandApi {
  constructor(
    gateModel: GateModel,
    landUri: string = 'http://localhost:8529/_db/_system/land',
  ) {
    this._gateModel = gateModel;
    this._landUri = landUri;
  }

  async loadProcessTree(): Promise<void> {
    const processQueryResult = await fetch(this._landUri, {
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

    let outComponents;
    if(treeData[0] && treeData[0].children[0]) {
      outComponents = treeData[0].children[0].children;
    }

    process.outComponents.forEach(
      (component: any): void => outComponents.push({
        ...component.collection,
      }),
    );

    const inComponents = treeData[0] as ProcessTreeItem
      .children[1] as ProcessTreeItem
      .children;

    process.inComponents.forEach(
      (component: any): void => inComponents.push({
        ...component.collection,
      }),
    );

    this._gateModel.processTree.setTreeData(treeData);
  }

  private _gateModel: GateModel;
  private _landUri: string;
}

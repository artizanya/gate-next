// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { createContext, useContext } from 'react';

import fetch from 'isomorphic-unfetch';
import { ProcessTreeData, GateModel } from './gate';

class LandApi {
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
        // use gql literal stub for now - until there is a need for AST
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
        title: 'Input Components',
        children: [],
      }, {
        title: 'Output Components',
        children: [],
      }],
    });

    const inComponents = treeData[0].children[1].children;

    process.inComponents.forEach(
      ({ name, id, collection }: {
        name: string;
        id: string;
        collection: string;
      }): void => {
        inComponents.push({ title: name, id, collection });
      },
    );

    const outComponents = treeData[0].children[1].children;

    process.outComponents.forEach(
      ({ name, id, collection }: {
        name: string;
        id: string;
        collection: string;
      }): void => {
        outComponents.push({ title: name, id, collection });
      },
    );

    this._gateModel.processTree.setTreeData(treeData);
  }

  private _gateModel: GateModel;
  private _landUri: string;
}

interface LandApiContextProviderProps {
  children?: React.ReactNode;
}

export default function createLandApiContextProvider(
  gateModel: GateModel,
  landUri: string = 'http://localhost:8529/_db/_system/land',
): [
  (props: LandApiContextProviderProps) => JSX.Element,
  () => LandApi,
  React.Context<LandApi>,
] {
  const LandApiContext = createContext<LandApi>(null as unknown as LandApi);

  const LandApiContextProvider =
    (props: LandApiContextProviderProps): JSX.Element => {
      const landApi = new LandApi(gateModel, landUri);
      return (
        <LandApiContext.Provider value={landApi}>
          {props.children}
        </LandApiContext.Provider>
      );
    };

  const useLandApiContext = (): LandApi => useContext(LandApiContext);

  return [LandApiContextProvider, useLandApiContext, LandApiContext];
}

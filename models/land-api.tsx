// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { createContext, useContext, useRef } from 'react';

import fetch from 'isomorphic-unfetch';
import {
  ProcessTreeData,
  GateModel,
  useGateModelContext,
  ProcessTreeProcess,
} from './gate';

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

    const inComponents = treeData[0].children[0].children;

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

  // loadProcessTree(): void {
  //   const treeData = [{
  //     collection: 'processes',
  //     id: '0000',
  //     title: 'Do something better',
  //     children: [{
  //       title: 'Input Components',
  //       children: [],
  //     }, {
  //       title: 'Output Components',
  //       children: [],
  //     }],
  //   }];
  //
  //   this._gateModel.processTree.setTreeData(treeData);
  // }

  setTreeData(value: ProcessTreeProcess[]): void {
    this._gateModel.processTree.setTreeData(value);
  }

  private _gateModel: GateModel;
  private _landUri: string;
}

class GateApi {
  constructor(gateModel: GateModel) {
    this._land = new LandApi(gateModel);
  }

  get land(): LandApi {
    return this._land;
  }

  private _land: LandApi;
}

interface LandApiContextProviderProps {
  children?: React.ReactNode;
}

type GateApiRef = React.MutableRefObject<GateApi>;

export default function createLandApiContextProvider(): [
  (props: LandApiContextProviderProps) => JSX.Element,
  () => GateApiRef,
  // React.Context<GateApiRef>,
] {
  const GateApiRefContext =
    createContext<GateApiRef>(null as unknown as GateApiRef);

  const GateApiRefContextProvider =
    (props: LandApiContextProviderProps): JSX.Element => {
      const gateModel = useGateModelContext();
      const gateApiRef = useRef(new GateApi(gateModel));
      return (
        <GateApiRefContext.Provider value={gateApiRef}>
          {props.children}
        </GateApiRefContext.Provider>
      );
    };

  const useGateApiRefContext =
    (): GateApiRef => useContext(GateApiRefContext);

  return [
    GateApiRefContextProvider,
    useGateApiRefContext,
    // GateApiRefContext,
  ];
}

const [
  GateApiRefContextProvider,
  useGateApiRefContext,
] = createLandApiContextProvider();

export {
  GateApiRefContextProvider,
  useGateApiRefContext,
};

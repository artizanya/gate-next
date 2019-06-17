// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { createContext, useContext, useState } from 'react';

import fetch from 'isomorphic-unfetch';
import {
  ProcessTreeData,
  GateModel,
  useGateModelContext,
  ProcessTreeProcess,
} from './gate';

// TODO: landUri should be moved to global config
const configLandUri = 'http://localhost:8529/_db/_system/land';

class LandSource {
  constructor(uri: string) {
    this.uri = uri;
  }

  uri: string;
}

type LandSourceState = LandSource;

type LandSourceSetState =
  React.Dispatch<React.SetStateAction<LandSourceState>>;

class LandApi {
  constructor(
    gateModel: GateModel,
    sourceState: LandSourceState,
    sourceSetState: LandSourceSetState,
  ) {
    this._gateModel = gateModel;
    this._sourceState = sourceState;
    this._sourceSetState = sourceSetState;
  }

  async loadProcessTree(): Promise<void> {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    const processQueryResult = await fetch(this.source.uri, {
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

  get source(): LandSource {
    return this._sourceState;
  }

  set source(value: LandSource) {
    console.log('!!!!!!!!!!!!!!!!!');
    this._sourceSetState(value);
  }

  setSourceUri(uri: string): void {
    this.source = new LandSource(uri);
  }

  private _gateModel: GateModel;
  private _sourceState: LandSourceState;
  private _sourceSetState: LandSourceSetState;
}

export class GateApi {
  constructor(
    gateModel: GateModel,
    sourceState: LandSourceState,
    sourceSetState: LandSourceSetState,
  ) {
    this._model = gateModel;
    this._landApi = new LandApi(gateModel, sourceState, sourceSetState);
  }

  get model(): GateModel {
    return this._model;
  }

  get landApi(): LandApi {
    return this._landApi;
  }

  private _model: GateModel;
  private _landApi: LandApi;
}

interface GateApiContextProviderProps {
  children?: React.ReactNode;
}

function createGateApiContextProvider(): [
  (props: GateApiContextProviderProps) => JSX.Element,
  () => GateApi,
  // React.Context<GateApi>,
] {
  const GateApiContext =
    createContext<GateApi>(null as unknown as GateApi);

  const GateApiContextProvider =
    (props: GateApiContextProviderProps): JSX.Element => {
      const gateModel = useGateModelContext();

      const [
        landSourceState,
        landSourceStateSet,
      ] = useState(new LandSource(configLandUri));

      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', landSourceState.uri);

      const gateApi = new GateApi(
        gateModel,
        landSourceState,
        landSourceStateSet,
      );

      // TODO: This should happen only in development mode!
      if(typeof window !== 'undefined') {
        window.gateApi = gateApi;
      }

      return (
        <GateApiContext.Provider value={gateApi}>
          {props.children}
        </GateApiContext.Provider>
      );
    };

  const useGateApiContext =
    (): GateApi => useContext(GateApiContext);

  return [
    GateApiContextProvider,
    useGateApiContext,
    // GateApiContext,
  ];
}

const [
  GateApiContextProvider,
  useGateApiContext,
] = createGateApiContextProvider();

export {
  GateApiContextProvider,
  useGateApiContext,
};

// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { createContext, useContext, useRef } from 'react';

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
    this._uri = uri;
  }

  get uri(): string {
    return this._uri;
  }

  private _uri: string;
}

class LandApi {
  constructor(
    gateModel: GateModel,
    source: LandSource,
  ) {
    this._gateModel = gateModel;
    this._source = source;
  }

  async loadProcessTree(): Promise<void> {
    const processQueryResult = await fetch(this._source.uri, {
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
    return this._source;
  }

  private _gateModel: GateModel;
  private _source: LandSource;
}

class GateApi {
  constructor(gateModel: GateModel, landSource: LandSource) {
    this._gateModel = gateModel;
    this._landApi = new LandApi(gateModel, landSource);
  }

  get gateModel(): GateModel {
    return this._gateModel;
  }

  get landApi(): LandApi {
    return this._landApi;
  }

  private _gateModel: GateModel;
  private _landApi: LandApi;
}

type GateApiRef = React.MutableRefObject<GateApi>;

interface GateApiRefContextProviderProps {
  children?: React.ReactNode;
}

export default function createGateApiRefContextProvider(): [
  (props: GateApiRefContextProviderProps) => JSX.Element,
  () => GateApiRef,
  // React.Context<GateApi>,
] {
  const GateApiRefContext =
    createContext<GateApiRef>(null as unknown as GateApiRef);

  const GateApiRefContextProvider =
    (props: GateApiRefContextProviderProps): JSX.Element => {
      const gateModel = useGateModelContext();
      const landSource = new LandSource(configLandUri);
      const gateApiRef = useRef(new GateApi(gateModel, landSource));
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
] = createGateApiRefContextProvider();

export {
  GateApiRefContextProvider,
  useGateApiRefContext,
};

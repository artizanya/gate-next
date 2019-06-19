// Hey Emacs, this is -*- coding: utf-8 -*-

import {
  StateModel,
  createStateModelRefContextProvider,
} from './react-state-model';

import { GateStore } from './gate-store';

export default class Gate extends StateModel {
  constructor() {
    super();

    console.log('!!!! here');
  }

  get store(): GateStore {
    return this._store;
  }

  private _store: GateStore = new GateStore();
}

const [
  GateRefContextProvider,
  useGateRefContext,
] = createStateModelRefContextProvider(Gate);

export {
  GateRefContextProvider,
  useGateRefContext,
};

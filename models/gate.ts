// Hey Emacs, this is -*- coding: utf-8 -*-

import {
  StateModel,
  createStateModelContextProvider,
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
  GateContextProvider,
  useGateContext,
] = createStateModelContextProvider(Gate);

export {
  GateContextProvider,
  useGateContext,
};

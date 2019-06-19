// Hey Emacs, this is -*- coding: utf-8 -*-

import {
  Model,
  createModelRefContextProvider,
} from './use-model';

import { GateStore } from './gate-store';

export default class Gate extends Model {
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
] = createModelRefContextProvider(Gate);

export {
  GateRefContextProvider,
  useGateRefContext,
};

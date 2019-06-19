// Hey Emacs, this is -*- coding: utf-8 -*-

import {
  StateModel,
  StateModelUpdate,
  createStateModelContextProvider,
} from './react-state-model';

import { GateStore } from './gate-store';

// export type StateModelSetState<Model> =
//   React.Dispatch<React.SetStateAction<Model>>;

export default class Gate extends StateModel {
  constructor() {
    super();

    console.log('!!!! here');
  }

  get store(): GateStore {
    return this._store;
  }

  setUpdate(value: StateModelUpdate): void {
    console.log('!!!! yyyy here');

    this.update = value;
    this.store.setUpdate(value);
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

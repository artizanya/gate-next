// Hey Emacs, this is -*- coding: utf-8 -*-

import {
  StateModel,
  StateModelUpdate,
  createStateModelContextProvider,
} from './react-state-model';

import { GateModel } from './gate-model';

// export type StateModelSetState<Model> =
//   React.Dispatch<React.SetStateAction<Model>>;

export default class Gate extends StateModel {
  constructor() {
    super();

    console.log('!!!! here');
  }

  get store(): GateModel {
    return this._store;
  }

  setUpdate(value: StateModelUpdate): void {
    console.log('!!!! yyyy here');

    this.update = value;
    this.store.setUpdate(value);
  }

  private _store: GateModel = new GateModel();
}

const [
  GateContextProvider,
  useGateContext,
] = createStateModelContextProvider(Gate);

export {
  GateContextProvider,
  useGateContext,
};

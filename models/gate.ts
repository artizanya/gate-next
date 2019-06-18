// Hey Emacs, this is -*- coding: utf-8 -*-

import {
  StateModel,
  StateModelUpdate,
  createStateModelContextProvider,
} from './react-state-model';

import { GateModel } from './gate-model';

export default class Gate extends StateModel {
  constructor(update: StateModelUpdate) {
    super(update);
    this._model = new GateModel(update);

    console.log('!!!! here');
  }

  get model(): GateModel {
    return this._model;
  }

  private _model: GateModel;
}

const [
  GateContextProvider,
  useGateContext,
] = createStateModelContextProvider(Gate);

export {
  GateContextProvider,
  useGateContext,
};

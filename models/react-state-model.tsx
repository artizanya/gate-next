// Hey Emacs, this is -*- coding: utf-8 -*-

import React, {
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';

import now from 'performance-now';

export class StateModel {
  constructor(update: StateModelUpdate) {
    this._update = update;
  }

  update(): void {
    this._update();
  }

  private _update: StateModelUpdate;
}

interface StateModelConstructor<Model extends StateModel> {
  new(update: StateModelUpdate): Model;
}

export type StateModelUpdate = () => void;

export function useStateModel<Model extends StateModel>(
  Model: StateModelConstructor<Model>,
): [Model, StateModelUpdate] {
  const [, doUpdate] = useState(0);
  const update: StateModelUpdate = useCallback(
    (): void => doUpdate(now()),
    [doUpdate],
  );
  const [model] = useState((): Model => new Model(update));
  return [model, update];
}

export interface StateModelContextProviderProps {
  children?: React.ReactNode;
}

export function createStateModelContextProvider<
  Model extends StateModel
>(Model: StateModelConstructor<Model>): [
  (props: StateModelContextProviderProps) => JSX.Element,
  () => [Model, StateModelUpdate],
  React.Context<[Model, StateModelUpdate]>
] {
  const StateModelContext = createContext<[Model, StateModelUpdate]>(
    null as unknown as [Model, StateModelUpdate],
  );

  const StateModelContextProvider =
    (props: StateModelContextProviderProps): JSX.Element => {
      const model = useStateModel(Model);
      return (
        <StateModelContext.Provider value={model}>
          {props.children}
        </StateModelContext.Provider>
      );
    };

  const useStateModelContext =
    (): [Model, StateModelUpdate] => useContext(StateModelContext);

  return [StateModelContextProvider, useStateModelContext, StateModelContext];
}

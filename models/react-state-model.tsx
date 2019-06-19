// Hey Emacs, this is -*- coding: utf-8 -*-

import React, {
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';

export type StateModelUpdate = () => void;

class UpdateCallbackUnallocatedError extends Error {
  constructor() {
    super('ProcessTree.setUpdateCallback() must be called ' +
          'before running any modifying methods.');
  }
}

export class StateModel {
  update: StateModelUpdate = (): void => {
    throw new UpdateCallbackUnallocatedError();
  };

  setUpdate(value: StateModelUpdate): void {
    this.update = value;
    const properties: StateModel[] = Object.values(this);
    properties.forEach((property): void => {
      if(property instanceof StateModel) property.setUpdate(value);
    });
  }
}

interface StateModelConstructor<Model extends StateModel> {
  new(): Model;
}

export function useStateModel<Model extends StateModel>(
  Model: StateModelConstructor<Model>,
): Model {
  const [model, setModel] = useState((): Model => new Model());
  const update: StateModelUpdate = useCallback(
    (): void => setModel((prevModel: Model): Model => ({ ...prevModel })),
    [setModel],
  );
  useState((): void => model.setUpdate(update));
  return model;
}

export interface StateModelContextProviderProps {
  children?: React.ReactNode;
}

export function createStateModelContextProvider<
  Model extends StateModel
>(Model: StateModelConstructor<Model>): [
  (props: StateModelContextProviderProps) => JSX.Element,
  () => Model,
  React.Context<Model>
] {
  const StateModelContext = createContext<Model>(null as unknown as Model);

  const StateModelContextProvider =
    (props: StateModelContextProviderProps): JSX.Element => {
      const model = useStateModel(Model);
      return (
        <StateModelContext.Provider value={model}>
          {props.children}
        </StateModelContext.Provider>
      );
    };

  const useStateModelContext = (): Model => useContext(StateModelContext);

  return [StateModelContextProvider, useStateModelContext, StateModelContext];
}

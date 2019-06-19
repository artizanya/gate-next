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

  const update: () => void = useCallback(
    // see http://2ality.com/2016/10/rest-spread-properties.html

    // Not sure what way is the best:
    // __proto__ is deprecated in new JS environments;
    // Object.assign() calls object setters as a side effect;
    // Object.setPrototypeOf() is said to be slow.

    // (): void => setModel(
    //   (prev: Model): Model => Object.assign(
    //     { __proto__: prev.__proto__ }, prev
    //   ),
    // ),

    // (): void => setModel(
    //   (prev: Model): Model => (
    //     { __proto__: Object.getPrototypeOf(prev), ...prev }
    //   )
    // ),

    // (): void => setModel(
    //   (prev: Model): Model => (
    //     Object.assign(Object.create(Object.getPrototypeOf(prev)), prev)
    //   ),
    // ),

    (): void => setModel(
      (prev: Model): Model => (
        Object.setPrototypeOf({ ...prev }, Object.getPrototypeOf(prev))
      ),
    ),
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

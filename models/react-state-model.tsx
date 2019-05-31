// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { useState, createContext, useContext } from 'react';

export type StateModelUpdateCallback = () => void;

class UnallocatedUpdateCallback extends Error {
  constructor() {
    super('ProcessTree.setUpdateCallback() must be called ' +
          'before running any modifying methods.');
  }
}

export class StateModel {
  updateCallback = (): void => {
    throw new UnallocatedUpdateCallback();
  };
}

interface StateModelConstructor<State, Model extends StateModel> {
  initialState: State;
  new(
    state: State,
    setState: React.Dispatch<React.SetStateAction<State>>
  ): Model;
}

export type StateModelSetState<State> =
  React.Dispatch<React.SetStateAction<State>>;

export function useStateModel<
  State, Model extends StateModel
>(Model: StateModelConstructor<State, Model>): Model {
  const [state, setState] = useState(Model.initialState);
  return new Model(state, setState);
}

export interface StateModelProviderProps {
  children?: React.ReactNode;
}

export function createStateModelProvider<
  State, Model extends StateModel
>(Model: StateModelConstructor<State, Model>): [
  (props: StateModelProviderProps) => JSX.Element,
  () => Model,
  React.Context<Model>
] {
  const StateModelContext = createContext<Model>(null as unknown as Model);

  const StateModelContextProvider =
    (props: StateModelProviderProps): JSX.Element => {
      const stateModel = useStateModel(Model);
      return (
        <StateModelContext.Provider value={stateModel}>
          {props.children}
        </StateModelContext.Provider>
      );
    };

  const useStateModelContext = (): Model => useContext(StateModelContext);

  return [StateModelContextProvider, useStateModelContext, StateModelContext];
}

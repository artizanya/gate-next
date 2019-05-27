// Hey Emacs, this is -*- coding: utf-8 -*-

import React from 'react';
import { useState, createContext, useContext } from 'react';

export type StateModelUpdateCallback = () => void;

export interface StateModelInterface {
  updateCallback: StateModelUpdateCallback;
}

interface StateModelConstructor<State, Model extends StateModelInterface> {
  initialState: State;
  new (
    state: State,
    setState: React.Dispatch<React.SetStateAction<State>>
  ): Model;
}

export type StateModelSetState<State> =
  React.Dispatch<React.SetStateAction<State>>;

export function useStateModel<
  State, Model extends StateModelInterface
>(Model: StateModelConstructor<State, Model>): Model
{
  const [state, setState] = useState(Model.initialState);
  return new Model(state, setState);
}

export interface StateModelProviderProps {
  children?: React.ReactNode;
}

export function createStateModelProvider<
  State, Model extends StateModelInterface
>(Model: StateModelConstructor<State, Model>)
{
  const StateModelContext = createContext<Model>(null as unknown as Model);

  function StateModelContextProvider(props: StateModelProviderProps) {
    const stateModel = useStateModel(Model);
    return (
      <StateModelContext.Provider value={stateModel}>
        {props.children}
      </StateModelContext.Provider>
    );
  }

  function useStateModelContext() {
    return useContext(StateModelContext);
  }

  return [StateModelContextProvider, useStateModelContext, StateModelContext];
}

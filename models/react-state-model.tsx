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

interface Ref<M extends StateModel> {
  model: M;
}

interface StateModelConstructor<M extends StateModel> {
  new(): M;
}

export function useStateModelRef<M extends StateModel>(
  ModelClass: StateModelConstructor<M>,
): Ref<M> {
  const [modelRef, setModelRef] = useState(
    (): Ref<M> => ({ model: new ModelClass() }),
  );

  const update: () => void = useCallback(
    (): void => setModelRef(
      (prevRef: Ref<M>): Ref<M> => ({ model: prevRef.model }),
    ),
    [setModelRef],
  );

  useState((): void => modelRef.model.setUpdate(update));

  return modelRef;
}

export interface StateModelContextProviderProps {
  children?: React.ReactNode;
}

export function createStateModelRefContextProvider<
  M extends StateModel
>(ModelClass: StateModelConstructor<M>): [
  (props: StateModelContextProviderProps) => JSX.Element,
  () => Ref<M>,
  React.Context<Ref<M>>
] {
  const StateModelRefContext =
    createContext<Ref<M>>(null as unknown as Ref<M>);

  const StateModelRefContextProvider =
    (props: StateModelContextProviderProps): JSX.Element => {
      const modelRef = useStateModelRef(ModelClass);
      return (
        <StateModelRefContext.Provider value={modelRef}>
          {props.children}
        </StateModelRefContext.Provider>
      );
    };

  const useStateModelRefContext = (): Ref<M> => useContext(StateModelRefContext);

  return [
    StateModelRefContextProvider,
    useStateModelRefContext,
    StateModelRefContext,
  ];
}

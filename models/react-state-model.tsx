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

interface Ref<Model extends StateModel> {
  model: Model;
}

interface StateModelConstructor<Model extends StateModel> {
  new(): Model;
}

export function useStateModelRef<Model extends StateModel>(
  ModelClass: StateModelConstructor<Model>,
): Ref<Model> {
  const [modelRef, setModelRef] = useState(
    (): Ref<Model> => ({ model: new ModelClass() }),
  );

  const update: () => void = useCallback(
    (): void => setModelRef(
      (prevRef: Ref<Model>): Ref<Model> => ({ model: prevRef.model }),
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
  Model extends StateModel
>(ModelClass: StateModelConstructor<Model>): [
  (props: StateModelContextProviderProps) => JSX.Element,
  () => Ref<Model>,
  React.Context<Ref<Model>>
] {
  const StateModelRefContext =
    createContext<Ref<Model>>(null as unknown as Ref<Model>);

  const StateModelRefContextProvider =
    (props: StateModelContextProviderProps): JSX.Element => {
      const modelRef = useStateModelRef(ModelClass);
      return (
        <StateModelRefContext.Provider value={modelRef}>
          {props.children}
        </StateModelRefContext.Provider>
      );
    };

  const useStateModelRefContext = (): Ref<Model> => useContext(StateModelRefContext);

  return [
    StateModelRefContextProvider,
    useStateModelRefContext,
    StateModelRefContext,
  ];
}

// Hey Emacs, this is -*- coding: utf-8 -*-

import React, {
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';

export type ModelUpdate = () => void;

class UpdateUnallocatedError extends Error {
  constructor() {
    super('ProcessTree.setUpdateCallback() must be called ' +
          'before running any modifying methods.');
  }
}

export class Model {
  get update(): ModelUpdate {
    return this._update;
  }

  setUpdate(value: ModelUpdate): void {
    this._update = value;
    const properties: Model[] = Object.values(this);
    properties.forEach((property): void => {
      if(property instanceof Model) property.setUpdate(value);
    });
  }

  private _update: ModelUpdate = (): void => {
    throw new UpdateUnallocatedError();
  };
}

interface Ref<M extends Model> {
  model: M;
}

interface ModelClass<M extends Model> {
  new(): M;
}

export function useModelRef<M extends Model>(
  ModelClass: ModelClass<M>,
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

export interface ModelRefContextProviderProps {
  children?: React.ReactNode;
}

export function createModelRefContextProvider<M extends Model>(
  ModelClass: ModelClass<M>,
): [
  (props: ModelRefContextProviderProps) => JSX.Element,
  () => Ref<M>,
  React.Context<Ref<M>>,
] {
  const ModelRefContext =
    createContext<Ref<M>>(null as unknown as Ref<M>);

  const ModelRefContextProvider =
    (props: ModelRefContextProviderProps): JSX.Element => {
      const modelRef = useModelRef(ModelClass);
      return (
        <ModelRefContext.Provider value={modelRef}>
          {props.children}
        </ModelRefContext.Provider>
      );
    };

  const useModelRefContext = (): Ref<M> => useContext(ModelRefContext);

  return [
    ModelRefContextProvider,
    useModelRefContext,
    ModelRefContext,
  ];
}

// Hey Emacs, this is -*- coding: utf-8 -*-

import {
  StateModel,
  StateModelSetState,
  createStateModelProvider,
} from './react-state-model';

interface ProcessTreeItem {
  title: string;
  subtitle?: string;
  expanded?: boolean;
  children?: ProcessTreeItem[];
}

export type ProcessTreeData = ProcessTreeItem[];

class ProcessTree extends StateModel {
  constructor() {
    super();

    this._treeData = [{
      title: 'Chicken',
      children: [{
        title: 'Egg',
      }],
    }];
  }

  setTreeData(
    value: ProcessTreeData,
    shouldUpdate: boolean = true,
  ): void {
    this._treeData = value;
    if(shouldUpdate) this.updateCallback();
  }

  get treeData(): ProcessTreeData {
    return this._treeData;
  }

  private _treeData: ProcessTreeData;
}

interface GateState {
  processTree: ProcessTree;
}

type GateModelSetState = StateModelSetState<GateState>;

export class GateModel extends StateModel {
  static get initialState(): GateState {
    const processTree = new ProcessTree();

    return {
      processTree,
    };
  }

  constructor(state: GateState, setState: GateModelSetState) {
    super();

    this._state = state;
    this._setState = setState;

    const stateProperties: StateModel[] = Object.values(this._state);
    stateProperties.forEach((stateProperty): void => {
      stateProperty.updateCallback = this.updateCallback;
    });
  }

  get processTree(): ProcessTree {
    return this._state.processTree;
  }

  updateCallback = (): void => {
    this._setState({ ...this._state });
  }

  private _state: GateState;
  private _setState: GateModelSetState;
}

const [GateModelContextProvider, useGateModelContext] =
  createStateModelProvider(GateModel);

export {
  GateModelContextProvider,
  useGateModelContext,
};

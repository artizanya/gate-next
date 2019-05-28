// Hey Emacs, this is -*- coding: utf-8 -*-

import {
  StateModelInterface,
  StateModelSetState,
  StateModelUpdateCallback,
  createStateModelProvider,
} from './react-state-model';

interface ProcessTreeItem {
  title: string;
  subtitle?: string;
  expanded?: boolean;
  children?: ProcessTreeItem[];
}

export type ProcessTreeData = ProcessTreeItem[];

class ProcessTree implements StateModelInterface {
  constructor() {
    this.updateCallback = () => {
      throw 'ProcessTree.setUpdateCallback() must be called ' +
            'before running any modifying methods.';
    };

    this._treeData = [{
      title: 'Chicken',
      children: [{
        title: 'Egg',
      }],
    }];
  }

  setTreeData(
    value: ProcessTreeData,
    shouldUpdate: boolean = true): void
  {
    this._treeData = value;
    if(shouldUpdate) this.updateCallback();
  }

  get treeData(): ProcessTreeData {
    return this._treeData;
  }

  updateCallback: StateModelUpdateCallback;

  private _treeData: ProcessTreeData;
}

interface GateState {
  processTree: ProcessTree;
}

type GateModelSetState = StateModelSetState<GateState>;

export class GateModel implements StateModelInterface {
  static get initialState(): GateState {
    let processTree = new ProcessTree();

    return {
      processTree,
    };
  }

  constructor(state: GateState, setState: GateModelSetState) {
    this._state = state;
    this._setState = setState;

    for(let stateProperty of Object.values(this._state)) {
      if(stateProperty.updateCallback) {
        stateProperty.updateCallback = this.updateCallback;
      }
    }
  }

  get processTree(): ProcessTree {
    return this._state.processTree;
  }

  updateCallback = () => {
    this._setState({...this._state});
  }

  private _state: GateState;
  private _setState: GateModelSetState;
}

const [GateModelContextProvider, useGateModelContext] =
  createStateModelProvider(GateModel);

export {
  GateModelContextProvider,
  useGateModelContext
};

// Hey Emacs, this is -*- coding: utf-8 -*-

import {
  StateModel,
  StateModelSetState,
  createStateModelContextProvider,
} from './react-state-model';

export interface ProcessTreeComponent {
  title: string;
  subtitle?: string;
  id: string;
  collection: string;
  // elementId: string;
  // children: element variants and alternatives;
  expanded?: boolean;
}

export interface ProcessTreeProcessInput {
  title: 'Input Components';
  children: ProcessTreeComponent[];
  expanded?: boolean;
}

export interface ProcessTreeProcessOutput {
  title: 'Output Components';
  children: ProcessTreeComponent[];
  expanded?: boolean;
}

export interface ProcessTreeProcess {
  title: string;
  subtitle?: string;
  id: string;
  collection: string;
  children: [
    ProcessTreeProcessInput,
    ProcessTreeProcessOutput,
  ];
  expanded?: boolean;
}

// export interface ProcessTreeItem {
//   title: string;
//   id?: string;
//   collection?: string;
//   subtitle?: string;
//   expanded?: boolean;
//   children?: ProcessTreeItem[];
// }

// export type ProcessTreeData = ProcessTreeItem[];
export type ProcessTreeData = ProcessTreeProcess[];

class ProcessTree extends StateModel {
  constructor() {
    super();

    this._treeData = [{
      collection: 'processes',
      id: '0000',
      title: 'Do something good',
      children: [{
        title: 'Input Components',
        children: [],
      }, {
        title: 'Output Components',
        children: [],
      }],
    }];

    // this._treeData = [{
    //   title: 'Chicken',
    //   children: [{
    //     title: 'Egg',
    //   }],
    // }];
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

    // const stateProperties: StateModel[] = Object.values(this._state);
    // stateProperties.forEach((stateProperty): void => {
    //   stateProperty.updateCallback = this.updateCallback;
    // });
    this._state.processTree.updateCallback = this.updateCallback;
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

const [
  GateModelContextProvider,
  useGateModelContext,
] = createStateModelContextProvider(GateModel);

export {
  GateModelContextProvider,
  useGateModelContext,
};

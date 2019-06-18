// Hey Emacs, this is -*- coding: utf-8 -*-

import { StateModel, StateModelUpdate } from './react-state-model';

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
    if(shouldUpdate) this.update();
  }

  get treeData(): ProcessTreeData {
    return this._treeData;
  }

  setUpdate(value: StateModelUpdate): void {
    this.update = value;
  }

  private _treeData: ProcessTreeData;
}

export class GateModel extends StateModel {
  get processTree(): ProcessTree {
    return this._processTree;
  }

  setUpdate(value: StateModelUpdate): void {
    this.update = value;
    this.processTree.setUpdate(value);
  }

  private _processTree: ProcessTree = new ProcessTree();
}

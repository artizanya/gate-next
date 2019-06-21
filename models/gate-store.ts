// Hey Emacs, this is -*- coding: utf-8 -*-

import { Model } from './use-model';

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

// type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
// type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArgsType<T> = T extends (...args: infer A) => any ? A : never;
type Revert = (() => void) | null;

class Action<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Run extends (...args: any[]) => Revert,
> {
  constructor(model: Model, run: Run) {
    this._model = model;
    this._run = run;
    this._revert = null;
  }

  run(...args: ArgsType<Run>): void {
    this._run(...args);
    this._model.update();
    this._revert = null;
  }

  apply(
    args: ArgsType<Run>,
    shouldUpdate: boolean = true,
  ): void {
    this._revert = this._run(...args);
    if(shouldUpdate) this._model.update();
  }

  done(): void {
    if(this._revert) this._revert = null;
  }

  revert(): void {
    if(this._revert) {
      this._revert();
      this._revert = null;
      this._model.update();
    }
  }

  update(): void {
    this._model.update();
  }

  private _model: Model;
  private _run: Run;
  private _revert: Revert;
}

class ProcessTree extends Model {
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

  // setTreeData(
  //   value: ProcessTreeData,
  //   shouldUpdate = true,
  // ): void {
  //   this._treeData = value;
  //   if(shouldUpdate) this.update();
  // }

  setTreeData = new Action(
    this,
    (value: ProcessTreeData): Revert => {
      const prev = value;
      this._treeData = value;

      return (): void => {
        this._treeData = prev;
      };
    },
  );

  get treeData(): ProcessTreeData {
    return this._treeData;
  }

  private _treeData: ProcessTreeData;
}

export default class GateStore extends Model {
  get processTree(): ProcessTree {
    return this._processTree;
  }

  private _processTree = new ProcessTree();
}

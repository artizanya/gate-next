// Hey Emacs, this is -*- coding: utf-8 -*-

import { diff, Diff } from 'deep-diff';

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArgsType<T> = T extends (...args: infer A) => any ? A : never;

class Action<
  Delta,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Run extends (...args: any[]) => Delta | null,
  Apply extends (delta: ReturnType<Run> | null) => void,
  Revert extends (delta: ReturnType<Run> | null) => void,
> {
  constructor(
    model: Model,
    optimistic: boolean,
    run: Run,
    apply: Apply,
    revert: Revert,
  ) {
    this._model = model;
    this._optimistic = optimistic;
    this._run = run;
    this._apply = apply;
    this._revert = revert;
    this._delta = null;
  }

  run(...args: ArgsType<Run>): void {
    this._delta = this._run(...args);
    this.update();
  }

  cancel(): void {
    if(this._delta) {
      this._revert(this._delta);
      this._delta = null;
      this.update();
    }
  }

  done(): void {
    if(this._delta) {
      this._delta = null;
      this.update();
    }
  }

  get optimistic(): boolean {
    return this._optimistic;
  }

  act(
    args: ArgsType<Run>,
    shouldUpdate: boolean = false,
    optimistic: boolean = false,
  ): void {
    if(optimistic) this._delta = this._run(...args);
    else {
      this._delta = null;
      this._run(...args);
    }
    if(shouldUpdate) this.update();
  }

  apply(
    delta: ReturnType<Run>,
    shouldUpdate: boolean = true,
  ): void {
    this._apply(delta);
    if(shouldUpdate) this._model.update();
  }

  revert(
    delta: ReturnType<Run>,
    shouldUpdate: boolean = true,
  ): void {
    this._revert(delta);
    if(shouldUpdate) this._model.update();
  }

  update(): void {
    this._model.update();
  }

  private _model: Model;
  private _optimistic: boolean;
  private _delta: ReturnType<Run> | null;
  private _run: Run;
  private _apply: Apply;
  private _revert: Revert;
}

type ProcessTreeDataDiff = Diff<ProcessTreeData>[];

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
    this, false,
    (value: ProcessTreeData): ProcessTreeDataDiff | null => {
      const delta = diff(this._treeData, value);
      this._treeData = value;
      if(delta) return delta;
      return null;
    },
    (delta: ProcessTreeDataDiff | null): void => {
      this._treeData = delta as unknown as ProcessTreeData;
    },
    (delta: ProcessTreeDataDiff | null): void => {
      this._treeData = delta as unknown as ProcessTreeData;
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

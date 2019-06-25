// Hey Emacs, this is -*- coding: utf-8 -*-
import * as dd from 'deep-diff';

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

export type ProcessTreeData = ProcessTreeProcess[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArgsType<T> = T extends (...args: infer A) => any ? A : never;

class Action<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Run extends (...args: any[]) => any,
  Apply extends (delta: ReturnType<Run>) => void,
  Revert extends (delta: ReturnType<Run>) => void,
> {
  constructor(
    model: Model,
    run: Run,
    apply: Apply,
    revert: Revert,
  ) {
    this._model = model;
    this._run = run;
    this._apply = apply;
    this._revert = revert;
    this._delta = null;
  }

  run(...args: ArgsType<Run>): void {
    this._delta = this._run(...args);
    this.update();
  }

  batch(...args: ArgsType<Run>): void {
    this._delta = this._run(...args);
  }

  cancel(): void {
    if(this._delta) {
      this._revert(this._delta);
      this._delta = null;
      this.update();
    }
  }

  apply(
    delta: ReturnType<Run>,
    shouldUpdate: boolean = true,
  ): void {
    this._apply(delta);
    this._delta = null;
    if(shouldUpdate) this.update();
  }

  revert(
    delta: ReturnType<Run>,
    shouldUpdate: boolean = true,
  ): void {
    this._revert(delta);
    this._delta = null;
    if(shouldUpdate) this.update();
  }

  update(): void {
    this._model.update();
  }

  private _model: Model;
  private _run: Run;
  private _apply: Apply;
  private _revert: Revert;
  private _delta: ReturnType<Run> | null;
}

type ProcessTreeDataDiff = dd.Diff<ProcessTreeData>[] | undefined;

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
    (value: ProcessTreeData): ProcessTreeDataDiff => {
      const delta = dd.diff(this._treeData, value);
      this._treeData = value;
      return delta;
    },
    (deltaApply: ProcessTreeDataDiff): void => {
      if(deltaApply) deltaApply.forEach((change): void => {
        dd.applyChange(this._treeData, undefined, change);
      });
    },
    (deltaRevert: ProcessTreeDataDiff): void => {
      if(deltaRevert) deltaRevert.forEach((change): void => {
        dd.revertChange(this._treeData, undefined, change);
      });
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

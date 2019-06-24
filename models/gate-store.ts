// Hey Emacs, this is -*- coding: utf-8 -*-

import { Model } from './use-model';
import cloneDeepfrom from 'lodash.clonedeep';

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

type JsonAny = boolean | number | string | null | JsonArray | JsonMap;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface JsonArray extends Array<JsonAny> {}
interface JsonMap { [key: string]: JsonAny }

// type JsonPrimitive = string | number | boolean | null;
// type JsonValue = JsonPrimitive | JsonObject | JsonArray;
// type JsonObject = { [member: string]: JsonValue };
// interface JsonArray extends Array<JsonValue> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArgsType<T> = T extends (...args: infer A) => any ? A : never;
// type Delta = JsonAny | null;
// type Apply = (delta: Delta) => void;
// type Revert = (delta: Delta) => void;

class Action<
  Apply extends ((delta: JsonAny) => void),
  Revert extends ((delta: JsonAny) => void),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Run extends (...args: any[]) => JsonAny,
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
    this._revert(this._delta);
    this._delta = null;
    this.update();
  }

  done(): void {
    this._delta = null;
    this.update();
  }

  get optimistic(): boolean {
    return this._optimistic;
  }

  act(
    args: ArgsType<Run>,
    shouldUpdate: boolean = false,
    optimistic: boolean = false,
  ): void {
    if(optimistic) {
      this._delta = null;
      this._run(...args);
    }
    else this._delta = this._run(...args);
    if(shouldUpdate) this.update();
  }

  apply(
    delta: JsonAny,
    shouldUpdate: boolean = true,
  ): void {
    this._apply(delta);
    if(shouldUpdate) this._model.update();
  }

  revert(
    delta: JsonAny,
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
  private _delta: JsonAny | null;
  private _run: Run;
  private _apply: Apply;
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
    this, false,
    (value: ProcessTreeData): JsonAny => {
      const prev = cloneDeepfrom(this._treeData) as unknown as JsonAny;
      this._treeData = value;
      return prev;
    },
    (delta: JsonAny): void => {
      this._treeData = delta as unknown as ProcessTreeData;
    },
    (delta: JsonAny): void => {
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

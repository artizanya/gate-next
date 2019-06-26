// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint @typescript-eslint/no-explicit-any: off */

import { Model } from './use-model';

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type ArgsType<T> = T extends (...args: infer A) => any ? A : never;

export default class Action<
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

  isDone(): boolean {
    return this._delta == null;
  }

  done(): void {
    this._delta = null;
  }

  cancel(): void {
    if(this._delta) {
      this._revert(this._delta);
      this._delta = null;
      this.update();
    }
  }

  batch(args: ArgsType<Run>, update: boolean, done: boolean): void {
    this._delta = this._run(...args);
    if(update) this.update();
    if(done) this.done();
  }

  apply(delta: ReturnType<Run>, update: boolean): void {
    this._apply(delta);
    this._delta = null;
    if(update) this.update();
  }

  revert(delta: ReturnType<Run>, update: boolean): void {
    this._revert(delta);
    this._delta = null;
    if(update) this.update();
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

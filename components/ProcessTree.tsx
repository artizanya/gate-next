// Hey Emacs, this is -*- coding: utf-8 -*-

// import React, { useState, useCallback } from 'react';
import React, { useState, useCallback } from 'react';
import SortableTree from 'react-sortable-tree';

// import { ProcessTreeData } from '../models/gate';
// import { useGateApiContext } from '../models/land-api';
// import { useStateModel } from '../models/react-state-model';
import { ProcessTreeData } from '../models/gate-model';
import Gate from '../models/gate';

import 'react-sortable-tree/style.css';

function ProcessTree(): JSX.Element {
  console.log('**** here');

  // const [gate] = useGateContext();

  // const gate = useStateModel(Gate);
  const [gate, setGate] = useState((): Gate => new Gate());
  const update: () => void = useCallback(
    // see http://2ality.com/2016/10/rest-spread-properties.html
    // (): void => setGate((prev: Gate): Gate => Object.assign({ __proto__: prev.__proto__ }, prev)),
    // (): void => setGate((prev: Gate): Gate => ({ __proto__: Object.getPrototypeOf(prev), ...prev })),

    // (): void => setGate(
    //   (prev: Gate): Gate => (
    //     Object.assign(Object.create(Object.getPrototypeOf(prev)), prev)
    //   ),
    // ),

    // (): void => setGate(
    //   (prev: Gate): Gate => {
    //     const result = { ...prev };
    //     return Object.setPrototypeOf(result, Object.getPrototypeOf(prev));
    //   },
    // ),

    (): void => setGate(
      (prev: Gate): Gate => (
        Object.setPrototypeOf({ ...prev }, Object.getPrototypeOf(prev))
      ),
    ),

    [setGate],
  );
  useState((): void => gate.setUpdate(update));

  // const [, doUpdate] = useState(now());
  // const update = useCallback((): void => doUpdate(now()), [doUpdate]);
  // const [model] = useState((): GateModel => new GateModel(update));

  // const model = useGateModelContext();
  // const api = useGateApiContext();
  // const apiRef = useRef(api);

  // useEffect((): void => {
  //   const { landApi } = apiRef.current;
  //   landApi.loadProcessTree();
  // }, [apiRef, api.landApi.source]);

  return (
    <div style={{ height: 600 }}>
      <SortableTree
        treeData={gate.store.processTree.treeData}
        onChange={(treeData): void => {
          // api.land.setTreeData(treeData as ProcessTreeData)
          gate.store.processTree.setTreeData(treeData as ProcessTreeData);
        }}
      />
    </div>
  );
}

export default ProcessTree;

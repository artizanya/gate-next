// Hey Emacs, this is -*- coding: utf-8 -*-

// import React, { useState, useCallback } from 'react';
import React, { useState, useCallback } from 'react';
import SortableTree from 'react-sortable-tree';

// import { ProcessTreeData } from '../models/gate';
// import { useGateApiContext } from '../models/land-api';
// import { useStateModel } from '../models/react-state-model';
import { ProcessTreeData } from '../models/gate-store';
import Gate from '../models/gate';

import 'react-sortable-tree/style.css';

interface GateRef {
  current: Gate;
}

function ProcessTree(): JSX.Element {
  console.log('**** here');

  // const [gate] = useGateContext();

  // const gate = useStateModel(Gate);
  const [gateRef, setGateRef] = useState(
    (): GateRef => ({ current: new Gate() }),
  );
  const update: () => void = useCallback(
    (): void => setGateRef(
      (prev: GateRef): GateRef => ({ current: prev.current }),
    ),
    [setGateRef],
  );
  useState((): void => gateRef.current.setUpdate(update));

  const gate = gateRef.current;

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

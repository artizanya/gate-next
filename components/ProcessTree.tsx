// Hey Emacs, this is -*- coding: utf-8 -*-

// import React, { useState, useCallback } from 'react';
import React from 'react';
import SortableTree from 'react-sortable-tree';

// import { ProcessTreeData } from '../models/gate';
// import { useGateApiContext } from '../models/land-api';
import { useStateModel } from '../models/react-state-model';
import { ProcessTreeData } from '../models/gate-model';
import Gate, { useGateContext } from '../models/gate';

import 'react-sortable-tree/style.css';

function ProcessTree(): JSX.Element {
  console.log('**** here');

  const [gate] = useGateContext();

  // const gate = useStateModel(Gate);

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
        treeData={gate.model.processTree.treeData}
        onChange={(treeData): void => {
          // api.land.setTreeData(treeData as ProcessTreeData)
          gate.model.processTree.setTreeData(treeData as ProcessTreeData);
        }}
      />
    </div>
  );
}

export default ProcessTree;

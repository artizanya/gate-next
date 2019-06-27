// Hey Emacs, this is -*- coding: utf-8 -*-

// import React, { useState, useCallback } from 'react';
import React from 'react';
import SortableTree from 'react-sortable-tree';

// import { ProcessTreeData } from '../models/gate';
// import { useGateApiContext } from '../models/land-api';
// import { useStateModel } from '../models/react-state-model';
import { ProcessTreeData } from '../models/gate-store';
import { useGateRefContext } from '../models/gate';

import 'react-sortable-tree/style.css';

// interface GateRef {
//   current: Gate;
// }

function ProcessTree(): JSX.Element {
  console.log('**** here');

  const { model: gate } = useGateRefContext();
  // const gate = useStateModel(Gate);

  return (
    <>
      <button
        type="button"
        onClick={(): void => {
          console.log('++++ cancel()');
          gate.store.processTree.setTreeData.cancel();
        }}
      >
        cancel
      </button>
      <button
        type="button"
        onClick={(): void => {
          console.log('++++ done()');
          gate.store.processTree.setTreeData.done();
        }}
      >
        done
      </button>
      <div style={{ height: 600 }}>
        <SortableTree
          treeData={gate.store.processTree.treeData}
          onChange={(treeData): void => {
            // api.land.setTreeData(treeData as ProcessTreeData)
            console.log('****', treeData);
            gate.store.processTree
              .setTreeData.do(treeData as ProcessTreeData).update();
          }}
        />
      </div>
    </>
  );
}

export default ProcessTree;

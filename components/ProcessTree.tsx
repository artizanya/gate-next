// Hey Emacs, this is -*- coding: utf-8 -*-

// import React, { useState, useCallback } from 'react';
import React, { useEffect } from 'react';
import SortableTree from 'react-sortable-tree';

import { ProcessTreeData } from '../models/gate-store';
import { useGateRefContext } from '../models/gate';

import 'react-sortable-tree/style.css';

// interface GateRef {
//   current: Gate;
// }

function ProcessTree(): JSX.Element {
  console.log('**** here');

  const { current: gate } = useGateRefContext();
  // const landApi = gate.landApi;

  useEffect((): void => {
    gate.landApi.loadProcessTree();
  }, [gate.landApi, gate.landApi.changed]);


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
              .setTreeData.run(treeData as ProcessTreeData);
          }}
        />
      </div>
    </>
  );
}

export default ProcessTree;

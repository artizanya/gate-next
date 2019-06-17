// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { useEffect, useRef } from 'react';
import SortableTree from 'react-sortable-tree';

import { ProcessTreeData } from '../models/gate';
import { useGateApiContext } from '../models/land-api';

import 'react-sortable-tree/style.css';

function ProcessTree(): JSX.Element {
  const api = useGateApiContext();
  const apiRef = useRef(api);

  useEffect((): void => {
    const { landApi } = apiRef.current;
    landApi.loadProcessTree();
  }, [apiRef, api.landApi.source]);

  console.log('**** here');

  return (
    <div style={{ height: 600 }}>
      <SortableTree
        treeData={api.model.processTree.treeData}
        onChange={(treeData): void => (
          // api.land.setTreeData(treeData as ProcessTreeData)
          api.model.processTree.setTreeData(treeData as ProcessTreeData)
        )}
      />
    </div>
  );
}

export default ProcessTree;

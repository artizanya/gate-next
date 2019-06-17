// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { useEffect } from 'react';
import SortableTree from 'react-sortable-tree';

import { useGateModelContext, ProcessTreeData } from '../models/gate';
import { useGateApiRefContext } from '../models/land-api';

import 'react-sortable-tree/style.css';

function ProcessTree(): JSX.Element {
  const gateModel = useGateModelContext();
  const gateApiRef = useGateApiRefContext();
  const gateApi = gateApiRef.current;

  // useEffect((): void => {
  //   const { landApi } = gateApiRef.current;
  //   landApi.loadProcessTree();
  // }, [gateApiRef, gateApi.landApi.source]);

  useEffect((): void => {
    gateApi.landApi.loadProcessTree();
  }, [gateApi]);

  console.log('**** here');

  return (
    <div style={{ height: 600 }}>
      <SortableTree
        treeData={gateModel.processTree.treeData}
        onChange={(treeData): void => (
          // gateApi.land.setTreeData(treeData as ProcessTreeData)
          gateModel.processTree.setTreeData(treeData as ProcessTreeData)
        )}
      />
    </div>
  );
}

export default ProcessTree;

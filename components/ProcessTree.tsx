// Hey Emacs, this is -*- coding: utf-8 -*-

import React from 'react';
import SortableTree from 'react-sortable-tree';

import { useGateModelContext, ProcessTreeData } from '../models/gate';

import 'react-sortable-tree/style.css';

function ProcessTree(): JSX.Element {
  const gateModel = useGateModelContext();

  return (
    <div style={{ height: 600 }}>
      <SortableTree
        treeData={gateModel.processTree.treeData}
        onChange={(treeData): void => (
          gateModel.processTree.setTreeData(treeData as ProcessTreeData)
        )}
      />
    </div>
  );
}

export default ProcessTree;

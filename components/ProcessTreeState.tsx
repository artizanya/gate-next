// Hey Emacs, this is -*- coding: utf-8 -*-

import { Component } from 'react';
import SortableTree,
       { FullTree } from 'react-sortable-tree';

import 'react-sortable-tree/style.css';

interface ProcessTreeState extends FullTree {}
// type ProcessTreeProps = ReactSortableTreeProps;

class ProcessTree extends Component<{}, ProcessTreeState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
    };
  }

  render() {
    return (
      <div style={{ height: 600 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({treeData})}
        />
      </div>
    );
  }
}

export default ProcessTree;

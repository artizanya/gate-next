import { createContext, useContext, useReducer, ReactNode } from 'react';

interface ProcessTreeItem {
  title?: ReactNode;
  subtitle?: ReactNode;
  expanded?: boolean;
  children?: ProcessTreeItem[];
}

type ProcessTreeData = ProcessTreeItem[]

interface ProcessTree {
  treeData: ProcessTreeData;
}

export function blankProcessTree(): ProcessTree {
  return {
    treeData: [{
      title: 'Chicken',
      children: [{
        title: 'Egg',
      }],
    }],
  };
}

export interface GateStore {
  processTree: ProcessTree;
}

export function blankGateStore(): GateStore {
  return {
    processTree: blankProcessTree(),
  };
}

type ActionUnion =
  | {
    type: 'setProcessTreeData';
    treeData: ProcessTreeData;
  }
  | {
    type: 'resetProcessTreeData';
  };

export function gateStoreReducer(state: ProcessTree, action: ActionUnion) {
  switch(action.type) {
    case 'setProcessTreeData': {
      return {
        ...state,
        treeData: action.treeData
      }
    }
    case 'resetProcessTreeData': {
      return blankProcessTree();
    }
    default: {
      return state;
    }
  }
}

export const GateContext = createContext();

export interface GateStoreProviderProps {
  reducer: typeof gateStoreReducer;
  initialState: GateStore;
  children: any;
}

export function GateStoreProvider(
  { reducer, initialState, children }: GateStoreProviderProps)
{
  return (
    <GateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </GateContext.Provider>
  );
}

export const useGateContext = () => useContext(GateContext);


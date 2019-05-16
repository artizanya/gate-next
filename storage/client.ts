class TreeItem {
  title: string = '';
  subtitle: string | null = null;
  expanded: boolean = false;
  children: TreeItem[] = [];
}

class GateState {
  processTree: TreeItem;

  constructor() {
    this.processTree = new TreeItem();
  }
}

export interface TimeInterval {
  start: number;
  end: number;
  meta?: any;
}

class Node {
  interval: TimeInterval;
  max: number;
  left: Node | null = null;
  right: Node | null = null;

  constructor(interval: TimeInterval) {
    this.interval = interval;
    this.max = interval.end;
  }
}

export class IntervalTree {
  private root: Node | null = null;

  insert(interval: TimeInterval) {
    this.root = this._insert(this.root, interval);
  }

  private _insert(node: Node | null, interval: TimeInterval): Node {
    if (!node) return new Node(interval);

    if (interval.start < node.interval.start) {
      node.left = this._insert(node.left, interval);
    } else {
      node.right = this._insert(node.right, interval);
    }

    node.max = Math.max(node.max, interval.end);
    return node;
  }

  searchOverlap(interval: TimeInterval): TimeInterval | null {
    let node = this.root;
    while (node) {
      if (this._overlap(node.interval, interval)) {
        return node.interval;
      }

      if (node.left && node.left.max >= interval.start) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return null;
  }

  overlaps(interval: TimeInterval): boolean {
    return this.searchOverlap(interval) !== null;
  }

  private _overlap(a: TimeInterval, b: TimeInterval) {
    return a.start < b.end && b.start < a.end;
  }
}

class NodeClass<T> {
  public next: NodeClass<T> | null = null;
  public prev: NodeClass<T> | null = null;
  constructor(public data: T) {}
}

interface ILinkedList<T> {
  insertInBegin(data: T): NodeClass<T>;
  insertAtEnd(data: T): NodeClass<T>;
  deleteNode(node: NodeClass<T>): void;
  traverse(): T[];
  size(): number;
  search(comparator: (data: T) => boolean): NodeClass<T> | null;
}

export class LinkedList<T> implements ILinkedList<T> {
  private head: NodeClass<T> | null = null;

  public add(data: T) {
    const node = new NodeClass(data);

    let current: NodeClass<T>;

    if (!this.head) {
      this.head = node;
    } else {
      current = this.head;

      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }
  }

  public insertInBegin(data: T): NodeClass<T> {
    const node = new NodeClass(data);
    if (!this.head) {
      this.head = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    return node;
  }

  public insertAtEnd(data: T): NodeClass<T> {
    const node = new NodeClass(data);
    if (!this.head) {
      this.head = node;
    } else {
      const getLast = (node: NodeClass<T>): NodeClass<T> => {
        return node.next ? getLast(node.next) : node;
      };

      const lastNode = getLast(this.head);
      node.prev = lastNode;
      lastNode.next = node;
    }
    return node;
  }

  public deleteNode(node: NodeClass<T>): void {
    if (!node.prev) {
      this.head = node.next;
    } else {
      const prevNode = node.prev;
      prevNode.next = node.next;
    }
  }

  public traverse(): T[] {
    const array: T[] = [];
    if (!this.head) {
      return array;
    }

    const addToArray = (node: NodeClass<T>): T[] => {
      array.push(node.data);
      return node.next ? addToArray(node.next) : array;
    };
    return addToArray(this.head);
  }

  public size(): number {
    return this.traverse().length;
  }

  public search(comparator: (data: T) => boolean): NodeClass<T> | null {
    const checkNext = (node: NodeClass<T>): NodeClass<T> | null => {
      if (comparator(node.data)) {
        return node;
      }
      return node.next ? checkNext(node.next) : null;
    };

    return this.head ? checkNext(this.head) : null;
  }

  public indexOf(data: T): number {
    let count = 0;
    let current = this.head;

    while (!current) {
      if (current.data === data) {
        return count;
      }
      count++;
      current = current.next;
    }
    return -1;
  }

  public isEmpty(): boolean {
    return this.size() === 0;
  }
}

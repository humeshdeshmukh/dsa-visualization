export const DATA_STRUCTURES = {
  ARRAYS: {
    title: 'Arrays',
    items: [
      { id: 'array-basic', name: 'Basic Array', path: '/data-structures/arrays/basic' },
      { id: 'array-2d', name: '2D Array', path: '/data-structures/arrays/2d' },
      { id: 'dynamic-array', name: 'Dynamic Array', path: '/data-structures/arrays/dynamic' }
    ]
  },
  LINKED_LISTS: {
    title: 'Linked Lists',
    items: [
      { id: 'singly-linked', name: 'Singly Linked List', path: '/data-structures/linked-lists/singly' },
      { id: 'doubly-linked', name: 'Doubly Linked List', path: '/data-structures/linked-lists/doubly' },
      { id: 'circular-linked', name: 'Circular Linked List', path: '/data-structures/linked-lists/circular' }
    ]
  },
  TREES: {
    title: 'Trees',
    items: [
      { id: 'binary-tree', name: 'Binary Tree', path: '/data-structures/trees/binary' },
      { id: 'bst', name: 'Binary Search Tree', path: '/data-structures/trees/bst' },
      { id: 'avl-tree', name: 'AVL Tree', path: '/data-structures/trees/avl' },
      { id: 'red-black', name: 'Red-Black Tree', path: '/data-structures/trees/red-black' }
    ]
  },
  GRAPHS: {
    title: 'Graphs',
    items: [
      { id: 'undirected', name: 'Undirected Graph', path: '/data-structures/graphs/undirected' },
      { id: 'directed', name: 'Directed Graph', path: '/data-structures/graphs/directed' },
      { id: 'weighted', name: 'Weighted Graph', path: '/data-structures/graphs/weighted' }
    ]
  },
  HEAPS: {
    title: 'Heaps',
    items: [
      { id: 'min-heap', name: 'Min Heap', path: '/data-structures/heaps/min' },
      { id: 'max-heap', name: 'Max Heap', path: '/data-structures/heaps/max' },
      { id: 'priority-queue', name: 'Priority Queue', path: '/data-structures/heaps/priority-queue' }
    ]
  },
  HASH_TABLES: {
    title: 'Hash Tables',
    items: [
      { id: 'hash-table', name: 'Hash Table', path: '/data-structures/hash-tables/basic' },
      { id: 'hash-map', name: 'Hash Map', path: '/data-structures/hash-tables/map' },
      { id: 'hash-set', name: 'Hash Set', path: '/data-structures/hash-tables/set' }
    ]
  }
} as const;

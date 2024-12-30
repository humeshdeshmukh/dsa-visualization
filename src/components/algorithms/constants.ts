export const ALGORITHMS = {
  SORTING: {
    title: 'Sorting Algorithms',
    items: [
      { id: 'bubble-sort', name: 'Bubble Sort', path: '/algorithms/sorting/bubble' },
      { id: 'quick-sort', name: 'Quick Sort', path: '/algorithms/sorting/quick' },
      { id: 'merge-sort', name: 'Merge Sort', path: '/algorithms/sorting/merge' },
      { id: 'heap-sort', name: 'Heap Sort', path: '/algorithms/sorting/heap' },
      { id: 'insertion-sort', name: 'Insertion Sort', path: '/algorithms/sorting/insertion' }
    ]
  },
  SEARCHING: {
    title: 'Searching Algorithms',
    items: [
      { id: 'linear-search', name: 'Linear Search', path: '/algorithms/searching/linear' },
      { id: 'binary-search', name: 'Binary Search', path: '/algorithms/searching/binary' },
      { id: 'depth-first', name: 'Depth First Search', path: '/algorithms/searching/dfs' },
      { id: 'breadth-first', name: 'Breadth First Search', path: '/algorithms/searching/bfs' }
    ]
  },
  GRAPH: {
    title: 'Graph Algorithms',
    items: [
      { id: 'dijkstra', name: "Dijkstra's Algorithm", path: '/algorithms/graph/dijkstra' },
      { id: 'bellman-ford', name: 'Bellman-Ford', path: '/algorithms/graph/bellman-ford' },
      { id: 'kruskal', name: "Kruskal's Algorithm", path: '/algorithms/graph/kruskal' },
      { id: 'prim', name: "Prim's Algorithm", path: '/algorithms/graph/prim' }
    ]
  },
  DYNAMIC_PROGRAMMING: {
    title: 'Dynamic Programming',
    items: [
      { id: 'fibonacci', name: 'Fibonacci', path: '/algorithms/dynamic-programming/fibonacci' },
      { id: 'knapsack', name: 'Knapsack Problem', path: '/algorithms/dynamic-programming/knapsack' },
      { id: 'lcs', name: 'Longest Common Subsequence', path: '/algorithms/dynamic-programming/lcs' }
    ]
  },
  STRING: {
    title: 'String Algorithms',
    items: [
      { id: 'kmp', name: 'KMP Algorithm', path: '/algorithms/string/kmp' },
      { id: 'rabin-karp', name: 'Rabin-Karp', path: '/algorithms/string/rabin-karp' },
      { id: 'z-algorithm', name: 'Z Algorithm', path: '/algorithms/string/z-algorithm' }
    ]
  }
} as const;

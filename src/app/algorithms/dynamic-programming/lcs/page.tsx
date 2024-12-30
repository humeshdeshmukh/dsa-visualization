"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

export default function LCSPage() {
  const [str1, setStr1] = useState("ABCDGH");
  const [str2, setStr2] = useState("AEDFHR");
  const [dp, setDp] = useState<number[][]>([]);
  const [currentCell, setCurrentCell] = useState<[number, number] | null>(null);
  const [lcs, setLcs] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const findLCS = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLcs("");

    const m = str1.length;
    const n = str2.length;

    // Initialize DP table
    const newDp: number[][] = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));
    setDp(newDp);
    await sleep(500);

    // Fill DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        setCurrentCell([i, j]);
        await sleep(200);

        if (str1[i - 1] === str2[j - 1]) {
          newDp[i][j] = newDp[i - 1][j - 1] + 1;
        } else {
          newDp[i][j] = Math.max(newDp[i - 1][j], newDp[i][j - 1]);
        }
        setDp([...newDp]);
      }
    }

    // Find LCS string
    let i = m, j = n;
    let lcsStr = "";
    
    while (i > 0 && j > 0) {
      setCurrentCell([i, j]);
      await sleep(500);

      if (str1[i - 1] === str2[j - 1]) {
        lcsStr = str1[i - 1] + lcsStr;
        i--;
        j--;
      } else if (newDp[i - 1][j] > newDp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    setLcs(lcsStr);
    setCurrentCell(null);
    setIsRunning(false);
  };

  return (
    <VisualizerLayout
      title="Longest Common Subsequence Visualization"
      description="Visualize how Dynamic Programming finds the Longest Common Subsequence between two strings by building a table of optimal solutions."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-white">String 1:</label>
              <input
                type="text"
                value={str1}
                onChange={(e) => setStr1(e.target.value.toUpperCase())}
                className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-white">String 2:</label>
              <input
                type="text"
                value={str2}
                onChange={(e) => setStr2(e.target.value.toUpperCase())}
                className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={findLCS}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Find LCS
            </button>
          </div>

          <div className="glass-dark border border-white/10 rounded-lg p-6 overflow-x-auto">
            <h4 className="text-white font-semibold mb-4">DP Table:</h4>
            <div className="inline-block">
              <div className="grid" style={{ gridTemplateColumns: `auto repeat(${str2.length + 1}, minmax(40px, 1fr))` }}>
                <div className="p-2 text-white font-semibold"></div>
                <div className="p-2 text-white font-semibold text-center">ε</div>
                {str2.split('').map((char, i) => (
                  <div key={i} className="p-2 text-white font-semibold text-center">
                    {char}
                  </div>
                ))}
                <div className="p-2 text-white font-semibold">ε</div>
                {dp[0]?.map((cell, j) => (
                  <div
                    key={`0-${j}`}
                    className={`p-2 text-white text-center ${
                      currentCell?.[0] === 0 && currentCell?.[1] === j
                        ? 'bg-yellow-500'
                        : 'bg-gray-700'
                    }`}
                  >
                    {cell}
                  </div>
                ))}
                {str1.split('').map((char, i) => (
                  <>
                    <div key={`char-${i}`} className="p-2 text-white font-semibold">
                      {char}
                    </div>
                    {dp[i + 1]?.map((cell, j) => (
                      <div
                        key={`${i + 1}-${j}`}
                        className={`p-2 text-white text-center ${
                          currentCell?.[0] === i + 1 && currentCell?.[1] === j
                            ? 'bg-yellow-500'
                            : 'bg-gray-700'
                        }`}
                      >
                        {cell}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>

          {lcs && (
            <div className="glass-dark border border-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Result:</h4>
              <p className="text-green-500 font-mono text-lg">
                Longest Common Subsequence: {lcs}
              </p>
              <p className="text-gray-300">Length: {lcs.length}</p>
            </div>
          )}

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">LCS Algorithm Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong> O(m * n)</p>
              <p><strong>Space Complexity:</strong> O(m * n)</p>
              <p><strong>Key Concepts:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Optimal substructure</li>
                <li>Overlapping subproblems</li>
                <li>Bottom-up dynamic programming</li>
                <li>String matching and comparison</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>DNA sequence alignment</li>
                <li>File difference comparison</li>
                <li>Version control systems</li>
                <li>Pattern recognition</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}

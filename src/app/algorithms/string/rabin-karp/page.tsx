"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

export default function RabinKarpPage() {
  const [text, setText] = useState("AABAACAADAABAAABAA");
  const [pattern, setPattern] = useState("AABA");
  const [currentTextIndex, setCurrentTextIndex] = useState(-1);
  const [currentWindow, setCurrentWindow] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [patternHash, setPatternHash] = useState(0);
  const [windowHash, setWindowHash] = useState(0);
  const [isComputing, setIsComputing] = useState(false);

  // Prime number for hash calculation
  const prime = 101;
  // Number of characters in the input alphabet
  const d = 256;

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const calculateHash = (str: string, length: number) => {
    let hash = 0;
    for (let i = 0; i < length; i++) {
      hash = (hash * d + str.charCodeAt(i)) % prime;
    }
    return hash;
  };

  const recalculateHash = (oldHash: number, oldChar: string, newChar: string, patternLength: number) => {
    let hash = oldHash;
    // Remove contribution of leading digit
    hash = (hash - (oldChar.charCodeAt(0) * Math.pow(d, patternLength - 1))) % prime;
    if (hash < 0) hash += prime;
    // Add contribution of new digit
    hash = (hash * d + newChar.charCodeAt(0)) % prime;
    return hash;
  };

  const rabinKarpSearch = async () => {
    if (isComputing) return;
    setIsComputing(true);
    setMatches([]);
    setCurrentTextIndex(-1);
    setCurrentWindow([]);

    const m = pattern.length;
    const n = text.length;

    if (m > n) {
      setMessage('Pattern is longer than text');
      setIsComputing(false);
      return;
    }

    // Calculate pattern hash
    const pHash = calculateHash(pattern, m);
    setPatternHash(pHash);
    setMessage(`Calculated pattern hash: ${pHash}`);
    await sleep(1000);

    // Calculate hash for first window
    let tHash = calculateHash(text, m);
    setWindowHash(tHash);
    setMessage(`Calculated initial window hash: ${tHash}`);
    setCurrentWindow([0, m - 1]);
    await sleep(1000);

    const foundMatches: number[] = [];

    // Slide pattern over text one by one
    for (let i = 0; i <= n - m; i++) {
      setCurrentTextIndex(i);
      setCurrentWindow([i, i + m - 1]);

      if (pHash === tHash) {
        // Check character by character
        let match = true;
        for (let j = 0; j < m; j++) {
          if (text[i + j] !== pattern[j]) {
            match = false;
            break;
          }
        }

        if (match) {
          foundMatches.push(i);
          setMatches([...foundMatches]);
          setMessage(`Pattern found at index ${i}`);
          await sleep(1000);
        } else {
          setMessage('Hash collision - not a real match');
          await sleep(500);
        }
      }

      // Calculate hash for next window
      if (i < n - m) {
        tHash = recalculateHash(tHash, text[i], text[i + m], m);
        setWindowHash(tHash);
        setMessage(`Calculated next window hash: ${tHash}`);
        await sleep(500);
      }
    }

    if (foundMatches.length === 0) {
      setMessage('Pattern not found in text');
    } else {
      setMessage(`Found ${foundMatches.length} matches at positions: ${foundMatches.join(', ')}`);
    }

    setCurrentTextIndex(-1);
    setCurrentWindow([]);
    setIsComputing(false);
  };

  return (
    <VisualizerLayout
      title="Rabin-Karp String Matching Algorithm Visualization"
      description="Visualize how the Rabin-Karp algorithm uses rolling hash function to find pattern matches in text."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label className="text-white">Text:</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-white">Pattern:</label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={rabinKarpSearch}
              disabled={isComputing}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Start Rabin-Karp Search
            </button>
          </div>

          {message && (
            <div className="text-white bg-gray-800 p-4 rounded-lg">
              {message}
            </div>
          )}

          <div className="glass-dark border border-white/10 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4">Text:</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-wrap gap-1">
                {text.split('').map((char, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                      matches.some(pos => index >= pos && index < pos + pattern.length)
                        ? 'bg-green-500'
                        : currentWindow[0] <= index && index <= currentWindow[1]
                        ? 'bg-yellow-500'
                        : 'bg-gray-700'
                    }`}
                  >
                    <span className="text-white">{char}</span>
                  </div>
                ))}
              </div>
              <h4 className="text-white font-semibold mb-2 mt-4">Pattern:</h4>
              <div className="flex flex-wrap gap-1">
                {pattern.split('').map((char, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500"
                  >
                    <span className="text-white">{char}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-white">Pattern Hash: {patternHash}</p>
                <p className="text-white">Current Window Hash: {windowHash}</p>
              </div>
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Rabin-Karp Algorithm Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Average Case: O(n + m)</li>
                <li>Worst Case: O(nm) with many hash collisions</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(1)</p>
              <p><strong>Key Features:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Uses rolling hash function</li>
                <li>Efficient for multiple pattern search</li>
                <li>Good for plagiarism detection</li>
                <li>Probabilistic algorithm</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Plagiarism detection</li>
                <li>Pattern matching in strings</li>
                <li>Document similarity</li>
                <li>Bioinformatics</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}

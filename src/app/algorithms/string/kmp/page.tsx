"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

export default function KMPPage() {
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABCABAB");
  const [lps, setLps] = useState<number[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(-1);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(-1);
  const [matches, setMatches] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [isComputing, setIsComputing] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const computeLPSArray = async () => {
    const len = pattern.length;
    const lpsArray = new Array(len).fill(0);
    let length = 0;
    let i = 1;

    setMessage('Computing LPS (Longest Proper Prefix which is also Suffix) array...');
    setLps(lpsArray);
    await sleep(1000);

    while (i < len) {
      if (pattern[i] === pattern[length]) {
        length++;
        lpsArray[i] = length;
        setLps([...lpsArray]);
        setCurrentPatternIndex(i);
        await sleep(500);
        i++;
      } else {
        if (length !== 0) {
          length = lpsArray[length - 1];
          setMessage(`Mismatch at index ${i}, jumping back to length ${length}`);
          await sleep(500);
        } else {
          lpsArray[i] = 0;
          setLps([...lpsArray]);
          setCurrentPatternIndex(i);
          await sleep(500);
          i++;
        }
      }
    }

    return lpsArray;
  };

  const kmpSearch = async () => {
    if (isComputing) return;
    setIsComputing(true);
    setMatches([]);
    setCurrentTextIndex(-1);
    setCurrentPatternIndex(-1);

    const lpsArray = await computeLPSArray();
    setMessage('Starting KMP search...');
    await sleep(1000);

    let i = 0;
    let j = 0;
    const foundMatches: number[] = [];

    while (i < text.length) {
      setCurrentTextIndex(i);
      setCurrentPatternIndex(j);
      await sleep(500);

      if (pattern[j] === text[i]) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        foundMatches.push(i - j);
        setMatches([...foundMatches]);
        setMessage(`Pattern found at index ${i - j}`);
        j = lpsArray[j - 1];
        await sleep(1000);
      } else if (i < text.length && pattern[j] !== text[i]) {
        if (j !== 0) {
          setMessage(`Mismatch at text[${i}], pattern[${j}]. Using LPS to jump.`);
          j = lpsArray[j - 1];
          await sleep(500);
        } else {
          setMessage(`Mismatch at beginning of pattern, moving text pointer`);
          i++;
          await sleep(500);
        }
      }
    }

    if (foundMatches.length === 0) {
      setMessage('Pattern not found in text');
    } else {
      setMessage(`Found ${foundMatches.length} matches at positions: ${foundMatches.join(', ')}`);
    }

    setCurrentTextIndex(-1);
    setCurrentPatternIndex(-1);
    setIsComputing(false);
  };

  return (
    <VisualizerLayout
      title="KMP String Matching Algorithm Visualization"
      description="Visualize how the Knuth-Morris-Pratt algorithm efficiently finds all occurrences of a pattern in a text using preprocessed LPS array."
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
              onClick={kmpSearch}
              disabled={isComputing}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Start KMP Search
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
                        : index === currentTextIndex
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
                    className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                      index === currentPatternIndex ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                  >
                    <span className="text-white">{char}</span>
                  </div>
                ))}
              </div>
              <h4 className="text-white font-semibold mb-2 mt-4">LPS Array:</h4>
              <div className="flex flex-wrap gap-1">
                {lps.map((value, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500"
                  >
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">KMP Algorithm Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Preprocessing: O(m) for LPS array</li>
                <li>Pattern Search: O(n) for text search</li>
                <li>Overall: O(n + m)</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(m) for LPS array</p>
              <p><strong>Key Features:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>No backtracking in text</li>
                <li>Uses preprocessed information</li>
                <li>Optimal for multiple searches</li>
                <li>Linear time complexity</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Text editors</li>
                <li>DNA sequence matching</li>
                <li>Network security</li>
                <li>Data compression</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}

"use client";

import { useState } from 'react';
import Link from 'next/link';
import NavDropdown from '../navigation/NavDropdown';
import { DATA_STRUCTURES } from '../data-structures/constants';
import { ALGORITHMS } from '../algorithms/constants';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glass-dark border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-xl font-bold gradient-text">DSA Visualizer</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <NavDropdown sections={DATA_STRUCTURES} label="Data Structures" />
              <NavDropdown sections={ALGORITHMS} label="Algorithms" />
              <Link href="/practice" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Practice
              </Link>
              <Link href="/about" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                About
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4">
              <div className="space-y-4">
                <div className="px-4 py-2">
                  <h3 className="text-sm font-semibold text-white mb-2">Data Structures</h3>
                  <div className="space-y-2">
                    {Object.values(DATA_STRUCTURES).map((section) => (
                      <div key={section.title}>
                        <h4 className="text-sm text-gray-400 mb-1">{section.title}</h4>
                        <ul className="pl-4 space-y-1">
                          {section.items.map((item) => (
                            <li key={item.id}>
                              <Link
                                href={item.path}
                                className="block text-sm text-gray-300 hover:text-white py-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-2">
                  <h3 className="text-sm font-semibold text-white mb-2">Algorithms</h3>
                  <div className="space-y-2">
                    {Object.values(ALGORITHMS).map((section) => (
                      <div key={section.title}>
                        <h4 className="text-sm text-gray-400 mb-1">{section.title}</h4>
                        <ul className="pl-4 space-y-1">
                          {section.items.map((item) => (
                            <li key={item.id}>
                              <Link
                                href={item.path}
                                className="block text-sm text-gray-300 hover:text-white py-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <Link
                    href="/practice"
                    className="block px-4 py-2 text-gray-300 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Practice
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-gray-300 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

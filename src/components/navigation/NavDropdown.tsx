"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  id: string;
  name: string;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavDropdownProps {
  sections: Record<string, NavSection>;
  label: string;
}

const NavDropdown = ({ sections, label }: NavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-1 px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-[600px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50 p-6">
          <div className="grid grid-cols-2 gap-8">
            {Object.values(sections).map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.path}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;

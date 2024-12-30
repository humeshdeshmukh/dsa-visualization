import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-grid">
      {/* Hero Section */}
      <section className="relative animated-bg py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="gradient-text mb-6 animate-fade-in">
              Visualize Data Structures & Algorithms
            </h1>
            <p className="text-xl mb-8 text-gray-300 animate-fade-in-up">
              Master DSA through interactive 3D visualizations and step-by-step animations
            </p>
            <div className="flex gap-4 justify-center animate-fade-in-up">
              <Link
                href="/visualizer"
                className="glass px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 hover:bg-blue-600/30 flex items-center gap-2"
              >
                <span>Start Learning</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/algorithms"
                className="glass-dark px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 hover:bg-purple-600/30 flex items-center gap-2"
              >
                <span>Explore Algorithms</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-float" />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float-delayed" />
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-cyan-500/20 rounded-full blur-xl animate-float" />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-black/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Data Structures Card */}
            <div className="glass hover-card p-6 rounded-xl">
              <div className="h-12 w-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Data Structures</h3>
              <p className="text-gray-400 mb-4">
                Interactive visualizations of Arrays, Linked Lists, Trees, and Graphs
              </p>
              <Link href="/data-structures" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                Explore
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Algorithms Card */}
            <div className="glass hover-card p-6 rounded-xl">
              <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Algorithms</h3>
              <p className="text-gray-400 mb-4">
                Step-by-step visualization of Sorting, Searching, and Path Finding
              </p>
              <Link href="/algorithms" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
                Discover
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Practice Problems Card */}
            <div className="glass hover-card p-6 rounded-xl">
              <div className="h-12 w-12 rounded-lg bg-cyan-600/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Practice Problems</h3>
              <p className="text-gray-400 mb-4">
                Real-world coding challenges with visual feedback
              </p>
              <Link href="/practice" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
                Practice Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 animated-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Cards */}
            <div className="glass p-6 rounded-xl text-center hover-card">
              <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-400">Visual and hands-on approach to understanding DSA</p>
            </div>

            <div className="glass p-6 rounded-xl text-center hover-card">
              <div className="bg-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Step-by-Step</h3>
              <p className="text-gray-400">Detailed explanations of each algorithm step</p>
            </div>

            <div className="glass p-6 rounded-xl text-center hover-card">
              <div className="bg-cyan-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice Mode</h3>
              <p className="text-gray-400">Test your knowledge with hands-on exercises</p>
            </div>

            <div className="glass p-6 rounded-xl text-center hover-card">
              <div className="bg-green-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance</h3>
              <p className="text-gray-400">Analyze and compare algorithm efficiency</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

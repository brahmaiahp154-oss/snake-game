/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Zap, Activity, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden flex flex-col">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-cyan/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-pink/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 glass-panel !rounded-none backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="p-2 bg-neon-cyan/20 rounded-lg group-hover:bg-neon-cyan/40 transition-colors">
              <Zap className="w-6 h-6 text-neon-cyan animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter neon-text-cyan flex items-center gap-2">
                NEON <span className="text-white not-italic opacity-40">/</span> RHYTHM
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
                <p className="text-[10px] font-mono text-neon-green uppercase tracking-widest font-bold">System Online.v1</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-neon-pink" />
              <span>Realtime Core</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-neon-cyan" />
              <span>Neural Process</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Global Time</div>
            <div className="text-lg font-bold font-mono neon-text-pink">
              {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 max-w-7xl mx-auto w-full">
        {/* Sidebar / Music Player */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">Audio Module</h2>
            <div className="h-px flex-grow bg-white/10" />
          </div>
          <MusicPlayer />
          
          {/* Status Widget */}
          <div className="glass-panel p-4 border-white/10">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Hardware Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Latency', value: '0.4ms', color: 'text-neon-cyan' },
                { label: 'Synch', value: 'Active', color: 'text-neon-green' },
                { label: 'Bandwidth', value: '128.5 Gb/s', color: 'text-neon-pink' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase">{item.label}</span>
                  <span className={`text-xs font-mono font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Center / Game Area */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-8 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 px-4">
            <h2 className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">Simulation Interface</h2>
            <div className="h-px flex-grow bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_cyan]" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            <SnakeGame />
          </div>
          
          {/* Footer controls hints */}
          <div className="flex justify-center gap-12 mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">ARROWS</span>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">SPACE</span>
              <span>Pause / Play</span>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer Scroller */}
      <footer className="relative z-10 py-3 border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="flex overflow-hidden whitespace-nowrap">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-12 text-[10px] font-mono text-neon-cyan/40 uppercase tracking-[0.5em] pr-12"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i}>NEON RHYTHM SYSTEM • ACTIVE • NEON RHYTHM SYSTEM • ACTIVE</span>
            ))}
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

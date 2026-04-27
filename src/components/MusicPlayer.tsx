import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Disc3 } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  cover: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'CyberGen AI',
    duration: 184,
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    title: 'Digital Horizon',
    artist: 'SynthWave Architect',
    duration: 215,
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    title: 'Binary Dreams',
    artist: 'Neural Beats',
    duration: 162,
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      progressRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPlaying, currentTrack.duration]);

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % DUMMY_TRACKS.length);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(prev => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / currentTrack.duration) * 100;

  return (
    <div className="glass-panel p-6 border-white/10 w-full max-w-[400px]">
      <div className="flex flex-col gap-6">
        {/* Cover Art */}
        <div className="relative aspect-square rounded-xl overflow-hidden group">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          
          {isPlaying && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute top-4 right-4 text-neon-cyan/50"
            >
              <Disc3 className="w-8 h-8" />
            </motion.div>
          )}

          <div className="absolute bottom-4 left-4">
            <h3 className="text-xl font-bold neon-text-cyan">{currentTrack.title}</h3>
            <p className="text-sm text-slate-300 font-medium tracking-tight flex items-center gap-2">
              <Music2 className="w-3 h-3" />
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progressPercentage}%` }}
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink shadow-[0_0_8px_rgba(0,255,255,0.6)]"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <button className="text-slate-500 hover:text-white transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={handlePrev}
              className="text-white hover:text-neon-cyan transition-all hover:scale-110 active:scale-95"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white hover:border-neon-cyan transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current relative z-10" />
              ) : (
                <Play className="w-8 h-8 fill-current translate-x-0.5 relative z-10" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-white hover:text-neon-cyan transition-all hover:scale-110 active:scale-95"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <div className="w-5 h-5" /> {/* Spacer */}
        </div>

        {/* Track List Mini */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Queue</h4>
            {DUMMY_TRACKS.map((track, idx) => (
                <button 
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors text-left ${idx === currentTrackIndex ? 'bg-neon-cyan/10 ring-1 ring-neon-cyan/30' : 'hover:bg-white/5'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800 overflow-hidden flex-shrink-0">
                            <img src={track.cover} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className={`text-xs font-bold ${idx === currentTrackIndex ? 'text-neon-cyan' : 'text-slate-300'}`}>{track.title}</p>
                            <p className="text-[10px] text-slate-500">{track.artist}</p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}

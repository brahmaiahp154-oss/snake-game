import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(true);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      // Collision Detection
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food Consumption
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        // Increase speed slightly
        setSpeed(prev => Math.max(prev - 2, 60));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, isGameOver, isPaused, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      const pos = (canvas.width / GRID_SIZE) * i;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
      ctx.stroke();
    }

    const unit = canvas.width / GRID_SIZE;

    // Draw Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#ff00ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = index === 0 ? '#00ffff' : '#ff00ff';
      ctx.fillRect(
        segment.x * unit + 1,
        segment.y * unit + 1,
        unit - 2,
        unit - 2
      );
      ctx.shadowBlur = 0;
    });

    // Draw Food
    ctx.fillStyle = '#ffff00';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffff00';
    ctx.beginPath();
    ctx.arc(
      food.x * unit + unit / 2,
      food.y * unit + unit / 2,
      unit / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px]">
        <div className="glass-panel px-4 py-2 flex items-center gap-3 border-neon-cyan/50">
          <span className="text-xs uppercase tracking-widest text-slate-400">Score</span>
          <span className="text-2xl font-mono neon-text-cyan font-bold">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="glass-panel px-4 py-2 flex items-center gap-3 border-neon-pink/50">
          <Trophy className="w-4 h-4 text-neon-pink" />
          <span className="text-2xl font-mono neon-text-pink font-bold">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-yellow rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <div className="relative glass-panel p-1 border-white/10 overflow-hidden rounded-xl">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="game-canvas bg-dark-bg"
          />

          <AnimatePresence>
            {(isPaused || isGameOver) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
              >
                {isGameOver ? (
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    <h2 className="text-4xl font-bold italic neon-text-pink mb-2">GAME OVER</h2>
                    <p className="text-slate-400 mb-8 italic">Final Score: {score}</p>
                    <button
                      onClick={resetGame}
                      className="neon-border-pink px-8 py-3 bg-neon-pink/10 rounded-full flex items-center gap-2 group hover:bg-neon-pink/20"
                    >
                      <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                      RETRY
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                  >
                    <h2 className="text-4xl font-bold neon-text-cyan mb-8 tracking-tighter">NEON SNAKE</h2>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="neon-border-cyan px-10 py-4 bg-neon-cyan/10 rounded-full flex items-center gap-3 group hover:bg-neon-cyan/20"
                    >
                      <Play className="w-6 h-6 fill-neon-cyan" />
                      UNPAUSE
                    </button>
                    <p className="mt-6 text-xs text-slate-500 uppercase tracking-widest font-mono">
                      Use Arrow Keys to Move
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

// Define the types for our game state
export type GameState = 'start' | 'playing' | 'levelComplete' | 'gameOver' | 'leaderboard' | 'enterName';

export interface Tile {
  id: number;
  fruit: string;
  flipped: boolean;
  matched: boolean;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

interface GameContextType {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  currentLevel: number;
  setCurrentLevel: Dispatch<SetStateAction<number>>;
  tiles: Tile[];
  setTiles: Dispatch<SetStateAction<Tile[]>>;
  timeLeft: number;
  setTimeLeft: Dispatch<SetStateAction<number>>;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  flippedTiles: Tile[];
  setFlippedTiles: Dispatch<SetStateAction<Tile[]>>;
  matchedPairs: number;
  setMatchedPairs: Dispatch<SetStateAction<number>>;
  totalPairs: number;
  setTotalPairs: Dispatch<SetStateAction<number>>;
  mistakes: number;
  setMistakes: Dispatch<SetStateAction<number>>;
  playerName: string;
  setPlayerName: Dispatch<SetStateAction<string>>;
  leaderboard: LeaderboardEntry[];
  setLeaderboard: Dispatch<SetStateAction<LeaderboardEntry[]>>;
  addToLeaderboard: (name: string, score: number) => void;
  resetGame: () => void;
  startLevel: (level: number) => void;
  isGameCompleted: boolean;
  setIsGameCompleted: Dispatch<SetStateAction<boolean>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

// Load leaderboard from localStorage
const loadLeaderboard = (): LeaderboardEntry[] => {
  const savedLeaderboard = localStorage.getItem('fruityMatchLeaderboard');
  if (savedLeaderboard) {
    try {
      return JSON.parse(savedLeaderboard);
    } catch (e) {
      console.error('Failed to parse leaderboard data', e);
      return [];
    }
  }
  return [];
};

// Save leaderboard to localStorage
const saveLeaderboard = (leaderboard: LeaderboardEntry[]) => {
  localStorage.setItem('fruityMatchLeaderboard', JSON.stringify(leaderboard));
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [timeLeft, setTimeLeft] = useState(90); // Default for level 1
  const [score, setScore] = useState(0);
  const [flippedTiles, setFlippedTiles] = useState<Tile[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(loadLeaderboard());
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  // Save leaderboard to localStorage whenever it changes
  useEffect(() => {
    saveLeaderboard(leaderboard);
  }, [leaderboard]);

  const resetGame = () => {
    setGameState('start');
    setCurrentLevel(1);
    setTiles([]);
    setTimeLeft(90); // Updated default time for level 1
    setScore(0);
    setFlippedTiles([]);
    setMatchedPairs(0);
    setTotalPairs(0);
    setMistakes(0);
    setIsGameCompleted(false);
  };

  const startLevel = (level: number) => {
    setCurrentLevel(level);
    setMatchedPairs(0);
    setMistakes(0);
    setFlippedTiles([]);
    
    // Set time based on level difficulty
    if (level <= 3) {
      setTimeLeft(90); // Easy levels: 90 seconds
    } else if (level <= 6) {
      setTimeLeft(60); // Medium levels: 60 seconds
    } else {
      setTimeLeft(45); // Hard levels: 45 seconds
    }
    
    setGameState('playing');
  };

  const addToLeaderboard = (name: string, score: number) => {
    const newEntry: LeaderboardEntry = {
      name,
      score,
      date: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    };
    
    // Add new entry and sort by score (highest first)
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10
    
    setLeaderboard(updatedLeaderboard);
    setPlayerName('');
    setIsGameCompleted(false);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        currentLevel,
        setCurrentLevel,
        tiles,
        setTiles,
        timeLeft,
        setTimeLeft,
        score,
        setScore,
        flippedTiles,
        setFlippedTiles,
        matchedPairs,
        setMatchedPairs,
        totalPairs,
        setTotalPairs,
        mistakes,
        setMistakes,
        playerName,
        setPlayerName,
        leaderboard,
        setLeaderboard,
        addToLeaderboard,
        resetGame,
        startLevel,
        isGameCompleted,
        setIsGameCompleted
      }}
    >
      {children}
    </GameContext.Provider>
  );
}; 
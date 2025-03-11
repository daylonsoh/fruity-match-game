import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGame, Tile } from '../context/GameContext';
import TileComponent from './Tile';

interface VisibleProps {
  visible: boolean;
}

const GameBoardContainer = styled.div<VisibleProps>`
  display: ${({ visible }: { visible: boolean }) => (visible ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: #576574;
`;

const InfoValue = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e86de;
`;

interface GridProps {
  gridSize: number;
}

const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: repeat(${(props: GridProps) => props.gridSize}, 1fr);
  grid-gap: 10px;
  width: 100%;
  max-width: ${(props: GridProps) => props.gridSize * 90}px;
  margin: 0 auto;
`;

// Fruit images for the game
const fruits = [
  'apple', 'banana', 'orange', 'strawberry', 'grape', 
  'watermelon', 'pineapple', 'cherry', 'pear', 'kiwi',
  'mango', 'blueberry', 'peach', 'lemon', 'coconut'
];

const GameBoard: React.FC = () => {
  const { 
    gameState, 
    setGameState, 
    currentLevel, 
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
    setMistakes
  } = useGame();

  // Determine grid size based on level
  const getGridSize = () => {
    if (currentLevel <= 5) return 2; // 2x2 grid for levels 1-5
    return 3; // 3x3 grid for levels 6-10
  };

  // Determine how many tiles to flip at once
  const getTilesToFlip = () => {
    return currentLevel <= 5 ? 2 : 3;
  };

  const gridSize = getGridSize();
  const tilesToFlip = getTilesToFlip();

  // Initialize the game board
  useEffect(() => {
    if (gameState === 'playing') {
      initializeBoard();
    }
  }, [gameState, currentLevel]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer as NodeJS.Timeout);
            setGameState('gameOver');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, timeLeft, setTimeLeft, setGameState]);

  // Check for level completion
  useEffect(() => {
    if (gameState === 'playing' && matchedPairs === totalPairs && totalPairs > 0) {
      // Calculate score based on time left and mistakes
      const levelScore = Math.max(0, timeLeft * 10 - mistakes * 5);
      setScore((prev: number) => prev + levelScore);
      setGameState('levelComplete');
    }
  }, [matchedPairs, totalPairs, gameState, timeLeft, mistakes, setScore, setGameState]);

  // Check for matches when tiles are flipped
  useEffect(() => {
    // For levels 1-5, check for matches when 2 tiles are flipped
    // For levels 6-10, check for matches when 3 tiles are flipped
    if (flippedTiles.length === tilesToFlip) {
      // Check if all flipped tiles have the same fruit
      const firstFruit = flippedTiles[0].fruit;
      const allMatch = flippedTiles.every(tile => tile.fruit === firstFruit);
      
      if (allMatch) {
        // Match found
        setTiles((prev: Tile[]) => 
          prev.map((tile: Tile) => 
            flippedTiles.some(flippedTile => flippedTile.id === tile.id)
              ? { ...tile, matched: true }
              : tile
          )
        );
        setMatchedPairs((prev: number) => prev + 1);
        setFlippedTiles([]);
      } else {
        // No match
        setMistakes((prev: number) => prev + 1);
        
        // Flip back after a delay
        setTimeout(() => {
          setTiles((prev: Tile[]) => 
            prev.map((tile: Tile) => 
              flippedTiles.some(flippedTile => flippedTile.id === tile.id)
                ? { ...tile, flipped: false }
                : tile
            )
          );
          setFlippedTiles([]);
        }, 1000);
      }
    }
  }, [flippedTiles, setTiles, setMatchedPairs, setFlippedTiles, setMistakes, tilesToFlip]);

  const initializeBoard = () => {
    const gridSize = getGridSize();
    const tilesToFlip = getTilesToFlip();
    
    // For levels 1-5 (2 tiles to match), we need pairs
    // For levels 6-10 (3 tiles to match), we need triplets
    const groupSize = tilesToFlip;
    const totalGroups = Math.floor((gridSize * gridSize) / groupSize);
    setTotalPairs(totalGroups);
    
    // Select fruits for this level
    const levelFruits = [...fruits]
      .sort(() => 0.5 - Math.random())
      .slice(0, totalGroups);
    
    // Create groups of matching tiles
    const tileGroups = levelFruits.flatMap(fruit => {
      return Array(groupSize).fill(null).map(() => ({
        id: Math.random(),
        fruit,
        flipped: false,
        matched: false
      }));
    });
    
    // Shuffle the tiles
    const shuffledTiles = tileGroups.sort(() => 0.5 - Math.random());
    
    setTiles(shuffledTiles);
    setMatchedPairs(0);
  };

  const handleTileClick = (clickedTile: Tile) => {
    // Ignore clicks if already matched or flipped, or if max tiles are already flipped
    if (
      clickedTile.matched || 
      clickedTile.flipped || 
      flippedTiles.length >= tilesToFlip ||
      gameState !== 'playing'
    ) {
      return;
    }
    
    // Flip the tile
    setTiles((prev: Tile[]) => 
      prev.map((tile: Tile) => 
        tile.id === clickedTile.id ? { ...tile, flipped: true } : tile
      )
    );
    
    // Add to flipped tiles
    setFlippedTiles((prev: Tile[]) => [...prev, clickedTile]);
  };

  return (
    <GameBoardContainer visible={gameState === 'playing'}>
      <GameInfo>
        <InfoItem>
          <InfoLabel>Level</InfoLabel>
          <InfoValue>{currentLevel}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Time</InfoLabel>
          <InfoValue>{timeLeft}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Pairs</InfoLabel>
          <InfoValue>{matchedPairs}/{totalPairs}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Score</InfoLabel>
          <InfoValue>{score}</InfoValue>
        </InfoItem>
      </GameInfo>
      
      <Grid gridSize={gridSize}>
        {tiles.map(tile => (
          <TileComponent
            key={tile.id}
            tile={tile}
            onClick={() => handleTileClick(tile)}
          />
        ))}
      </Grid>
    </GameBoardContainer>
  );
};

export default GameBoard; 
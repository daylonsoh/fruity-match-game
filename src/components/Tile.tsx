import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Tile as TileType } from '../context/GameContext';

interface TileProps {
  tile: TileType;
  onClick: () => void;
}

interface FlippedProps {
  flipped: boolean;
}

interface MatchedProps {
  matched: boolean;
}

const TileContainer = styled.div<FlippedProps & MatchedProps>`
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* Square aspect ratio */
  perspective: 1000px;
  cursor: pointer;
  touch-action: manipulation;
`;

const TileInner = styled.div<FlippedProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  transform: ${(props: FlippedProps) => props.flipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const TileFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  user-select: none;
`;

const TileFront = styled(TileFace)`
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
  
  &::after {
    content: '?';
    font-size: 2.5rem;
    color: white;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  }
`;

const TileBack = styled(TileFace)<MatchedProps>`
  background-color: ${(props: MatchedProps) => props.matched ? '#c8e6c9' : 'white'};
  transform: rotateY(180deg);
  font-size: 2.5rem;
`;

// Emoji mapping for fruits
const fruitEmojis: Record<string, string> = {
  apple: '🍎',
  banana: '🍌',
  orange: '🍊',
  strawberry: '🍓',
  grape: '🍇',
  watermelon: '🍉',
  pineapple: '🍍',
  cherry: '🍒',
  pear: '🍐',
  kiwi: '🥝',
  mango: '🥭',
  blueberry: '🫐',
  peach: '🍑',
  lemon: '🍋',
  coconut: '🥥'
};

const Tile: React.FC<TileProps> = ({ tile, onClick }) => {
  const prevFlippedRef = useRef(tile.flipped);
  const prevMatchedRef = useRef(tile.matched);

  // Play sound effects when tile state changes
  useEffect(() => {
    // Play flip sound when tile is flipped
    if (tile.flipped && !prevFlippedRef.current) {
      playFlipSound();
    }
    
    // Play match sound when tile is matched
    if (tile.matched && !prevMatchedRef.current) {
      playMatchSound();
    }
    
    // Update refs for next render
    prevFlippedRef.current = tile.flipped;
    prevMatchedRef.current = tile.matched;
  }, [tile.flipped, tile.matched]);

  // Play flip sound
  const playFlipSound = () => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/card-flip.mp3`);
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  // Play match sound
  const playMatchSound = () => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/match-success.mp3`);
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const handleClick = () => {
    onClick();
  };

  return (
    <TileContainer 
      flipped={tile.flipped} 
      matched={tile.matched}
      onClick={handleClick}
    >
      <TileInner flipped={tile.flipped}>
        <TileFront />
        <TileBack matched={tile.matched}>
          {fruitEmojis[tile.fruit] || '🍎'}
        </TileBack>
      </TileInner>
    </TileContainer>
  );
};

export default Tile; 
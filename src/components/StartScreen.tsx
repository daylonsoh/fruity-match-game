import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

interface VisibleProps {
  visible: boolean;
}

const StartScreenContainer = styled.div<VisibleProps>`
  display: ${({ visible }: { visible: boolean }) => (visible ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  padding: 30px;
  background-image: url('/images/bush_tile.jpg');
  background-repeat: repeat;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 10;
`;

const LogoImage = styled.img`
  width: 45%;
  max-width: 240px;
  margin-bottom: 8px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 12px;
`;

const StartButton = styled.button`
  background-color: #4cd137;
  color: white;
  font-size: 1.5rem;
  padding: 15px 40px;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 220px;
  border: 3px solid #fff;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

  &:hover, &:active {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    background-color: #44bd32;
  }
`;

const LeaderboardButton = styled.button`
  background-color: #2e86de;
  color: white;
  font-size: 1.2rem;
  padding: 12px 30px;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 220px;
  border: 3px solid #fff;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

  &:hover, &:active {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    background-color: #2980b9;
  }
`;

const LevelSelect = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin: 12px 0;
`;

interface LevelButtonProps {
  isSelected: boolean;
}

const LevelButton = styled.button<LevelButtonProps>`
  background-color: ${({ isSelected }: { isSelected: boolean }) => (isSelected ? '#ff9f43' : '#f1f2f6')};
  color: ${({ isSelected }: { isSelected: boolean }) => (isSelected ? 'white' : '#2f3542')};
  font-size: 1.2rem;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  border: ${({ isSelected }: { isSelected: boolean }) => (isSelected ? '2px solid #fff' : '1px solid #ddd')};
  font-weight: ${({ isSelected }: { isSelected: boolean }) => (isSelected ? 'bold' : 'normal')};

  &:hover, &:active {
    background-color: #ff9f43;
    color: white;
    transform: translateY(-2px);
    border: 2px solid #fff;
  }
`;

const LevelInfo = styled.div`
  background-color: rgba(248, 249, 250, 0.9);
  border-radius: 10px;
  padding: 12px;
  margin: 12px 0;
  text-align: center;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InfoTitle = styled.h3`
  color:rgb(20, 51, 129);
  margin-top: 8px;
  margin-bottom: 8px;
`;

const InfoList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoItem = styled.li`
  margin-bottom: 8px;
  color: #576574;
`;

const InfoText = styled.p`
  color: #576574;
  font-size: 1.0rem;
`;

const StartScreen: React.FC = () => {
  const { gameState, currentLevel, setCurrentLevel, startLevel, setGameState, setScore } = useGame();
  
  // Reset score when returning to start screen
  useEffect(() => {
    if (gameState === 'start') {
      setScore(0);
    }
  }, [gameState, setScore]);
  
  const handleStartGame = () => {
    // Play button sound
    playButtonSound();
    startLevel(currentLevel);
  };

  const handleLevelSelect = (level: number) => {
    // Play button sound
    playButtonSound();
    setCurrentLevel(level);
  };

  const handleShowLeaderboard = () => {
    // Play button sound
    playButtonSound();
    setGameState('leaderboard');
  };

  // Play button sound
  const playButtonSound = () => {
    const audio = new Audio('/sounds/button-click.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  // Get level info based on selected level
  const getLevelInfo = () => {
    const gridSize = currentLevel <= 5 ? '2x2' : '3x3';
    const tilesToMatch = currentLevel <= 5 ? 2 : 3;
    let difficulty = 'Easy';
    let timeLimit = 90;
    
    if (currentLevel <= 3) {
      difficulty = 'Easy';
      timeLimit = 90;
    } else if (currentLevel <= 6) {
      difficulty = 'Medium';
      timeLimit = 60;
    } else {
      difficulty = 'Hard';
      timeLimit = 45;
    }
    
    return {
      gridSize,
      tilesToMatch,
      difficulty,
      timeLimit
    };
  };

  const levelInfo = getLevelInfo();

  return (
    <StartScreenContainer visible={gameState === 'start'}>
      <LogoImage src="/images/fruity_match_transparent.png" alt="Fruity Match" />
      
      <div>
        <h3 style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
          padding: '8px', 
          borderRadius: '8px',
          color: '#333',
          textShadow: '1px 1px 1px rgba(255, 255, 255, 0.5)'
        }}>
          Select Level:
        </h3>
        <LevelSelect>
          {[...Array(10)].map((_, index) => (
            <LevelButton
              key={index + 1}
              isSelected={currentLevel === index + 1}
              onClick={() => handleLevelSelect(index + 1)}
            >
              {index + 1}
            </LevelButton>
          ))}
        </LevelSelect>
      </div>
      
      <LevelInfo>
        <InfoTitle>Level {currentLevel} - {levelInfo.difficulty}</InfoTitle>
        <InfoList>
          <InfoItem><strong>Grid Size:</strong> {levelInfo.gridSize}</InfoItem>
          <InfoItem><strong>Match:</strong> {levelInfo.tilesToMatch} tiles at a time</InfoItem>
          <InfoItem><strong>Time Limit:</strong> {levelInfo.timeLimit} seconds</InfoItem>
        </InfoList>
        <InfoText>
          {currentLevel <= 5 
            ? "Flip two tiles at a time to find matching fruit pairs." 
            : "Flip three tiles at a time to find matching fruit triplets."}
        </InfoText>
      </LevelInfo>
      
      <ButtonsContainer>
        <StartButton onClick={handleStartGame}>Start Game</StartButton>
        <LeaderboardButton onClick={handleShowLeaderboard}>Leaderboard</LeaderboardButton>
      </ButtonsContainer>
    </StartScreenContainer>
  );
};

export default StartScreen; 
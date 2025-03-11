import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

interface VisibleProps {
  visible: boolean;
}

const LevelCompleteContainer = styled.div<VisibleProps>`
  display: ${({ visible }: { visible: boolean }) => (visible ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LevelCompleteCard = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  
  @keyframes popIn {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Title = styled.h2`
  color: #ff9f43;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  color: #576574;
  font-size: 1.2rem;
  margin-bottom: 30px;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: #2e86de;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: #576574;
`;

const GameplayInfo = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 1rem;
  color: #576574;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 25px;
  border-radius: 50px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover, &:active {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const NextButton = styled(Button)`
  background-color: #4cd137;
  color: white;
  
  &:hover, &:active {
    background-color: #44bd32;
  }
`;

const MenuButton = styled(Button)`
  background-color: #f1f2f6;
  color: #2f3542;
  
  &:hover, &:active {
    background-color: #dfe4ea;
  }
`;

const LeaderboardButton = styled(Button)`
  background-color: #2e86de;
  color: white;
  
  &:hover, &:active {
    background-color: #2980b9;
  }
`;

const LevelComplete: React.FC = () => {
  const { 
    gameState, 
    setGameState, 
    currentLevel, 
    timeLeft, 
    score,
    mistakes,
    startLevel,
    resetGame,
    isGameCompleted,
    setIsGameCompleted,
    setScore
  } = useGame();
  
  // Play level complete sound when component becomes visible
  useEffect(() => {
    if (gameState === 'levelComplete') {
      playLevelCompleteSound();
    }
  }, [gameState]);

  const handleNextLevel = () => {
    // Play button sound
    playButtonSound();
    
    if (currentLevel < 10) {
      startLevel(currentLevel + 1);
    } else {
      // If all levels are completed, go to enter name screen
      setIsGameCompleted(true);
      setGameState('enterName');
    }
  };
  
  const handleBackToMenu = () => {
    // Play button sound
    playButtonSound();
    setScore(0); // Reset score when going back to menu
    setGameState('start');
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

  // Play level complete sound
  const playLevelCompleteSound = () => {
    const audio = new Audio('/sounds/level-complete.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };
  
  // Calculate level score
  const levelScore = Math.max(0, timeLeft * 10 - mistakes * 5);
  
  // Determine star rating based on mistakes and time left
  const getStarRating = () => {
    if (mistakes === 0 && timeLeft > 15) return '⭐⭐⭐';
    if (mistakes <= 2 && timeLeft > 5) return '⭐⭐';
    return '⭐';
  };

  // Get next level gameplay info
  const getNextLevelInfo = () => {
    const nextLevel = currentLevel < 10 ? currentLevel + 1 : 1;
    const gridSize = nextLevel <= 5 ? '2x2' : '3x3';
    const tilesToMatch = nextLevel <= 5 ? 2 : 3;
    let timeLimit = 90;
    
    if (nextLevel <= 3) {
      timeLimit = 90; // Easy levels: 90 seconds
    } else if (nextLevel <= 6) {
      timeLimit = 60; // Medium levels: 60 seconds
    } else {
      timeLimit = 45; // Hard levels: 45 seconds
    }
    
    return `Next Level: ${gridSize} grid, match ${tilesToMatch} tiles, ${timeLimit} seconds`;
  };

  return (
    <LevelCompleteContainer visible={gameState === 'levelComplete'}>
      <LevelCompleteCard>
        <Title>
          {currentLevel === 10 ? 'Game Complete!' : `Level ${currentLevel} Complete!`}
        </Title>
        <Subtitle>{getStarRating()}</Subtitle>
        
        <StatsContainer>
          <StatItem>
            <StatValue>{timeLeft}</StatValue>
            <StatLabel>Seconds Left</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{mistakes}</StatValue>
            <StatLabel>Mistakes</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{levelScore}</StatValue>
            <StatLabel>Points</StatLabel>
          </StatItem>
        </StatsContainer>
        
        <p>Total Score: {score}</p>
        
        {currentLevel < 10 && (
          <GameplayInfo>
            {getNextLevelInfo()}
          </GameplayInfo>
        )}
        
        <ButtonContainer>
          <MenuButton onClick={handleBackToMenu}>Menu</MenuButton>
          
          {currentLevel < 10 ? (
            <NextButton onClick={handleNextLevel}>Next Level</NextButton>
          ) : (
            <>
              <LeaderboardButton onClick={handleShowLeaderboard}>Leaderboard</LeaderboardButton>
              <NextButton onClick={handleNextLevel}>Save Score</NextButton>
            </>
          )}
        </ButtonContainer>
      </LevelCompleteCard>
    </LevelCompleteContainer>
  );
};

export default LevelComplete; 
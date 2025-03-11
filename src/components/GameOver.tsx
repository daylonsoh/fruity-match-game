import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

interface VisibleProps {
  visible: boolean;
}

const GameOverContainer = styled.div<VisibleProps>`
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

const GameOverCard = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  
  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }
    
    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }
    
    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
`;

const Title = styled.h2`
  color: #ff6b6b;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  color: #576574;
  font-size: 1.2rem;
  margin-bottom: 30px;
`;

const ScoreDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #2e86de;
  margin-bottom: 30px;
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

const RetryButton = styled(Button)`
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

const GameOver: React.FC = () => {
  const { 
    gameState, 
    setGameState, 
    currentLevel, 
    score,
    startLevel,
    resetGame,
    setScore
  } = useGame();
  
  // Play game over sound when component becomes visible
  useEffect(() => {
    if (gameState === 'gameOver') {
      playGameOverSound();
    }
  }, [gameState]);
  
  const handleRetry = () => {
    // Play button sound
    playButtonSound();
    startLevel(currentLevel);
  };
  
  const handleBackToMenu = () => {
    // Play button sound
    playButtonSound();
    setScore(0); // Reset score when going back to menu
    resetGame();
  };
  
  const handleShowLeaderboard = () => {
    // Play button sound
    playButtonSound();
    setGameState('leaderboard');
  };

  // Play button sound
  const playButtonSound = () => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/button-click.mp3`);
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  // Play game over sound
  const playGameOverSound = () => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/game-over.mp3`);
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  return (
    <GameOverContainer visible={gameState === 'gameOver'}>
      <GameOverCard>
        <Title>Time's Up!</Title>
        <Subtitle>You ran out of time on level {currentLevel}</Subtitle>
        
        <ScoreDisplay>
          Final Score: {score}
        </ScoreDisplay>
        
        <ButtonContainer>
          <MenuButton onClick={handleBackToMenu}>Menu</MenuButton>
          <RetryButton onClick={handleRetry}>Try Again</RetryButton>
          <LeaderboardButton onClick={handleShowLeaderboard}>Leaderboard</LeaderboardButton>
        </ButtonContainer>
      </GameOverCard>
    </GameOverContainer>
  );
};

export default GameOver; 
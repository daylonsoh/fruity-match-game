import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

interface VisibleProps {
  visible: boolean;
}

const EnterNameContainer = styled.div<VisibleProps>`
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

const EnterNameCard = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  
  @keyframes bounceIn {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    70% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Title = styled.h2`
  color: #5f27cd;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  color: #576574;
  font-size: 1.2rem;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 1.2rem;
  border: 2px solid #dfe4ea;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s ease;
  text-align: center;
  font-family: 'Bubblegum Sans', sans-serif;
  
  &:focus {
    border-color: #5f27cd;
  }
`;

const CharacterCount = styled.span<{ isLimit: boolean }>`
  position: absolute;
  right: 10px;
  bottom: -20px;
  font-size: 0.8rem;
  color: ${props => props.isLimit ? '#ff6b6b' : '#576574'};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
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

const SubmitButton = styled(Button)`
  background-color: #4cd137;
  color: white;
  
  &:hover, &:active {
    background-color: #44bd32;
  }
  
  &:disabled {
    background-color: #dfe4ea;
    color: #a4b0be;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SkipButton = styled(Button)`
  background-color: #f1f2f6;
  color: #2f3542;
  
  &:hover, &:active {
    background-color: #dfe4ea;
  }
`;

const EnterName: React.FC = () => {
  const { 
    gameState, 
    setGameState, 
    score,
    playerName,
    setPlayerName,
    addToLeaderboard,
    leaderboard
  } = useGame();
  
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_LENGTH = 10;
  
  // Focus input when component becomes visible and initialize with playerName if available
  useEffect(() => {
    if (gameState === 'enterName') {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      // Initialize with existing playerName if available
      if (playerName) {
        setName(playerName);
      }
    }
  }, [gameState, playerName]);
  
  // Check if the current score qualifies for the leaderboard
  const scoreQualifiesForLeaderboard = (): boolean => {
    if (leaderboard.length < 10) {
      return true; // Leaderboard isn't full yet
    }
    
    // Check if score is higher than the lowest score on the leaderboard
    const lowestScore = leaderboard[leaderboard.length - 1]?.score || 0;
    return score > lowestScore;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      // Play button sound
      playButtonSound();
      
      // Update player name in context
      setPlayerName(name.trim());
      
      // Add to leaderboard
      addToLeaderboard(name.trim(), score);
      
      // Show leaderboard
      setGameState('leaderboard');
    }
  };
  
  const handleSkip = () => {
    // Play button sound
    playButtonSound();
    
    // Go back to start screen
    setGameState('start');
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Remove spaces
    const noSpaces = value.replace(/\s/g, '');
    
    // Limit to MAX_LENGTH characters
    if (noSpaces.length <= MAX_LENGTH) {
      setName(noSpaces);
    }
  };

  // Play button sound
  const playButtonSound = () => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/button-click.mp3`);
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  return (
    <EnterNameContainer visible={gameState === 'enterName'}>
      <EnterNameCard>
        <Title>Congratulations!</Title>
        <Subtitle>Your score: <strong>{score}</strong></Subtitle>
        
        {scoreQualifiesForLeaderboard() ? (
          <>
            <p>Your score qualifies for the leaderboard!</p>
            <Form onSubmit={handleSubmit}>
              <InputContainer>
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={handleNameChange}
                  maxLength={MAX_LENGTH}
                  aria-label="Your name"
                />
                <CharacterCount isLimit={name.length >= MAX_LENGTH}>
                  {name.length}/{MAX_LENGTH}
                </CharacterCount>
              </InputContainer>
              
              <ButtonContainer>
                <SkipButton type="button" onClick={handleSkip}>Skip</SkipButton>
                <SubmitButton type="submit" disabled={!name.trim()}>
                  Submit
                </SubmitButton>
              </ButtonContainer>
            </Form>
          </>
        ) : (
          <>
            <p>Sorry, your score didn't make it to the top 10.</p>
            <ButtonContainer>
              <SkipButton type="button" onClick={handleSkip}>Back to Menu</SkipButton>
              <SubmitButton type="button" onClick={() => setGameState('leaderboard')}>
                View Leaderboard
              </SubmitButton>
            </ButtonContainer>
          </>
        )}
      </EnterNameCard>
    </EnterNameContainer>
  );
};

export default EnterName; 
import React from 'react';
import styled from 'styled-components';
import { GameProvider } from './context/GameContext';
import StartScreen from './components/StartScreen';
import GameBoard from './components/GameBoard';
import LevelComplete from './components/LevelComplete';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';
import EnterName from './components/EnterName';
import SoundPreloader from './components/SoundPreloader';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  padding: 20px;
`;

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContainer>
        <SoundPreloader />
        <StartScreen />
        <GameBoard />
        <LevelComplete />
        <GameOver />
        <Leaderboard />
        <EnterName />
      </AppContainer>
    </GameProvider>
  );
};

export default App;

import React from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

interface VisibleProps {
  visible: boolean;
}

const LeaderboardContainer = styled.div<VisibleProps>`
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

const LeaderboardCard = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.5s ease-out forwards;
  
  @keyframes slideIn {
    0% {
      transform: translateY(-50px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Title = styled.h2`
  color: #5f27cd;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
  border-bottom: 2px solid #dfe4ea;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: center;
  color: #576574;
  font-weight: bold;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ isHighlighted?: boolean }>`
  border-bottom: 1px solid #dfe4ea;
  background-color: ${props => props.isHighlighted ? '#fff3cd' : 'transparent'};
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f1f2f6;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: center;
  color: #2f3542;
`;

const RankCell = styled(TableCell)`
  font-weight: bold;
  color: #5f27cd;
`;

const ScoreCell = styled(TableCell)`
  font-weight: bold;
  color: #2e86de;
`;

const EmptyMessage = styled.p`
  color: #576574;
  font-size: 1.2rem;
  margin: 30px 0;
  font-style: italic;
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

const BackButton = styled(Button)`
  background-color: #f1f2f6;
  color: #2f3542;
  
  &:hover, &:active {
    background-color: #dfe4ea;
  }
`;

const Leaderboard: React.FC = () => {
  const { 
    gameState, 
    setGameState, 
    leaderboard,
    playerName
  } = useGame();
  
  const handleBackToMenu = () => {
    // Play button sound
    playButtonSound();
    setGameState('start');
  };

  // Play button sound
  const playButtonSound = () => {
    const audio = new Audio('/sounds/button-click.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  return (
    <LeaderboardContainer visible={gameState === 'leaderboard'}>
      <LeaderboardCard>
        <Title>Leaderboard</Title>
        
        {leaderboard.length > 0 ? (
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Rank</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Score</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry, index) => (
                <TableRow 
                  key={index} 
                  isHighlighted={entry.name === playerName && playerName !== ''}
                >
                  <RankCell>{index + 1}</RankCell>
                  <TableCell>{entry.name}</TableCell>
                  <ScoreCell>{entry.score}</ScoreCell>
                  <TableCell>{entry.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyMessage>No scores yet. Be the first to play!</EmptyMessage>
        )}
        
        <ButtonContainer>
          <BackButton onClick={handleBackToMenu}>Back to Menu</BackButton>
        </ButtonContainer>
      </LeaderboardCard>
    </LeaderboardContainer>
  );
};

export default Leaderboard; 
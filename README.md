# Fruity Match Memory Game

A touch-friendly memory matching game designed for kids to enhance their memory and concentration skills. The game involves matching fruit graphics across different grid sizes, with increasing difficulty levels and time limits.

## Features

- **Progressive Difficulty**: 10 levels with increasing difficulty
- **Adaptive Grid Sizes**: 
  - Levels 1-5: 2x2 grid
  - Levels 6-10: 3x3 grid
- **Time Limits**: 
  - Easy Levels (1-3): 90 seconds
  - Medium Levels (4-6): 60 seconds
  - Hard Levels (7-10): 45 seconds
- **Colorful Fruit Graphics**: Uses emoji-based fruit graphics for visual appeal
- **Score Tracking**: Points awarded based on time left and mistakes made
- **Touch Optimized**: Designed specifically for tablet use with touch-friendly controls
- **Responsive Design**: Works on various screen sizes and orientations
- **Sound Effects**: Auditory feedback for button clicks, tile flips, matches, level completion, and game over
- **Leaderboard**: Records and displays the top 10 player scores
- **Player Names**: Allows players to enter their name (up to 10 characters) for the leaderboard

## Game Rules

### Levels 1-5:
- Players flip two tiles at a time to find matching fruit pairs
- If tiles do not match, they flip back over
- The game ends when all pairs are found within the time limit

### Levels 6-10:
- Players flip three tiles at a time to find matching fruit triplets
- If tiles do not match, they flip back over
- The game ends when all triplets are found within the time limit

## Technical Details

- Built with React and TypeScript
- Styled with styled-components
- Optimized for touch devices
- Responsive design for various screen sizes
- Local storage for persistent leaderboard data

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Fixing TypeScript Errors

If you encounter TypeScript errors related to styled-components, make sure to install the type definitions:

```
npm install @types/styled-components
```

For errors related to setState functions, update the GameContext.tsx file to use the Dispatch<SetStateAction<T>> type from React:

```typescript
import { Dispatch, SetStateAction } from 'react';

// Example:
setGameState: Dispatch<SetStateAction<GameState>>;
```

For component props, define proper interfaces:

```typescript
interface VisibleProps {
  visible: boolean;
}

const Container = styled.div<VisibleProps>`
  display: ${({ visible }: { visible: boolean }) => (visible ? 'flex' : 'none')};
`;
```

## Deployment

To build the app for production:

```
npm run build
```

This will create a `build` folder with the optimized production build.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Fruit emojis provided by standard Unicode emoji set
- Designed based on educational principles for children's cognitive development
- Sound effects created for enhanced user experience

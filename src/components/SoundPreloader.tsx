import React, { useEffect } from 'react';

const SoundPreloader: React.FC = () => {
  useEffect(() => {
    // List of all sound files used in the game
    const soundFiles = [
      `${process.env.PUBLIC_URL}/sounds/button-click.mp3`,
      `${process.env.PUBLIC_URL}/sounds/card-flip.mp3`,
      `${process.env.PUBLIC_URL}/sounds/match-success.mp3`,
      `${process.env.PUBLIC_URL}/sounds/level-complete.mp3`,
      `${process.env.PUBLIC_URL}/sounds/game-over.mp3`
    ];

    // Preload all sound files
    soundFiles.forEach(soundFile => {
      const audio = new Audio();
      audio.src = soundFile;
      // Just load the audio, don't play it
      audio.load();
    });
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default SoundPreloader; 
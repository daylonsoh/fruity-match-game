import React, { useEffect } from 'react';

const SoundPreloader: React.FC = () => {
  useEffect(() => {
    // List of all sound files used in the game
    const soundFiles = [
      '/sounds/button-click.mp3',
      '/sounds/card-flip.mp3',
      '/sounds/match-success.mp3',
      '/sounds/level-complete.mp3',
      '/sounds/game-over.mp3'
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
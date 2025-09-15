'use client';
import { useContext } from 'react';
import AudioContext from '../context/AudioProvider';

// export const useAudio = () => useContext(AudioContext);
export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error('useAudio must be used within AudioProvider');
    return context;
};

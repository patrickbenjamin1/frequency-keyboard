import * as React from 'react';

export interface IEnvelope {
  // in seconds
  attack: number;
  // in seconds
  decay: number;
  // level out of 1
  sustain: number;
  // in seconds
  release: number;
  // level out of 1
  level: number;
}

export const useEnvelope = (envelope: IEnvelope, gainNode: GainNode, audioContext: AudioContext) => {
  const attackTimeout = React.useRef<NodeJS.Timeout>();

  const decay = React.useCallback(() => {
    gainNode.gain.setTargetAtTime(envelope.sustain, audioContext.currentTime, envelope.decay);
  }, []);

  const start = React.useCallback(() => {
    gainNode.gain.setTargetAtTime(envelope.level, audioContext.currentTime, envelope.attack);
  }, []);

  const end = React.useCallback(() => {
    gainNode.gain.setTargetAtTime(0, audioContext.currentTime, envelope.release);
  }, []);
};
